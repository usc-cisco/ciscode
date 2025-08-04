import { LoginRequestSchema } from "@/dtos/user.dto";
import { signToken } from "@/lib/jwt";
import UserService from "@/services/user.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parsedData = await LoginRequestSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const user = await UserService.login(parsedData.data);
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signToken({
            userId: user.id,
            role: user.role,
        }, "1d");

        return NextResponse.json({ message: "Login successful", data: { token, role: user.role } }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error during login:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}