import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let name = "";
    let email = "";
    let phone = "";
    let enquiryType = "AVAILABILITY";
    let message = "";
    let requestedQuantity = 1;

    if (contentType.includes("application/json")) {
      const json = await request.json();
      name = json.name;
      email = json.email;
      phone = json.phone;
      enquiryType = json.enquiryType || "AVAILABILITY";
      message = json.message;
      requestedQuantity = json.requestedQuantity || 1;
    } else {
      const formData = await request.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      phone = (formData.get("phone") as string) || "";
      enquiryType = (formData.get("enquiryType") as string) || "AVAILABILITY";
      message = (formData.get("message") as string) || (formData.get("requestedProduct") as string) || "";
      requestedQuantity = parseInt((formData.get("requestedQuantity") as string) || "1", 10);
    }

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    const enquiry = await prisma.productEnquiry.create({
      data: {
        name,
        email: email || `${phone.replace(/\D/g, "")}@customer.guaranteedtech.ng`,
        phone,
        enquiryType,
        message: message || "Direct enquiry submitted via website",
        requestedQuantity,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      enquiryId: enquiry.id,
      message: "Enquiry submitted successfully. A representative will contact you via WhatsApp or Phone.",
    });
  } catch (err: any) {
    console.error("Enquiry error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

