"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Share2,
  Check,
  X,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface PostItem {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  targetUrl: string;
  badgeText: string | null;
  buttonText: string | null;
  displayOrder: number;
  isPublished: boolean;
}

const SAMPLE_IMAGES = [
  { label: "Laptops / Workstation", url: "/images/ui/post_1.jpg" },
  { label: "Desktop Towers", url: "/images/ui/post_2.jpg" },
  { label: "Hardware & Battery", url: "/images/ui/post_3.jpg" },
  { label: "Security & TPM", url: "/images/ui/post_4.jpg" },
];

const PRESET_TAGS = ["LAPTOPS", "ENTERPRISE", "TIPS", "SECURITY", "HARDWARE", "SPECIAL DEAL"];

export function PostsManagerClient({ initialPosts }: { initialPosts: PostItem[] }) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr");
  const [imageUrl, setImageUrl] = useState("/images/ui/post_1.jpg");
  const [badgeText, setBadgeText] = useState("LAPTOPS");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  const handleOpenCreateModal = () => {
    setEditingPostId(null);
    setTitle("");
    setSubtitle("");
    setTargetUrl("https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr");
    setImageUrl("/images/ui/post_1.jpg");
    setBadgeText("LAPTOPS");
    setDisplayOrder(posts.length + 1);
    setIsPublished(true);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: PostItem) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setSubtitle(post.subtitle || "");
    setTargetUrl(post.targetUrl);
    setImageUrl(post.imageUrl);
    setBadgeText(post.badgeText || "TECH");
    setDisplayOrder(post.displayOrder);
    setIsPublished(post.isPublished);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetUrl.trim()) {
      setErrorMessage("Please enter both a title and a valid Facebook post URL.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    try {
      if (editingPostId) {
        // Update existing post
        const res = await fetch("/api/admin/posts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingPostId,
            title,
            subtitle,
            targetUrl,
            imageUrl,
            badgeText,
            displayOrder,
            isPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update post.");

        setPosts(posts.map((p) => (p.id === editingPostId ? data.post : p)));
        showToast("Facebook post updated successfully.");
      } else {
        // Create new post
        const res = await fetch("/api/admin/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            subtitle,
            targetUrl,
            imageUrl,
            badgeText,
            displayOrder,
            isPublished,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create post.");

        setPosts([...posts, data.post].sort((a, b) => a.displayOrder - b.displayOrder));
        showToast("New Facebook post added to homepage!");
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Published State
  const handleTogglePublish = async (post: PostItem) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_PUBLISH",
          id: post.id,
          isPublished: post.isPublished,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(
          posts.map((p) => (p.id === post.id ? { ...p, isPublished: !p.isPublished } : p))
        );
        showToast(`Post ${!post.isPublished ? "published to" : "hidden from"} homepage.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Move Post Up or Down
  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= posts.length) return;

    const newPosts = [...posts];
    const temp = newPosts[index];
    newPosts[index] = newPosts[targetIndex];
    newPosts[targetIndex] = temp;

    // Update display orders
    const reordered = newPosts.map((p, i) => ({
      ...p,
      displayOrder: i + 1,
    }));

    setPosts(reordered);

    try {
      await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REORDER",
          reorderedPosts: reordered.map((r) => ({ id: r.id, displayOrder: r.displayOrder })),
        }),
      });
      showToast("Display order updated.");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Post
  const handleDeletePost = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post from the homepage?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/posts?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.filter((p) => p.id !== id));
        showToast("Post removed successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeCount = posts.filter((p) => p.isPublished).length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-xs font-light border border-amber-400">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded border border-[#EBEBEB]">
        <div>
          <span className="text-[11px] font-normal uppercase tracking-[0.16em] text-[#FFB200] block mb-1">
            Social Link Integration
          </span>
          <h2 className="text-base sm:text-lg font-light text-slate-900 uppercase tracking-wide">
            Latest Posts &amp; Facebook Articles
          </h2>
          <p className="text-xs font-extralight text-slate-500 mt-1 max-w-xl leading-relaxed">
            Every card added here displays in the &ldquo;LATEST POSTS&rdquo; section on the homepage and takes visitors directly to your official Facebook post when clicked.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[1.5]" />
            <span>Add New Post</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded border border-[#EBEBEB] flex items-center justify-between">
          <div>
            <span className="text-xs font-light text-slate-400">Total Managed Posts</span>
            <div className="text-2xl font-light text-slate-800 mt-1">{posts.length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            <Share2 className="w-5 h-5 stroke-[1.4]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-[#EBEBEB] flex items-center justify-between">
          <div>
            <span className="text-xs font-light text-slate-400">Live on Homepage</span>
            <div className="text-2xl font-light text-emerald-600 mt-1">{activeCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Eye className="w-5 h-5 stroke-[1.4]" />
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-[#EBEBEB] flex items-center justify-between">
          <div>
            <span className="text-xs font-light text-slate-400">Connected Destination</span>
            <div className="text-sm font-normal text-blue-600 mt-1 flex items-center gap-1">
              <span>Facebook Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>
          <a
            href="https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
        </div>
      </div>

      {/* Posts Table / Card Grid */}
      <div className="bg-white rounded border border-[#EBEBEB] overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-normal uppercase tracking-[0.16em] text-slate-800">
            Current Homepage Posts ({posts.length})
          </h3>
          <span className="text-[11px] font-extralight text-slate-400">
            Use arrows to reorder which posts appear first
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-xs font-extralight text-slate-400">
              No posts found. Click &ldquo;Add New Post&rdquo; to create your first Facebook article card.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {posts.map((post, idx) => (
              <div
                key={post.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Left: Thumbnail & Content */}
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-20 rounded bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.badgeText && (
                      <span className="absolute top-1 left-1 bg-[#FFB200] text-white text-[8px] font-bold uppercase tracking-wider px-1 py-0.5 rounded">
                        {post.badgeText}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">#{post.displayOrder}</span>
                      <h4 className="text-xs font-medium text-slate-900 line-clamp-1">{post.title}</h4>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded uppercase font-light ${
                          post.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {post.isPublished ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <p className="text-[11px] font-extralight text-slate-500 line-clamp-2 leading-relaxed">
                      {post.subtitle || "No description provided."}
                    </p>

                    {/* Facebook Link */}
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] text-blue-600 font-light truncate">
                      <svg className="w-3.5 h-3.5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <a
                        href={post.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline flex items-center gap-1 truncate max-w-sm"
                      >
                        <span className="truncate">{post.targetUrl}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-slate-200 rounded bg-white">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "UP")}
                      aria-label="Move Up"
                      className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === posts.length - 1}
                      onClick={() => handleMove(idx, "DOWN")}
                      aria-label="Move Down"
                      className="p-1.5 text-slate-400 hover:text-slate-800 disabled:opacity-30 disabled:cursor-not-allowed border-l border-slate-100"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Publish */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(post)}
                    title={post.isPublished ? "Hide from homepage" : "Show on homepage"}
                    className={`p-2 rounded border transition-colors ${
                      post.isPublished
                        ? "border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                        : "border-slate-200 text-slate-400 bg-white hover:text-slate-600"
                    }`}
                  >
                    {post.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(post)}
                    className="p-2 rounded border border-slate-200 text-slate-600 hover:text-[#FFB200] hover:border-[#FFB200] bg-white transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeletePost(post.id)}
                    className="p-2 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto border border-slate-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#FFB200]" />
                <h3 className="text-base font-normal uppercase tracking-wide text-slate-800">
                  {editingPostId ? "Edit Facebook Post" : "Create New Facebook Post"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-light">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Post Title */}
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Post Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Best Business Laptops for Nigerian Developers in 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Tag / Category Badge */}
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Category Tag Badge
                </label>
                <input
                  type="text"
                  placeholder="e.g. LAPTOPS, ENTERPRISE, TIPS, SECURITY"
                  value={badgeText}
                  onChange={(e) => setBadgeText(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[10px] text-slate-400 mr-1">Quick Select:</span>
                  {PRESET_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setBadgeText(tag)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-800 text-[10px] font-light uppercase"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Summary / Excerpt Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary or excerpt of the Facebook discussion/product showcase..."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Facebook Post URL */}
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Direct Facebook Post Link *</span>
                  <span className="text-blue-600 font-normal lowercase flex items-center gap-1 text-[11px]">
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    facebook.com destination
                  </span>
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.facebook.com/share/... or https://www.facebook.com/GuaranteedTech/posts/..."
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-mono font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <p className="text-[11px] font-extralight text-slate-400 mt-1">
                  When a customer clicks the card or &ldquo;READ MORE&rdquo; on the homepage, this link opens immediately in a new tab.
                </p>
              </div>

              {/* Banner / Attached Image URL */}
              <div>
                <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                  Attached Image / Banner URL
                </label>
                <input
                  type="text"
                  required
                  placeholder="/images/ui/post_1.jpg or external HTTPS image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-mono font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 mr-1">Preset Samples:</span>
                  {SAMPLE_IMAGES.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setImageUrl(img.url)}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-light"
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-normal uppercase tracking-wider text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-white border border-slate-300 rounded px-3.5 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-[#FFB200] border-slate-300 rounded focus:ring-amber-500"
                  />
                  <label htmlFor="isPublishedCheck" className="text-xs font-light text-slate-700">
                    Publish Live on Homepage
                  </label>
                </div>
              </div>

              {/* LIVE CARD PREVIEW */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] uppercase font-normal tracking-wider text-slate-400 block mb-2">
                  Live Homepage Card Preview
                </span>
                <div className="max-w-xs bg-white border border-[#EBEBEB] rounded overflow-hidden shadow-xs">
                  <div className="relative h-32 w-full bg-slate-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl || "/images/ui/post_1.jpg"}
                      alt={title || "Preview"}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-[#FFB200] text-white font-light text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded shadow-xs">
                      {badgeText || "TAG"}
                    </span>
                  </div>
                  <div className="p-3.5 space-y-1.5">
                    <h4 className="text-xs font-medium text-slate-900 line-clamp-1">{title || "Your Post Title Here"}</h4>
                    <p className="text-[11px] font-extralight text-slate-400 line-clamp-2 leading-relaxed">
                      {subtitle || "Brief description will appear here on the homepage."}
                    </p>
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] font-light text-[#FFB200] uppercase tracking-wider inline-flex items-center gap-1">
                        Read on Facebook <ArrowRight className="w-3 h-3" />
                      </span>
                      <svg className="w-3.5 h-3.5 text-blue-600 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-light text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-white rounded text-xs font-light uppercase tracking-wider transition-colors shadow-xs flex items-center gap-1.5"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{editingPostId ? "Save Changes" : "Create Post"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
