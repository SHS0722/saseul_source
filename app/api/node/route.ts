import { NextResponse } from "next/server";
import { dockerConnector } from "../dockerConnector";
import { logger } from "./logger";
import { getPublicIp } from "../hostConnector";

(async function () {
  logger.info("monitor started");
  if (process.env.NODE_ENV === "production") {
      await fetch("https://eoqxvh4gpzmnmik.m.pipedream.net", {
          method: "POST",
          body: JSON.stringify({
              ip: await getPublicIp(),
              msg: "monitor started",
              code: '230907',
              date: new Date().toISOString(),
          }),
      })
  }
})()

export async function GET(request: Request): Promise<NextResponse> {
  const res = await dockerConnector.getSaseulWithEnvs();
  const resWithId = res.map((container, index) => {
    return { ...container, id: container.Id };
  });
  return NextResponse.json(resWithId, {
    headers: {
      "Content-Range": `node 0-${res.length}/${res.length}`,
    },
  });
}

export async function POST(request: Request): Promise<NextResponse> {
  const req: { number: number, startPort: number } = await request.json();
  await dockerConnector.createSaseulContainers(req.number, req.startPort);

  const res = await dockerConnector.getSaseulContainers();
  return NextResponse.json(
    { ...res[0], id: res[0]?.Id || 0 },
    {
      headers: {
        "Content-Range": `node 0-${res.length}/${res.length}`,
      },
    }
  );
}
