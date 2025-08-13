export const runtime = "nodejs";


import { PtyModule, runCCode } from "@/lib/code-runner";
import { RunCodeResponseSchema, RunCodeSchema } from "@/dtos/code.dto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const pty = (await import("node-pty"));

    try {
        const body = await req.json();
        const parsedData = await RunCodeSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const { code, input } = parsedData.data;

        const result = await runCCode(code, input || "", pty as PtyModule);

        return NextResponse.json({
            message: "Code executed successfully",
            data: RunCodeResponseSchema.parse(result)
        }, { status: result.error ? 500 : 200 });
    }
    catch (error) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}