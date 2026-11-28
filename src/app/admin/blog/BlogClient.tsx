"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, BookOpen, ExternalLink } from "lucide-react";

export function BlogClient({ initialPosts }: { initialPosts: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [posts, setPosts] = useState(initialPosts);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fields
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [featuredImage, setFeaturedImage] = useState("/images/ui/post_1.jpg");
  const [authorName, setAuthorName] = useState("GuaranteedTech Tech Team");
  const [category, setCategory] = useState("LAPTOPS");
  const [tags, setTags] = useState("ThinkPad,Laptops,Workstation");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setExcerpt("");
    setContentHtml("");
    setFeaturedImage("/images/ui/post_1.jpg");
    setAuthorName("GuaranteedTech Tech Team");
    setCategory("LAPTOPS");
    setTags("Hardware,Guide,Laptops");
    setIsPublished(true);
    setIsFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: any) => {
    setEditingId(p.id);
    setTitle(p.title);
    setSlug(p.slug);
    setExcerpt(p.excerpt || "");
    setContentHtml(p.contentHtml || "");
    setFeaturedImage(p.featuredImage || "/images/ui/post_1.jpg");
    setAuthorName(p.authorName || "GuaranteedTech Tech Team");
    setCategory(p.category || "LAPTOPS");
    setTags(p.tags || "");
    setIsPublished(Boolean(p.isPublished));
    setIsFeatured(Boolean(p.isFeatured));
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title,
        slug,
        excerpt,
        contentHtml,
        featuredImage,
        authorName,
        category,
        tags,
        isPublished,
        isFeatured,
      };

      const url = editingId ? `/api/admin/blog/${editingId}` : "/api/admin/blog";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save article");

      if (editingId) {
        setPosts((prev) =>
          prev.map((item) => (item.id === editingId ? { ...item, ...data.post } : item))
        );
        showToast("success", `Article "${title}" updated.`);
      } else {
        setPosts((prev) => [data.post, ...prev]);
        showToast("success", `Article "${title}" published.`);
      }

      setIsModalOpen(false);
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to save article.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Delete "${postTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");

      setPosts((prev) => prev.filter((item) => item.id !== id));
      showToast("success", "Article removed.");
      startTransition(() => {
        router.refresh();
      });
    } catch (err: any) {
      showToast("error", err.message || "Failed to delete article.");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {toast && (
        <div
          className={`p-3.5 rounded text-xs flex items-center justify-between gap-2 shadow-xs transition-all ${
            toast.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <span className="font-light">{toast.text}</span>
          <button onClick={() => setToast(null)} className="font-bold text-slate-400">&times;</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-sm font-normal uppercase tracking-wider text-slate-800">
            Hardware Engineering Guides ({posts.length} Articles)
          </h2>
          <p className="text-[11px] font-extralight text-slate-400 mt-0.5">
            Publish technical buying advice, hardware maintenance tips, and diagnostic benchmarks.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2]" /> Write New Article
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[10px] font-light uppercase tracking-[0.16em] text-slate-400 border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Article Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-light text-slate-700">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-normal text-slate-800 block">{p.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{p.slug}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light bg-slate-100 text-slate-700 border border-slate-200">
                      {p.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {p.authorName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-light ${
                        p.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-lg border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl animate-in fade-in zoom-in duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-sm font-normal uppercase tracking-wider text-slate-800">
                {editingId ? "Edit Article" : "Write Hardware Article"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!editingId && !slug) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                    }
                  }}
                  placeholder="e.g. Best Business Laptops for Nigerian Developers in 2026"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="best-business-laptops-2026"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="LAPTOPS / ENTERPRISE / TIPS"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Featured Cover Image URL
                </label>
                <input
                  type="text"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="/images/ui/post_1.jpg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Article Excerpt (Short Summary)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Detailed comparison of ThinkPad T-Series vs HP EliteBook 840 for long battery life..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1">
                  Article Body (HTML Supported) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={contentHtml}
                  onChange={(e) => setContentHtml(e.target.value)}
                  placeholder="<p>Full article markdown or paragraphs...</p>"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Publish Article on Storefront Blog</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded border-slate-300 text-[#FFB200]"
                  />
                  <span>Feature on Homepage Latest Posts</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-full text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-normal rounded-full transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Saving..." : editingId ? "Update Article" : "Publish Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
