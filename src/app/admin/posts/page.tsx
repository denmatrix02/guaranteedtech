import React from "react";
import prisma from "@/lib/prisma";
import { PostsManagerClient } from "./PostsManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  // Query latest_posts section with banners
  let latestPostsSection = await prisma.homepageSection.findUnique({
    where: { sectionKey: "latest_posts" },
    include: {
      banners: { orderBy: { displayOrder: "asc" } },
    },
  });

  if (!latestPostsSection) {
    latestPostsSection = await prisma.homepageSection.create({
      data: {
        sectionKey: "latest_posts",
        title: "LATEST POSTS",
        subtitle: "Official GuaranteedTech tech insights, enterprise hardware reviews, and Facebook community updates.",
        sectionType: "ARTICLES_GRID",
        displayOrder: 8,
        isPublished: true,
      },
      include: {
        banners: { orderBy: { displayOrder: "asc" } },
      },
    });
  }

  // Query instagram_gallery section with banners
  let instagramSection = await prisma.homepageSection.findUnique({
    where: { sectionKey: "instagram_gallery" },
    include: {
      banners: { orderBy: { displayOrder: "asc" } },
    },
  });

  if (!instagramSection) {
    instagramSection = await prisma.homepageSection.create({
      data: {
        sectionKey: "instagram_gallery",
        title: "INSTAGRAM @GUARANTEED_TECH",
        subtitle: "Live showroom inventory, unboxing previews, and customer deliveries from our Aba enterprise hubs.",
        sectionType: "HTML_BLOCK",
        displayOrder: 10,
        isPublished: true,
      },
      include: {
        banners: { orderBy: { displayOrder: "asc" } },
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Social Media &amp; Content Management
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Manage both your Facebook Community Posts and Instagram Showroom Gallery (@guaranteed_tech) with direct links, photos, and live homepage cards.
          </p>
        </div>
      </div>

      <PostsManagerClient
        initialFacebookPosts={latestPostsSection.banners as any}
        initialInstagramItems={instagramSection.banners as any}
      />
    </div>
  );
}
