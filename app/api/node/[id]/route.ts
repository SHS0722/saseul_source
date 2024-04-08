import { RouteModuleHandleContext } from "next/dist/server/future/route-modules/route-module";
import { NextResponse, NextRequest } from "next/server";
import { dockerConnector } from "../../dockerConnector";
import { bulkActions } from "@/app/common/actions";

export async function GET(request: NextRequest) {
  return NextResponse.json({});
}

export async function DELETE(
  request: Request,
  context: RouteModuleHandleContext
): Promise<NextResponse> {
  const id = context.params?.id as string;
  return NextResponse.json(dockerConnector.deleteContainer(id));
}

export async function PUT(request: Request, context: RouteModuleHandleContext) {
  const id = context.params?.id as string;
  const req = await request.json();
  const containerInfo = await dockerConnector.getContainerInfo(id);
  const res: any = {};

  for (const {label, command} of bulkActions) {
    if (req[label]) {
      res[label] = await dockerConnector.exec(id, `saseul-script ${command}`);
    }
  }

  res.miner =
    req.miner &&
    (await dockerConnector.exec(id, `saseul-script setenv -m ${req.miner}`));
  const port = containerInfo.HostConfig.PortBindings["80/tcp"][0].HostPort

  res.ip =
    req.ip &&
    (await dockerConnector.exec(
      id,
      `saseul-script setenv --endpoint ${req.ip}:${port}`
    ));
  return NextResponse.json(res);
}
