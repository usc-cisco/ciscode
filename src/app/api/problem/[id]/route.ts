import { sequelize } from "@/db/sequelize";
import ProblemService from "@/services/problem.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, context: { params: { id: string } }) {
    const { id } = context.params;
    if (!id || isNaN(Number(id))) {
        return NextResponse.json({ error: "Invalid problem ID" }, { status: 400 });
    }

    try {
        console.log("Sequelize dialect:", sequelize.getDialect());
        const problem = await ProblemService.getProblemById(Number(id));
        if (!problem) {
            return NextResponse.json({ error: "Problem not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Problem fetched successfully", data: problem }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching problem:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}