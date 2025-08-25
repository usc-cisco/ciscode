import { LoginRequestSchema } from "@/dtos/user.dto";
import { signToken } from "@/lib/jwt";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import ActivityLogService from "@/services/activity-log.service";
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
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = await signToken(user, "1d");

    await ActivityLogService.createLogEntry(
      user.id,
      `[${user.username} - ${user.name}] Logged in.`,
      ActionTypeEnum.SESSION_START,
    );

    return NextResponse.json(
      { message: "Login successful", data: { token, role: user.role } },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
}
