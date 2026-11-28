import React from "react";
import prisma from "@/lib/prisma";
import { ReviewsClient } from "./ReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: { select: { id: true, name: true, sku: true } },
    },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Product Reviews &amp; Testimonials Moderation
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Approve customer testimonials, verify purchase status, and feature top satisfaction reviews on the public storefront.
        </p>
      </div>

      <ReviewsClient initialReviews={reviews} />
    </div>
  );
}
