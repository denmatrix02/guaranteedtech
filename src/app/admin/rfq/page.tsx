import React from "react";
import prisma from "@/lib/prisma";
import { RfqClient } from "./RfqClient";

export const dynamic = "force-dynamic";

export default async function AdminRfqPage() {
  const rfqs = await prisma.corporateRfq.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Corporate RFQs &amp; Bulk Procurement Pipeline
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Review enterprise hardware procurement requests, issue official proforma quotations, and assign account reps.
        </p>
      </div>

      <RfqClient initialRfqs={rfqs} />
    </div>
  );
}
