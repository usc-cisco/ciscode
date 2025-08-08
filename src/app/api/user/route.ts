import { RegisterRequestSchema } from "@/dtos/user.dto";
import { requireRole } from "@/lib/require-role";
import RoleEnum from "@/lib/types/enums/role.enum";
import UserService from "@/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const searchParams = req.nextUrl.searchParams;
        const offset = searchParams.get("offset") ? Number(searchParams.get("offset")) : 0;
        const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 10;
        const search = searchParams.get("search") || "";
        const role = searchParams.get("role") || null;

        const users = await UserService.getUsers(offset, limit, search, role ? role as RoleEnum : null);
        const totalCount = await UserService.getTotalCount();

        return NextResponse.json({ data: {
            users: users,
            totalPages: Math.ceil(totalCount / limit),
            totalCount
        } }, { status: 200 });
    }
    catch (error: any) {
        console.error("Error fetching problems:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const POST = requireRole(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const parsedData = await RegisterRequestSchema.safeParseAsync(body);
        if (!parsedData.success) {
            return NextResponse.json({ error: parsedData.error }, { status: 400 });
        }

        if (parsedData.data.role === RoleEnum.SUPER_ADMIN) {
            return NextResponse.json({ error: "Cannot register as super admin" }, { status: 400 });
        }

        const user = await UserService.addUser({
            ...parsedData.data,
        });
        if (!user) {
            return NextResponse.json({ error: "User registration failed" }, { status: 500 });
        }

        return NextResponse.json({ user }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}, [RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN])