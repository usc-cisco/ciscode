import { SignJWT, jwtVerify } from "jose";
import env from "@/lib/env";
import { UserResponseSchemaType } from "@/dtos/user.dto";

const encoder = new TextEncoder();
const secret = encoder.encode(env.JWT_SECRET);

export async function signToken(payload: UserResponseSchemaType, expiresIn = "1h") {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresIn)
    .sign(secret);

  return jwt;
}

export async function verifyToken(token: string): Promise<UserResponseSchemaType | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as UserResponseSchemaType;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}