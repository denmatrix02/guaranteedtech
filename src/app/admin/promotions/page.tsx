import React from "react";
import prisma from "@/lib/prisma";
import { PromotionsClient } from "./PromotionsClient";

export const dynamic = "force-dynamic";

export default async function AdminPromotionsPage() {
  const promotions = await prisma.promotion.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Promotions, Banners &amp; Campaigns
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Create and launch flash discounts, homepage discount hero showcases, countdown clocks, and targeted category offers.
        </p>
      </div>

      <PromotionsClient initialPromotions={promotions} />
    </div>
  );
}
