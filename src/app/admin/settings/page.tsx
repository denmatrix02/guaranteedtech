import React from "react";
import prisma from "@/lib/prisma";
import { SettingsClient } from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settingsRecords = await prisma.businessSetting.findMany();
  const settingsMap: Record<string, any> = {};

  for (const s of settingsRecords) {
    try {
      settingsMap[s.key] = JSON.parse(s.valueJson);
    } catch {
      settingsMap[s.key] = s.valueJson;
    }
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Business Profile, Showrooms &amp; System Configuration
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Full control over store identity, top announcement bar, Azikiwe &amp; Asa Road showroom addresses, and warranty policies.
        </p>
      </div>

      <SettingsClient initialSettings={settingsMap} />
    </div>
  );
}
