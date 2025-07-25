import { NextRequest, NextResponse } from "next/server";
import RoleEnum from "./types/enums/role.enum";

export function requireRole(handler: any, roles: RoleEnum[]) {
  return async (req: NextRequest, ...args: any[]) => {
    const role = req.headers.get("x-user-role");
    if (!role || !roles.includes(role as RoleEnum)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return handler(req, ...args);
  };
}
