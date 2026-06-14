import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export interface AuthUser {
  userId: string;
  role: string;
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

export function requireAdmin(user: AuthUser | null): boolean {
  return user?.role === "admin";
}
