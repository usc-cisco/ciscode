
import SubmissionService from "@/services/submission.service";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const userId = parseInt((await params).id);
    if (isNaN(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    // Fetch user data from the database or any other source
    const user = await UserService.getUserById(userId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const submissionActivities = await SubmissionService.getRecentUserSubmissions(userId);

    return NextResponse.json({
        message: "User fetched successfully",
        data: {
            user,
            submissionActivities
        }
    }, { status: 200 });
};

export const PATCH = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const userId = parseInt((await params).id);
        if (isNaN(userId)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const body = await req.json();

        const { currentPassword, newPassword, confirmPassword } = body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const user = await UserService.getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const loggedInUser = await UserService.login({
            username: user.username,
            password: currentPassword
        })

        if (!loggedInUser) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        await UserService.updateUser({
            username: user.username,
            role: user.role,
            password: newPassword,
            confirmPassword
        })

        return NextResponse.json({
            message: "User updated successfully",
        }, { status: 200 });
    }
    catch(error) {
        return NextResponse.json({ error: (error as { message: string }).message }, { status: 500 });
    }

    
};