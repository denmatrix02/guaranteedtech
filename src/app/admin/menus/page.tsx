import React from "react";
import prisma from "@/lib/prisma";
import { MenusClient } from "./MenusClient";

export const dynamic = "force-dynamic";

export default async function AdminMenusPage() {
  const menus = await prisma.navigationMenu.findMany({
    orderBy: { displayOrder: "asc" },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Navigation Menus &amp; Header/Footer Links
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Customize website navigation bars, header quick links, mobile drawer links, and footer directories in real-time.
        </p>
      </div>

      <MenusClient initialMenus={menus} />
    </div>
  );
}
