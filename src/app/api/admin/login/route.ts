import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // Check if it's one of the official admin identifier aliases
    const isMasterAdminEmail =
      cleanEmail === "admin@guaranteedtech.ng" ||
      cleanEmail === "admin@guaranteedtech.org" ||
      cleanEmail === "guaranteedtech17@gmail.com" ||
      cleanEmail === "guarateedtech17@gmail.com" ||
      cleanEmail === "admin" ||
      cleanEmail === "executive@guaranteedtech.org" ||
      cleanEmail === "executive@guaranteedtech.ng" ||
      cleanEmail === "executive";

    // Tolerant check for master password (covers mobile capitalization and accidental missing punctuation)
    const isMasterPassword =
      cleanPassword === "Admin@GT2026!" ||
      cleanPassword === "admin@gt2026!" ||
      cleanPassword === "Admin@gt2026!" ||
      cleanPassword === "admin@GT2026!" ||
      cleanPassword === "Admin@GT2026" ||
      cleanPassword === "admin@gt2026";

    let matchedUser: any = null;
    let isValid = false;

    // 1. Check database for existing operator account (in a safe try-catch so transient DB pooler issues never block login)
    try {
      const searchEmails = isMasterAdminEmail
        ? ["admin@guaranteedtech.org", "admin@guaranteedtech.ng", "guaranteedtech17@gmail.com", cleanEmail]
        : [cleanEmail];

      matchedUser = await prisma.user.findFirst({
        where: {
          email: { in: searchEmails },
          role: { in: ["SUPER_ADMIN", "STORE_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"] },
          isActive: true,
        },
      });

      if (matchedUser && matchedUser.passwordHash) {
        isValid = await bcrypt.compare(cleanPassword, matchedUser.passwordHash);
      }
    } catch (dbErr) {
      console.warn("Database lookup warning during admin login (proceeding with fallback verification):", dbErr);
    }

    // 2. Master Administrative Credentials verification fallback
    if (!isValid && isMasterAdminEmail && isMasterPassword) {
      isValid = true;
      if (!matchedUser) {
        matchedUser = {
          id: "master-admin-01",
          email: cleanEmail.includes("@") ? cleanEmail : "admin@guaranteedtech.org",
          name: "Executive Admin",
          role: "SUPER_ADMIN",
        };
      }
    }

    if (!isValid || !matchedUser) {
      return NextResponse.json(
        { success: false, error: "Invalid operator credentials or unauthorized role." },
        { status: 401 }
      );
    }

    // 3. Issue signed JWT session token
    const token = signAdminToken({
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name || "Executive Admin",
      role: matchedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name || "Executive Admin",
        role: matchedUser.role,
      },
    });

    // 4. Set secure HTTP-only cookie with sameSite: "lax"
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Authentication error." },
      { status: 500 }
    );
  }
}
