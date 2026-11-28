"use client";

import React, { useState, useRef } from "react";
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
  Instagram,
  Facebook,
  Camera,
  Layers,
  Upload,
  UploadCloud,
  RefreshCw,
  Download,
  Image as ImageIcon,
} from "lucide-react";

interface BannerItem {
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

const SAMPLE_FACEBOOK_IMAGES = [
  { label: "Laptops / Workstation", url: "/images/ui/post_1.jpg" },
  { label: "Desktop Towers", url: "/images/ui/post_2.jpg" },
  { label: "Hardware & Battery", url: "/images/ui/post_3.jpg" },
  { label: "Security & TPM", url: "/images/ui/post_4.jpg" },
];

const SAMPLE_INSTAGRAM_IMAGES = [
  { label: "MacBook Pro Showroom", url: "/images/ui/insta_1.jpg" },
  { label: "ThinkPad Fleet Batch", url: "/images/ui/insta_2.jpg" },
  { label: "HP EliteBook Aluminum", url: "/images/ui/insta_3.jpg" },
  { label: "Dell Precision Workstations", url: "/images/ui/insta_4.jpg" },
  { label: "APC Smart-UPS Systems", url: "/images/ui/insta_5.jpg" },
  { label: "GuaranteedTech Flagship Aba", url: "/images/ui/insta_6.jpg" },
];

const PRESET_TAGS = ["LAPTOPS", "ENTERPRISE", "TIPS", "SECURITY", "HARDWARE", "SPECIAL DEAL"];

export function PostsManagerClient({
  initialFacebookPosts,
  initialInstagramItems,
}: {
  initialFacebookPosts: BannerItem[];
  initialInstagramItems: BannerItem[];
}) {
  const [activeTab, setActiveTab] = useState<"facebook" | "instagram">("facebook");

  // Posts State
  const [facebookPosts, setFacebookPosts] = useState<BannerItem[]>(initialFacebookPosts || []);
  const [instagramItems, setInstagramItems] = useState<BannerItem[]>(initialInstagramItems || []);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [badgeText, setBadgeText] = useState("LAPTOPS");
  const [displayOrder, setDisplayOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);

  // Media Upload & Meta Fetch State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isFetchingMeta, setIsFetchingMeta] = useState(false);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [fetchNotice, setFetchNotice] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  // Handle direct image file upload
  const handleImageUpload = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    setIsUploadingImage(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("files", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image.");
      }

      const newUrl = data.urls?.[0];
      if (newUrl) {
        setImageUrl(newUrl);
        showToast("Image uploaded successfully!");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload image.");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle auto-fetching Facebook metadata & image
  const handleFetchFacebookMeta = async (overrideUrl?: string) => {
    const urlToFetch = overrideUrl || targetUrl;
    if (!urlToFetch || !urlToFetch.trim()) {
      setErrorMessage("Please enter a valid Facebook URL to fetch.");
      return;
    }

    setIsFetchingMeta(true);
    setErrorMessage("");
    setFetchNotice(null);

    try {
      const res = await fetch("/api/admin/posts/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch.trim() }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Could not fetch Facebook preview.");
      }

      const { title: fetchedTitle, subtitle: fetchedSub, imageUrl: fetchedImg } = result.data;

      if (fetchedImg) {
        setImageUrl(fetchedImg);
      }
      if (fetchedTitle && (!title || title.trim().length === 0 || title.includes("Best Business Laptops"))) {
        setTitle(fetchedTitle);
      }
      if (fetchedSub && (!subtitle || subtitle.trim().length === 0)) {
        setSubtitle(fetchedSub);
      }

      setFetchNotice("Successfully extracted image & details from Facebook!");
      showToast("Facebook preview & image loaded!");
      setTimeout(() => setFetchNotice(null), 4000);
    } catch (err: any) {
      console.error("Meta fetch error:", err);
      setErrorMessage(err.message || "Failed to fetch Facebook metadata.");
    } finally {
      setIsFetchingMeta(false);
    }
  };

  // Sync single post from Facebook
  const handleSyncSinglePostFromFacebook = async (post: BannerItem) => {
    if (!post.targetUrl) return;
    setSyncingId(post.id);

    try {
      const res = await fetch("/api/admin/posts/fetch-meta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: post.targetUrl }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "Could not fetch Facebook post metadata.");
      }

      const { title: fetchedTitle, subtitle: fetchedSub, imageUrl: fetchedImg } = result.data;

      const updateRes = await fetch("/api/admin/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: post.id,
          title: fetchedTitle || post.title,
          subtitle: fetchedSub || post.subtitle,
          imageUrl: fetchedImg || post.imageUrl,
          targetUrl: post.targetUrl,
          badgeText: post.badgeText,
          displayOrder: post.displayOrder,
          isPublished: post.isPublished,
        }),
      });

      const updateData = await updateRes.json();
      if (!updateRes.ok || !updateData.success) {
        throw new Error(updateData.error || "Failed to save updated post.");
      }

      setFacebookPosts((prev) =>
        prev.map((item) => (item.id === post.id ? updateData.post : item))
      );

      showToast(`Post #${post.displayOrder} synced with Facebook!`);
    } catch (err: any) {
      console.error("Single post sync error:", err);
      showToast(`Sync failed: ${err.message}`);
    } finally {
      setSyncingId(null);
    }
  };

  // Sync all posts from Facebook
  const handleSyncAllFacebookPosts = async () => {
    if (facebookPosts.length === 0) return;
    setIsSyncingAll(true);
    let updatedCount = 0;

    try {
      for (const post of facebookPosts) {
        if (!post.targetUrl || !post.targetUrl.includes("facebook.com")) continue;

        try {
          const res = await fetch("/api/admin/posts/fetch-meta", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: post.targetUrl }),
          });

          const result = await res.json();
          if (result.success && result.data) {
            const { title: fetchedTitle, subtitle: fetchedSub, imageUrl: fetchedImg } = result.data;
            if (fetchedImg || fetchedTitle) {
              const updateRes = await fetch("/api/admin/posts", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  id: post.id,
                  title: fetchedTitle || post.title,
                  subtitle: fetchedSub || post.subtitle,
                  imageUrl: fetchedImg || post.imageUrl,
                }),
              });
              const updateData = await updateRes.json();
              if (updateData.success && updateData.post) {
                setFacebookPosts((prev) =>
                  prev.map((item) => (item.id === post.id ? updateData.post : item))
                );
                updatedCount++;
              }
            }
          }
        } catch (itemErr) {
          console.warn(`Sync failed for post ${post.id}:`, itemErr);
        }
      }

      showToast(`Successfully refreshed ${updatedCount} Facebook post(s) to homepage!`);
    } catch (err: any) {
      console.error("Bulk sync error:", err);
      showToast("Bulk sync encountered an error.");
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingItemId(null);
    if (activeTab === "facebook") {
      setTitle("");
      setSubtitle("");
      setTargetUrl("https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr");
      setImageUrl("/images/ui/post_1.jpg");
      setBadgeText("LAPTOPS");
      setDisplayOrder(facebookPosts.length + 1);
    } else {
      setTitle("MacBook Pro M3 Space Black Showroom Unboxing");
      setSubtitle("Live showroom unboxing and diagnostic test at GuaranteedTech Aba.");
      setTargetUrl("https://www.instagram.com/guaranteed_tech/");
      setImageUrl("/images/ui/insta_1.jpg");
      setBadgeText("INSTAGRAM");
      setDisplayOrder(instagramItems.length + 1);
    }
    setIsPublished(true);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: BannerItem) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setSubtitle(item.subtitle || "");
    setTargetUrl(item.targetUrl);
    setImageUrl(item.imageUrl);
    setBadgeText(item.badgeText || (activeTab === "facebook" ? "TECH" : "INSTAGRAM"));
    setDisplayOrder(item.displayOrder);
    setIsPublished(item.isPublished);
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // Submit Save
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetUrl.trim()) {
      setErrorMessage(
        activeTab === "facebook"
          ? "Please enter both a title and a valid Facebook post URL."
          : "Please enter a caption/title and a valid Instagram post URL."
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const endpoint = activeTab === "facebook" ? "/api/admin/posts" : "/api/admin/instagram";

    try {
      if (editingItemId) {
        // Update existing item
        const res = await fetch(endpoint, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingItemId,
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
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to update item.");

        const updated = data.post || data.item;
        if (activeTab === "facebook") {
          setFacebookPosts(facebookPosts.map((p) => (p.id === editingItemId ? updated : p)));
          showToast("Facebook post updated successfully.");
        } else {
          setInstagramItems(instagramItems.map((p) => (p.id === editingItemId ? updated : p)));
          showToast("Instagram showroom item updated successfully.");
        }
      } else {
        // Create new item
        const res = await fetch(endpoint, {
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
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to create item.");

        const created = data.post || data.item;
        if (activeTab === "facebook") {
          setFacebookPosts([...facebookPosts, created].sort((a, b) => a.displayOrder - b.displayOrder));
          showToast("New Facebook post added to homepage!");
        } else {
          setInstagramItems([...instagramItems, created].sort((a, b) => a.displayOrder - b.displayOrder));
          showToast("New Instagram showroom card added to homepage!");
        }
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle Visibility
  const handleTogglePublish = async (item: BannerItem) => {
    const endpoint = activeTab === "facebook" ? "/api/admin/posts" : "/api/admin/instagram";
    try {
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: item.id,
          isPublished: !item.isPublished,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to toggle status.");

      if (activeTab === "facebook") {
        setFacebookPosts(
          facebookPosts.map((p) => (p.id === item.id ? { ...p, isPublished: !p.isPublished } : p))
        );
      } else {
        setInstagramItems(
          instagramItems.map((p) => (p.id === item.id ? { ...p, isPublished: !p.isPublished } : p))
        );
      }
      showToast(`Item set to ${!item.isPublished ? "Visible" : "Hidden"}.`);
    } catch (err: any) {
      alert(err.message || "Could not toggle publish status.");
    }
  };

  // Reorder Item
  const handleMove = async (currentIndex: number, direction: "up" | "down") => {
    const currentList = activeTab === "facebook" ? [...facebookPosts] : [...instagramItems];
    const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const temp = currentList[currentIndex];
    currentList[currentIndex] = currentList[targetIndex];
    currentList[targetIndex] = temp;

    // Reassign displayOrder
    const reordered = currentList.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1,
    }));

    if (activeTab === "facebook") {
      setFacebookPosts(reordered);
    } else {
      setInstagramItems(reordered);
    }

    const endpoint = activeTab === "facebook" ? "/api/admin/posts" : "/api/admin/instagram";

    try {
      await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reorder: reordered.map((p) => ({ id: p.id, displayOrder: p.displayOrder })),
        }),
      });
      showToast("Order updated successfully.");
    } catch (err) {
      console.error("Failed to reorder items:", err);
    }
  };

  // Delete Item
  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to remove this item from the homepage?")) return;

    const endpoint = activeTab === "facebook" ? `/api/admin/posts?id=${id}` : `/api/admin/instagram?id=${id}`;

    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to delete item.");

      if (activeTab === "facebook") {
        setFacebookPosts(facebookPosts.filter((p) => p.id !== id));
      } else {
        setInstagramItems(instagramItems.filter((p) => p.id !== id));
      }
      showToast("Item deleted from homepage.");
    } catch (err: any) {
      alert(err.message || "Failed to delete item.");
    }
  };

  const activeItems = activeTab === "facebook" ? facebookPosts : instagramItems;
  const publishedCount = activeItems.filter((p) => p.isPublished).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-light px-4 py-3 rounded shadow-lg flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Tabs Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded border border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab("facebook")}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${
              activeTab === "facebook"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Facebook className="w-4 h-4 text-blue-600" />
            <span>Facebook Articles ({facebookPosts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("instagram")}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-medium transition-all ${
              activeTab === "instagram"
                ? "bg-white text-pink-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Instagram className="w-4 h-4 text-pink-600" />
            <span>Instagram Showroom ({instagramItems.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {activeTab === "facebook" && (
            <button
              type="button"
              disabled={isSyncingAll}
              onClick={handleSyncAllFacebookPosts}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium uppercase tracking-wider transition-colors border border-blue-200 cursor-pointer disabled:opacity-50"
              title="Automatically re-fetch and update all Facebook post images and texts to the CMS"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? "animate-spin" : ""}`} />
              <span>{isSyncingAll ? "Syncing Feed..." : "Auto-Sync All from Facebook"}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 text-xs font-medium uppercase tracking-wider transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {activeTab === "facebook" ? "Facebook Post" : "Instagram Card"}</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded border border-slate-100">
          <span className="text-[11px] font-light text-slate-400 uppercase tracking-wider block">
            Total {activeTab === "facebook" ? "Facebook Posts" : "Instagram Photos"}
          </span>
          <div className="text-2xl font-light text-slate-800 mt-1">{activeItems.length}</div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-100">
          <span className="text-[11px] font-light text-slate-400 uppercase tracking-wider block">
            Published Live on Homepage
          </span>
          <div className="text-2xl font-light text-emerald-600 mt-1">
            {publishedCount} / {activeItems.length}
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-100">
          <span className="text-[11px] font-light text-slate-400 uppercase tracking-wider block">
            Official Channel Link
          </span>
          <div className="mt-1">
            <a
              href={
                activeTab === "facebook"
                  ? "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr"
                  : "https://www.instagram.com/guaranteed_tech/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-light flex items-center gap-1.5 transition-colors ${
                activeTab === "facebook"
                  ? "text-blue-600 hover:text-blue-800"
                  : "text-pink-600 hover:text-pink-800"
              }`}
            >
              <span>{activeTab === "facebook" ? "facebook.com/share/..." : "instagram.com/guaranteed_tech"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Posts Listing Table / Cards */}
      <div className="bg-white rounded border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-medium text-slate-800">
              Current Homepage {activeTab === "facebook" ? "Facebook Posts" : "Instagram Showroom Cards"} ({activeItems.length})
            </h2>
            <p className="text-xs font-extralight text-slate-400 mt-0.5">
              Click &ldquo;Edit&rdquo; to change the direct link, photo banner, or title. Visitors will be taken directly to the social post upon clicking.
            </p>
          </div>
        </div>

        {activeItems.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <p className="text-xs font-light text-slate-400">
              No items found. Click &ldquo;Add New {activeTab === "facebook" ? "Facebook Post" : "Instagram Card"}&rdquo; to add your first item.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  !item.isPublished ? "bg-slate-50/60 opacity-70" : "hover:bg-slate-50/40"
                }`}
              >
                {/* Left: Thumbnail & Content */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded bg-slate-100 overflow-hidden relative flex-shrink-0 border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded font-mono">
                      #{item.displayOrder}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded ${
                          activeTab === "facebook"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-pink-100 text-pink-800"
                        }`}
                      >
                        {item.badgeText || (activeTab === "facebook" ? "TECH" : "INSTAGRAM")}
                      </span>

                      {!item.isPublished && (
                        <span className="text-[9px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                          Draft / Hidden
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-medium text-slate-800 line-clamp-1">{item.title}</h3>

                    {item.subtitle && (
                      <p className="text-xs font-light text-slate-500 line-clamp-2 max-w-xl">
                        {item.subtitle}
                      </p>
                    )}

                    <div className="pt-1 flex items-center gap-3">
                      <a
                        href={item.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-xs font-light flex items-center gap-1 transition-colors ${
                          activeTab === "facebook"
                            ? "text-blue-600 hover:text-blue-800"
                            : "text-pink-600 hover:text-pink-800"
                        }`}
                      >
                        <span>Direct {activeTab === "facebook" ? "Facebook" : "Instagram"} Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center">
                  {/* Reorder Buttons */}
                  <div className="flex items-center border border-slate-200 rounded overflow-hidden mr-2">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "up")}
                      disabled={idx === 0}
                      title="Move Up"
                      className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-200"></div>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, "down")}
                      disabled={idx === activeItems.length - 1}
                      title="Move Down"
                      className="p-1.5 hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Auto-Fetch from Facebook (if facebook) */}
                  {activeTab === "facebook" && (
                    <button
                      type="button"
                      disabled={syncingId === item.id}
                      onClick={() => handleSyncSinglePostFromFacebook(item)}
                      title="Auto-fetch and update image & details from Facebook"
                      className="p-2 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncingId === item.id ? "animate-spin" : ""}`} />
                    </button>
                  )}

                  {/* Toggle Visibility */}
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    title={item.isPublished ? "Hide from homepage" : "Show on homepage"}
                    className={`p-2 rounded border transition-colors ${
                      item.isPublished
                        ? "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        : "border-slate-200 text-slate-400 hover:bg-slate-100"
                    }`}
                  >
                    {item.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(item)}
                    className="p-2 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Edit Post"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Item */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-xl w-full p-6 shadow-xl border border-slate-200 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {activeTab === "facebook" ? (
                  <Facebook className="w-5 h-5 text-blue-600" />
                ) : (
                  <Instagram className="w-5 h-5 text-pink-600" />
                )}
                <h3 className="text-base font-medium text-slate-800">
                  {editingItemId
                    ? `Edit ${activeTab === "facebook" ? "Facebook Post" : "Instagram Card"}`
                    : `Add New ${activeTab === "facebook" ? "Facebook Post" : "Instagram Card"}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-light">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Title / Caption */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {activeTab === "facebook" ? "Post Title / Headline" : "Card Title / Caption"} *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    activeTab === "facebook"
                      ? "e.g. Best Business Laptops for Nigerian Developers in 2026"
                      : "e.g. MacBook Pro M3 Space Black Showroom Unboxing"
                  }
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Description / Subtitle */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  {activeTab === "facebook" ? "Post Excerpt / Summary" : "Showroom Note / Description"}
                </label>
                <textarea
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder={
                    activeTab === "facebook"
                      ? "Brief summary of the Facebook post that entices customers to read more..."
                      : "Pristine Apple Silicon workstations inspected and ready for dispatch at Aba hub..."
                  }
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Direct Post Target URL */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Direct {activeTab === "facebook" ? "Facebook" : "Instagram"} Link *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    required
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder={
                      activeTab === "facebook"
                        ? "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr"
                        : "https://www.instagram.com/guaranteed_tech/ or https://www.instagram.com/p/..."
                    }
                    className="flex-1 bg-white border border-slate-300 rounded px-3 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  {activeTab === "facebook" && (
                    <button
                      type="button"
                      disabled={isFetchingMeta}
                      onClick={() => handleFetchFacebookMeta()}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
                      title="Fetch title, summary & image directly from this Facebook post"
                    >
                      {isFetchingMeta ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Fetching...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Auto-Fetch from Facebook</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                <p className="text-[11px] font-extralight text-slate-400 mt-1">
                  When visitors click this card on the homepage, they will be taken directly to this {activeTab === "facebook" ? "Facebook" : "Instagram"} post.
                </p>
                {fetchNotice && (
                  <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {fetchNotice}
                  </p>
                )}
              </div>

              {/* Image URL & Direct Device Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-slate-700">
                    Post Image / Banner Photo *
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Computer/Phone</span>
                  </button>
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleImageUpload(e.target.files);
                    }
                  }}
                />

                {/* Drag & Drop Upload Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      handleImageUpload(e.dataTransfer.files);
                    }
                  }}
                  className={`p-3.5 rounded border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
                    isDragOver
                      ? "border-amber-400 bg-amber-50"
                      : "border-slate-300 bg-slate-50/60 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded bg-white border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-2xs">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Current selection" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-800 block">
                        {imageUrl ? "Current Selected Post Image" : "No image selected"}
                      </span>
                      <span className="text-[11px] text-slate-400 block font-mono truncate max-w-xs sm:max-w-sm">
                        {imageUrl || "Click upload, auto-fetch from Facebook, or select preset"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload Image</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Text URL Input */}
                <div>
                  <span className="text-[10px] uppercase font-light text-slate-400 block mb-1">
                    Or Enter Image URL / Asset Path Manually:
                  </span>
                  <input
                    type="text"
                    required
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or /uploads/posts/... or /images/ui/..."
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Quick Presets */}
                <div className="mt-1">
                  <span className="text-[10px] uppercase font-light text-slate-400 block mb-1">
                    Quick Sample Presets:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(activeTab === "facebook" ? SAMPLE_FACEBOOK_IMAGES : SAMPLE_INSTAGRAM_IMAGES).map(
                      (sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setImageUrl(sample.url)}
                          className={`text-left text-[10px] p-1.5 rounded border transition-colors ${
                            imageUrl === sample.url
                              ? "border-amber-400 bg-amber-50/50 text-amber-900 font-medium"
                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {sample.label}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Category / Badge (For Facebook) */}
              {activeTab === "facebook" && (
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Category Tag
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setBadgeText(tag)}
                        className={`px-2 py-1 text-[10px] rounded uppercase tracking-wider font-light transition-colors ${
                          badgeText === tag
                            ? "bg-[#FFB200] text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Visibility and Display Order */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs font-light text-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-light text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded text-amber-500 focus:ring-amber-400 h-4 w-4"
                    />
                    <span>Publish live on homepage</span>
                  </label>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[10px] uppercase font-light text-slate-400 block mb-2">
                  Live Homepage Card Preview:
                </span>
                {activeTab === "facebook" ? (
                  <div className="bg-white rounded border border-slate-200 overflow-hidden max-w-sm">
                    <div className="aspect-[16/10] bg-slate-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl || "/images/ui/post_1.jpg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-[#FFB200] text-white font-light text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded">
                        {badgeText || "LAPTOPS"}
                      </span>
                      <span className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full">
                        <Facebook className="w-2.5 h-2.5 fill-current" />
                      </span>
                    </div>
                    <div className="p-3 space-y-1">
                      <h4 className="text-xs font-normal text-slate-800 line-clamp-1">
                        {title || "Post Title Preview"}
                      </h4>
                      <p className="text-[11px] font-extralight text-slate-400 line-clamp-2">
                        {subtitle || "Post summary preview will appear here..."}
                      </p>
                      <div className="pt-2 text-[10px] text-[#FFB200] font-light flex items-center gap-1">
                        <span>READ MORE &rarr;</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-36 aspect-square rounded bg-slate-100 relative overflow-hidden group border border-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl || "/images/ui/insta_1.jpg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center text-white">
                      <Instagram className="w-5 h-5 mb-1" />
                      <span className="text-[9px] font-light line-clamp-2">{title || "Instagram Card"}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded text-xs font-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-white rounded text-xs font-medium uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" /> Save {activeTab === "facebook" ? "Post" : "Card"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
