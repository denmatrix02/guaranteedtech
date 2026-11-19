import React from "react";
import prisma from "@/lib/prisma";
import { CmsManagerClient } from "./CmsManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminCmsPage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { displayOrder: "asc" },
    include: {
      banners: { orderBy: { displayOrder: "asc" } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Homepage Dynamic Content Management System (CMS)
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Add, reorder, publish/unpublish sections, replace promotional hero banners, and edit section copy without writing code.
        </p>
      </div>

      <CmsManagerClient initialSections={sections} />
    </div>
  );
}

