import { LoginRequestSchema } from "@/dtos/user.dto";
import { signToken } from "@/lib/jwt";
import UserService from "@/services/user.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const parsedData = await LoginRequestSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        const user = await UserService.login(parsedData.data);
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = await signToken(user, "1d");

        return NextResponse.json({ message: "Login successful", data: { token, role: user.role } }, { status: 200 });
    }
    catch (error) {
        console.error("Error during login:", error);
        return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
    }
}