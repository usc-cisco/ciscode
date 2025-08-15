import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const userId = parseInt((await params).id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();

    const { newPassword, confirmPassword } = body;

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await UserService.updateUserByUsername({
      username: user.username,
      role: user.role,
      password: newPassword,
      confirmPassword,
    });

    return NextResponse.json(
      {
        message: "User updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
};
