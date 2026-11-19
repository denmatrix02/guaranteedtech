import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { purpose, budgetMax, brand, ram, storage } = body;

    // Fetch in-stock published products
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
        availabilityStatus: "IN_STOCK",
      },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: true,
        specifications: true,
      },
    });

    const recommendations = [];

    for (const p of products) {
      let score = 0;
      const reasons: string[] = [];

      const pUsage = (p.intendedUsage || "").toUpperCase();
      const pName = p.name.toUpperCase();
      const pBrand = p.brand.slug.toLowerCase();

      // 1. Purpose match (Weight: 35%)
      if (purpose && pUsage.includes(purpose.toUpperCase())) {
        score += 35;
        reasons.push(`Tailored specifically for ${purpose} workloads`);
      }

      // 2. Budget constraint (Weight: 30%)
      const price = p.basePrice;
      const maxBudget = budgetMax ? parseFloat(budgetMax) : Infinity;

      let isBudgetOver = false;
      if (price <= maxBudget) {
        score += 30;
        reasons.push("Within your stated ₦ budget");
      } else if (price <= maxBudget * 1.15) {
        // Just slightly over budget (15% grace for premium performance)
        score += 15;
        isBudgetOver = true;
        reasons.push("Slightly above budget, but provides significant multi-year longevity");
      } else {
        score -= 20; // Penalty for far exceeding budget
      }

      // 3. Brand preference (Weight: 15%)
      if (brand && brand !== "any") {
        if (pBrand === brand.toLowerCase()) {
          score += 15;
          reasons.push(`Matches your requested ${p.brand.name} brand`);
        }
      } else {
        score += 10;
      }

      // 4. RAM requirement (Weight: 20%)
      if (ram) {
        const requiredRamNum = parseInt(ram, 10);
        const hasMatchingRam =
          pName.includes(`${requiredRamNum}GB`) ||
          p.variants.some((v: any) => parseInt(v.ram || "0", 10) >= requiredRamNum);

        if (hasMatchingRam) {
          score += 20;
          reasons.push(`Equipped with ${ram} RAM for seamless multitasking`);
        }
      }

      if (score >= 40) {
        recommendations.push({
          product: p,
          score,
          isBudgetOver,
          recommendationReason: {
            badge: isBudgetOver ? "Premium Upgrade Option" : "Top Match for Your Workflow",
            explanation: reasons.join(" • "),
          },
        });
      }
    }

    // Sort by score descending
    recommendations.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      totalMatched: recommendations.length,
      recommendations: recommendations.slice(0, 6),
    });
  } catch (err: any) {
    console.error("Smart Finder Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

