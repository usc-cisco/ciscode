import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import RoleEnum from "@/lib/types/enums/role.enum";
import ActivityLogService from "@/services/activity-log.service";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const role = (await req.headers.get("x-user-role")) as RoleEnum;
    if (!role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const adminId = await req.headers.get("x-user-id");
    if (!adminId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const admin = await UserService.getUserById(Number(adminId));
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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

    if (user.role === RoleEnum.SUPER_ADMIN && role !== RoleEnum.SUPER_ADMIN) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await UserService.updateUserByUsername({
      username: user.username,
      role: user.role,
      password: newPassword,
      confirmPassword,
    });

    await ActivityLogService.createLogEntry(
      Number(adminId),
      `[${admin.username} - ${admin.name}] updated user [${user.username} - ${user.name}] password.`,
      ActionTypeEnum.UPDATE,
    );

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
