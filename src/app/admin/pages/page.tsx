import React from "react";
import prisma from "@/lib/prisma";
import { PagesClient } from "./PagesClient";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const pages = await prisma.cmsPage.findMany({
    orderBy: { title: "asc" },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Static &amp; Informational Pages CMS
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Full management authority over About Us, Warranty Policy, Shipping Logistics, Returns &amp; Replacements, and Corporate Procurement pages.
        </p>
      </div>

      <PagesClient initialPages={pages} />
    </div>
  );
}
