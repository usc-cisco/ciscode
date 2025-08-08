import { RunCodeSchema } from "@/dtos/code.dto";
import { RegisterRequestSchema } from "@/dtos/user.dto";
import RoleEnum from "@/lib/types/enums/role.enum";
import UserService from "@/services/user.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsedData = await RegisterRequestSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const user = await UserService.addUser({
            ...parsedData.data,
            role: RoleEnum.USER
        });
        if (!user) {
            return NextResponse.json({ error: "User registration failed" }, { status: 500 });
        }

        return NextResponse.json({ user }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}