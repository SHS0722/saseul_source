import Dockerode, {
} from "dockerode";
import { logger } from "./node/logger";
import { Info, getInfo, getPublicIp } from "./hostConnector";
import fse from "fs-extra";
import os from 'os'
import { stringify } from "querystring";

const NAME_PREFIX = "saseul-node-";
const NAME = (port: number) => `${NAME_PREFIX}${port}`;

const HOST_DATA_PATH = process.env["HOST_DATA_PATH"] || `${os.homedir}/다운로드`
const DATA_PATH = process.env["DATA_PATH"] || process.env["HOST_DATA_PATH"] || `${os.homedir}/다운로드`
const ORIGINAL_DATA_DIR = `${DATA_PATH}/saseul_data`
const HOST_DATA_DIR = (port: number) => `${HOST_DATA_PATH}/saseul_data.${port}`;
const DATA_DIR = (port: number) => `${DATA_PATH}/saseul_data.${port}`;

const DOCKER_NETWORK = "ubhy"

const prohibittedPort = [87, 95]

export class DockerConnector {
  private dockerode: Dockerode;
  private START_PORT = 50000;
  private IMAGE = "artifriends/saseul-network:latest";
  private publicIp: string | undefined;

  constructor(docker: Dockerode) {
    this.dockerode = docker;
    getPublicIp().then((ip) => {
      this.publicIp = ip;
    });
  }

  async getSaseulContainers() {
    return await this.dockerode.listContainers({
      all: true,
      filters: { name: { [NAME_PREFIX]: true } },
    });
  }

  async getContainer(id: string) {
    return await this.dockerode.getContainer(id);
  }
  async getContainerInfo(id: string) {
    const container = await this.getContainer(id);
    return await container.inspect();
  }

  private async createContainer(port: number) {
    await this.deleteContainerByPort(port);
    const dataDir = DATA_DIR(port);
    const hostDataDir = HOST_DATA_DIR(port);
    const childLogger = logger.child({ port });

    if (!fse.existsSync(dataDir) && fse.existsSync(ORIGINAL_DATA_DIR)) {
      await fse.copy(ORIGINAL_DATA_DIR, dataDir)
    }
    const container = await this.dockerode
      .createContainer({
        Image: this.IMAGE,
        name: NAME(port),
        HostConfig: {
          PortBindings: {
            "80/tcp": [{ HostPort: `${port}` }],
          },
          Binds: [`${hostDataDir}:/var/saseul/saseul-network/data`],
          RestartPolicy: {
            Name: "unless-stopped"
          },
          NetworkMode: DOCKER_NETWORK,
        },
      })
    childLogger.setBindings({ containerId: container.id })

    await container.start();
    await container
      .exec({
        Cmd: ["saseul-script", "setenv", "--all"],
        AttachStdout: true,
        AttachStdin: true,
        AttachStderr: true,
      }).then((exec) => exec.start({ hijack: true, stdin: true }))
      .then((stream) => {
        return new Promise((resolve, reject) => {
          stream.on("readable", () => {
            const s = stream.read()?.toString();
            childLogger.info({ stream: s, msg: "readable" });
            if (!s) {
              return;
            }
            for (let i = 0; i < (s.match(/\n/g) || []).length; i++) {
              stream.write("y\n");
            }
          })
          stream.on("end", () => {
            resolve(true)
          })
          stream.on("error", (err) => {
            reject(err)
          })
        })
      })
      .catch((e) => {
        logger.error(e);
      });
    if (!this.publicIp) {
      return;
    }
    dockerConnector.exec(
      container.id,
      `saseul-script setenv --endpoint ${this.publicIp}:${port}`
    )
  }

  async createSaseulContainers(num: number, startPort: number = this.START_PORT) {
    await this.dockerode.createImage({ fromImage: this.IMAGE });
    let i = 0
    let port = startPort
    while (i < num) {
      if (prohibittedPort.includes(port)) {
        port++;
        continue;
      }
      try {
        await this.createContainer(port);
        i++;
        port++;
      } catch (error) {
        logger.error(error);
      }
    }
  }

  async deleteContainer(id: string) {
    return await this.dockerode.getContainer(id).remove({ force: true });
  }

  private async deleteContainerByPort(port: number) {
    const c = await this.dockerode.listContainers({
      all: true,
      filters: { name: { [`^/${NAME(port)}$`]: true } },
    });
    if (c.length === 0) {
      return;
    }
    const container = c[0];
    await this.deleteContainer(container.Id);
  }

  async getSaseulWithEnvs() {
    const containers = await this.getSaseulContainers();
    const envsAndInfos = await Promise.all(
      containers.map(async (container) => {
        try {
          const containerInfo = await this.getContainerInfo(container.Id)
          const ipAddr = containerInfo.NetworkSettings.Networks[DOCKER_NETWORK].IPAddress
          const [info, miner, endpoint] = await Promise.all([
            getInfo(ipAddr),
            this.exec(container.Id, "saseul-script getenv -m"),
            this.exec(container.Id, "saseul-script getenv -e"),
          ])
          return [{ miner, endpoint }, info]
        } catch (error) {
          logger.error({ error: error, container }, "getenv failed")
          return [undefined, undefined];
        }
      })
    );
    return containers.map((container, index) => {
      const [env, info] = envsAndInfos[index];
      return { ...container, env: env as { miner: string, endpoint: string }, info: info as Info };
    });
  }

  async exec(id: string, cmd: string) {
    const execLogger = logger.child({ id, cmd });
    const container = await this.dockerode.getContainer(id);

    const exec = await container.exec({
      Cmd: cmd.split(" "),
      AttachStdout: true,
      AttachStderr: true,
    });
    execLogger.info("exec start");
    const stream = await exec.start({});
    return new Promise((resolve, reject) => {
      let output = "";
      stream?.on("data", (chunk) => {
        output += chunk.toString();
      });
      stream?.on("end", () => {
        const s = output.replace(/[^a-z0-9 ,.?!:]/ig, "");
        execLogger.info({ s }, "exec end");
        return resolve(s);
      });
      stream?.on("error", (err) => {
        execLogger.error({ err }, "exec error");
        return reject(err);
      });
    });
  }
}

export const dockerConnector = new DockerConnector(new Dockerode());
