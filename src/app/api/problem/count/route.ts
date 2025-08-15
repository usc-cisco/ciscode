import ProblemService from "@/services/problem.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const searchParams = req.nextUrl.searchParams;
    const verified = searchParams.get("verified") !== "false";
    const count = await ProblemService.getTotalCount(verified);
    const lastMonthCount = await ProblemService.getLastMonthCount(verified);
    return NextResponse.json({
      message: "Successfully fetched problem count",
      data: {
        count,
        lastMonthCount,
      },
    });
  } catch (error) {
    console.error("Error fetching problem count:", error);
    return NextResponse.json({
      message: "Failed to fetch problem count",
    });
  }
};
