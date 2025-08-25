export const runtime = "nodejs";

import { PtyModule, runCCode } from "@/lib/code-runner";
import { CheckCodeResponseSchema } from "@/dtos/code.dto";
import { NextRequest, NextResponse } from "next/server";
import TestCaseService from "@/services/testcase.service";
import TestCaseSubmissionStatusEnum from "@/lib/types/enums/submissionstatus.enum";
import { requireRole } from "@/lib/require-role";
import RoleEnum from "@/lib/types/enums/role.enum";

export const POST = requireRole(
  async (req: NextRequest, context: { params: Promise<{ id: string }> }) => {
    const pty = await import("node-pty");

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

    const testCaseId = Number(id);

    try {
      const body = await req.json();
      const { code } = body;
      if (!code) {
        return NextResponse.json(
          { error: "Code is required" },
          { status: 400 },
        );
      }

      // Fetch the test case by ID
      const testCase = await TestCaseService.getTestCaseById(testCaseId);
      if (!testCase) {
        return NextResponse.json(
          { error: "Test case not found" },
          { status: 404 },
        );
      }

      const result = await runCCode(
        code,
        testCase.input || "",
        pty as PtyModule,
      );

      let status = TestCaseSubmissionStatusEnum.COMPLETED;

      if (result.error || result.output !== testCase.output) {
        status = TestCaseSubmissionStatusEnum.FAILED;
      }

      return NextResponse.json({
        message: "Code executed successfully",
        data: CheckCodeResponseSchema.parse({
          output: result.output,
          error: result.error,
          status,
        }),
      });
    } catch (error) {
      console.error("Error running code:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  },
  [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
);
