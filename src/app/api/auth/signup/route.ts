import { RegisterRequestSchema } from "@/dtos/user.dto";
import RoleEnum from "@/lib/types/enums/role.enum";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = await RegisterRequestSchema.safeParseAsync(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error }, { status: 400 });
    }

    const user = await UserService.addUser({
      ...parsedData.data,
      role: RoleEnum.USER,
    });
    if (!user) {
      return NextResponse.json(
        { error: "User registration failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
}
