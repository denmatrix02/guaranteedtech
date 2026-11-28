import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.businessSetting.findMany();
    const map: Record<string, any> = {};
    for (const s of settings) {
      try {
        map[s.key] = JSON.parse(s.valueJson);
      } catch {
        map[s.key] = s.valueJson;
      }
    }
    return NextResponse.json({ success: true, settings: map });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ success: false, error: "Settings key is required" }, { status: 400 });
    }

    const valueJson = typeof value === "string" ? value : JSON.stringify(value);

    const updated = await prisma.businessSetting.upsert({
      where: { key },
      update: { valueJson },
      create: { key, valueJson },
    });

    return NextResponse.json({ success: true, setting: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
