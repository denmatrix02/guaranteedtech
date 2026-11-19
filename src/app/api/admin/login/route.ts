import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please enter both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Try to find user in database
    let matchedUser = await prisma.user.findFirst({
      where: {
        email: cleanEmail,
        role: { in: ["SUPER_ADMIN", "STORE_MANAGER", "INVENTORY_MANAGER", "ORDER_MANAGER"] },
        isActive: true,
      },
    });

    let isValid = false;

    if (matchedUser) {
      isValid = await bcrypt.compare(password, matchedUser.passwordHash);
    }

    // 2. Fallback check for master administrative credentials (admin@guaranteedtech.ng / guarateedtech17@gmail.com with Admin@GT2026!)
    if (!isValid) {
      const isMasterAdminEmail =
        cleanEmail === "admin@guaranteedtech.ng" ||
        cleanEmail === "guarateedtech17@gmail.com" ||
        cleanEmail === "admin";

      if (isMasterAdminEmail && password === "Admin@GT2026!") {
        isValid = true;
        if (!matchedUser) {
          matchedUser = {
            id: "master-admin-01",
            email: cleanEmail,
            name: "Dennis (Executive Admin)",
            role: "SUPER_ADMIN",
          } as any;
        }
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
      name: matchedUser.name,
      role: matchedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
      },
    });

    // 4. Set secure HTTP-only cookie
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
