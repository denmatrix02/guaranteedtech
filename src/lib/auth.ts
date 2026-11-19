import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "guaranteedtech_fallback_secret_key_2026";

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwtToken(payload: TokenPayload, expiresIn = "7d"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as any });
}

export function verifyJwtToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export const USER_ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  STORE_MANAGER: "STORE_MANAGER",
  INVENTORY_MANAGER: "INVENTORY_MANAGER",
  ORDER_MANAGER: "ORDER_MANAGER",
  LOGISTICS_MANAGER: "LOGISTICS_MANAGER",
  CUSTOMER_SUPPORT: "CUSTOMER_SUPPORT",
  CONTENT_MANAGER: "CONTENT_MANAGER",
  CUSTOMER: "CUSTOMER",
} as const;

export function isAdminRole(role?: string | null): boolean {
  if (!role) return false;
  return [
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.STORE_MANAGER,
    USER_ROLES.INVENTORY_MANAGER,
    USER_ROLES.ORDER_MANAGER,
    USER_ROLES.LOGISTICS_MANAGER,
    USER_ROLES.CUSTOMER_SUPPORT,
    USER_ROLES.CONTENT_MANAGER,
  ].includes(role as any);
}

