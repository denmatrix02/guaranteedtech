import React from "react";
import prisma from "@/lib/prisma";
import { PostsManagerClient } from "./PostsManagerClient";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  // Query latest_posts section with banners
  let section = await prisma.homepageSection.findUnique({
    where: { sectionKey: "latest_posts" },
    include: {
      banners: { orderBy: { displayOrder: "asc" } },
    },
  });

  // If section does not exist yet, create it on first load
  if (!section) {
    section = await prisma.homepageSection.create({
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

  return (
    <div className="space-y-6">
      <div className="pb-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
            Facebook Posts &amp; Content Management
          </h1>
          <p className="text-xs font-extralight text-slate-400 mt-1">
            Update latest post banners, titles, descriptions, and direct Facebook post links shown on the homepage.
          </p>
        </div>
      </div>

      <PostsManagerClient initialPosts={section.banners as any} />
    </div>
  );
}
