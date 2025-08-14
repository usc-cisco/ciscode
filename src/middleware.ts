import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/api/auth")) {
        return NextResponse.next();
    }

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({"error": "Unauthorized"}, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (payload === null) {
        return NextResponse.json({"error": "Forbidden"}, { status: 403 });
    }


    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", String(payload.id));
    requestHeaders.set("x-user-role", payload.role);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

export const config = {
  matcher: [
    "/api/:path*",
  ],
};
