import { requireRole } from "@/lib/require-role";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import RoleEnum from "@/lib/types/enums/role.enum";
import ActivityLogService from "@/services/activity-log.service";
import ProblemService from "@/services/problem.service";
import SubmissionService from "@/services/submission.service";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = requireRole<[{ params: Promise<{ id: string }> }]>(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const { id } = await context.params;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { error: "Invalid problem ID" },
        { status: 400 },
      );
    }

    const userIdString = req.headers.get("x-user-id");
    if (!userIdString || isNaN(Number(userIdString))) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    try {
      const problem = await ProblemService.getProblemById(Number(id), true);
      if (!problem) {
        return NextResponse.json(
          { error: "Problem not found" },
          { status: 404 },
        );
      }

      const author = await UserService.getUserById(problem.authorId);
      if (!author) {
        return NextResponse.json(
          { error: "Author not found" },
          { status: 404 },
        );
      }

      problem.author = author.name;

      const count = await SubmissionService.getSubmissionCountByProblemId(
        Number(id),
      );

      return NextResponse.json(
        {
          message: "Problem fetched successfully",
          data: {
            ...problem,
            numOfSubmissions: count,
          },
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error fetching problem:", error);
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 },
      );
    }
  },
  [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
);
