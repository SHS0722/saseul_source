import { RouteModuleHandleContext } from "next/dist/server/future/route-modules/route-module";
import { NextResponse } from "next/server";
import { getOption } from "../optionProvider";
import { cronJob } from "@/app/batch/cron";
import { logger } from "../../node/logger";

export async function GET(
    request: Request,
    context: RouteModuleHandleContext
): Promise<NextResponse> {
    const id = context.params?.id as string;
    const option = getOption();
    logger.info({cron: cronJob.running, msg: "cron: cron job status"})

    return NextResponse.json({ id, value: option[id] });
}

export async function PUT(
    request: Request,
    context: RouteModuleHandleContext
): Promise<NextResponse> {
    const id = context.params?.id as string;
    const req = await request.json();
    const option = getOption();

    option[id] = req.value;
    return NextResponse.json({ id, value: option[id] });
}

