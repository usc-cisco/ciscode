
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest) => {
    try {
        const count = await UserService.getTotalCount();
        const lastMonthCount = await UserService.getLastMonthCount();
        return NextResponse.json({
            message: "Successfully fetched user count",
            data: {
                count,
                lastMonthCount
            }
        })
    }
    catch (error) {
        console.error("Error fetching user count:", error);
        return NextResponse.json({
            message: "Failed to fetch user count",
        });
    }
}