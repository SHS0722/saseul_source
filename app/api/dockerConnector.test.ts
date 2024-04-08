import Dockerode from "dockerode";
import { expect, test } from '@jest/globals';
import { DockerConnector } from "./dockerConnector";

test("getContainerInfo test", async () => {
    const docker = new Dockerode()
    const connector = new DockerConnector(docker)
    const res = await connector.getContainerInfo("a13ba")
    // console.log(res.NetworkSettings.Networks)
    expect(1).toBe(1)
})
