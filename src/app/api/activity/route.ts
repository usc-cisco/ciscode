import { requireRole } from "@/lib/require-role";
import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import RoleEnum from "@/lib/types/enums/role.enum";
import ActivityLogService from "@/services/activity-log.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = requireRole(
  async (req: NextRequest) => {
    try {
      const searchParams = req.nextUrl.searchParams;
      const offset = searchParams.get("offset")
        ? Number(searchParams.get("offset"))
        : 0;
      const limit = searchParams.get("limit")
        ? Number(searchParams.get("limit"))
        : 10;
      const search = searchParams.get("search") || "";
      const actionType =
        (searchParams.get("actionType") as ActionTypeEnum) || undefined;

      const logs = await ActivityLogService.getLogs(
        offset,
        limit,
        search,
        actionType,
      );
      const totalCount = await ActivityLogService.getTotalCount(
        search,
        actionType,
      );

      return NextResponse.json(
        {
          data: {
            logs,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
          },
        },
        { status: 200 },
      );
    } catch (error) {
      console.error("Error fetching problems:", error);
      return NextResponse.json(
        { error: (error as { message: string }).message },
        { status: 500 },
      );
    }
  },
  [RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN],
);
