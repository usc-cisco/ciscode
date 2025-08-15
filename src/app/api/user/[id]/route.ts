import { requireRole } from "@/lib/require-role";
import RoleEnum from "@/lib/types/enums/role.enum";
import SubmissionService from "@/services/submission.service";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) => {
  const userId = parseInt((await params).id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  // Fetch user data from the database or any other source
  const user = await UserService.getUserById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const submissionActivities =
    await SubmissionService.getRecentUserSubmissions(userId);

  return NextResponse.json(
    {
      message: "User fetched successfully",
      data: {
        user,
        submissionActivities,
      },
    },
    { status: 200 },
  );
};

export const PATCH = requireRole(
  async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const role = (await req.headers.get("x-user-role")) as RoleEnum;
      if (!role) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const userId = parseInt((await params).id);
      if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const body = await req.json();

      const user = await UserService.getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      if (user.role === RoleEnum.SUPER_ADMIN && role !== RoleEnum.SUPER_ADMIN) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      const updatedUser = await UserService.updateUserById(userId, body);

      return NextResponse.json(
        {
          message: "User updated successfully",
          data: updatedUser,
        },
        { status: 200 },
      );
    } catch (error) {
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 },
      );
    }
  },
  [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
);
