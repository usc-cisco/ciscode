export const runtime = "nodejs";

import { AddProblemSchema } from "@/dtos/problem.dto";
import { PtyModule } from "@/lib/code-runner";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import ActivityLogService from "@/services/activity-log.service";
import ProblemService from "@/services/problem.service";
import TestCaseService from "@/services/testcase.service";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const pty = await import("node-pty");

  const userIdString = req.headers.get("x-user-id");
  if (!userIdString || isNaN(Number(userIdString))) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const userId = Number(userIdString);

  try {
    const body = await req.json();
    const parsedData = await AddProblemSchema.safeParseAsync(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: parsedData.error }, { status: 400 });
    }

    const data = parsedData.data;
    data.verified = false;

    const newProblem = await ProblemService.addProblem(data, userId);

    const testCases = await TestCaseService.addTestCases(
      data.testCases ?? [],
      newProblem,
      pty as PtyModule,
    );

    await ActivityLogService.createLogEntry(
      userId,
      `[${newProblem.authorId} - ${newProblem.author}] offered problem [${newProblem.id} - ${newProblem.title}].`,
      ActionTypeEnum.CREATE,
    );

    return NextResponse.json(
      {
        message: "Problem offered successfully",
        data: {
          ...newProblem,
          testCases,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error running code:", error);
    return NextResponse.json(
      { error: (error as { message: string }).message },
      { status: 500 },
    );
  }
};
