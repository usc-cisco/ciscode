import { UserStatisticsSchema } from "@/dtos/user-statistics.dto";
import UserStatisticsService from "@/services/user-statistics.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const statistics = await UserStatisticsService.getUserStatistics(userId);
    const validatedStatistics = UserStatisticsSchema.parse(statistics);

    return NextResponse.json(
      {
        message: "User statistics retrieved successfully",
        data: validatedStatistics,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 },
    );
  }
}
