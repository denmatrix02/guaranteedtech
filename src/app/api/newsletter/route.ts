import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if already subscribed in ProductEnquiry with NEWSLETTER_SUBSCRIBE
    const existing = await prisma.productEnquiry.findFirst({
      where: {
        email,
        enquiryType: "NEWSLETTER_SUBSCRIBE",
      },
    });

    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed to GuaranteedTech deals!",
      });
    }

    // Record newsletter subscription
    await prisma.productEnquiry.create({
      data: {
        name: "Newsletter Subscriber",
        email,
        phone: "+2348000000000",
        enquiryType: "PRODUCT_SOURCING",
        message: "Customer subscribed to GuaranteedTech deal alerts and price drops via website footer.",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing! You will receive exclusive tech price drops.",
    });
  } catch (err: any) {
    console.error("Newsletter subscription error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to process subscription. Please try again." },
      { status: 500 }
    );
  }
}
