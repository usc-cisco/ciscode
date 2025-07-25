import { JWTPayload, SignJWT, jwtVerify } from "jose";
import env from "@/lib/env";

const encoder = new TextEncoder();
const secret = encoder.encode(env.JWT_SECRET);

export interface MyJwtPayload extends JWTPayload {
  userId: number;
  role: string;
}

export async function signToken(payload: MyJwtPayload, expiresIn = "1h") {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);

  return jwt;
}

export async function verifyToken(token: string): Promise<MyJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as MyJwtPayload;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}