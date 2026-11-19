import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_JWT_SECRET =
  process.env.NEXTAUTH_SECRET || "guaranteedtech_super_secret_jwt_key_2026_production";
export const ADMIN_COOKIE_NAME = "gt_admin_session";

export interface AdminPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Sign an admin session token
 */
export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify an admin session token
 */
export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, ADMIN_JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

/**
 * Read and verify admin session from Next.js cookies (server-side)
 */
export async function getAdminSession(): Promise<AdminPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}
