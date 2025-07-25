import { runCCode } from "@/lib/code-runner";
import { RunCodeSchema } from "@/dtos/code.dto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsedData = await RunCodeSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const { code, input } = parsedData.data;

        const result = await runCCode(code, input || "");

        return NextResponse.json(result, { status: result.error ? 500 : 200 });
    }
    catch (error) {
        console.error("Error running code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}