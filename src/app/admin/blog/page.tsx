import React from "react";
import prisma from "@/lib/prisma";
import { BlogClient } from "./BlogClient";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="pb-6 border-b border-slate-100">
        <h1 className="text-xl sm:text-2xl font-light text-slate-800 tracking-wide uppercase">
          Hardware Engineering Guides &amp; Blog CMS
        </h1>
        <p className="text-xs font-extralight text-slate-400 mt-1">
          Publish and manage technical workstation buying guides, maintenance procedures, and enterprise hardware insights.
        </p>
      </div>

      <BlogClient initialPosts={posts} />
    </div>
  );
}
