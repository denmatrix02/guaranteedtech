"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Edit2,
  Check,
  Plus,
  SlidersHorizontal,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

export function CmsManagerClient({ initialSections }: { initialSections: any[] }) {
  const [sections, setSections] = useState<any[]>(initialSections);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSubtitle, setEditSubtitle] = useState("");

  const [bannerModalSectionId, setBannerModalSectionId] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerImageUrl, setBannerImageUrl] = useState("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1600&q=85");
  const [bannerTargetUrl, setBannerTargetUrl] = useState("/shop");
  const [bannerBadgeText, setBannerBadgeText] = useState("NEW PROMO");

  const [isSaving, setIsSaving] = useState(false);

  // Toggle Publish
  const handleTogglePublish = async (section: any) => {
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "TOGGLE_PUBLISH",
          sectionId: section.id,
          isPublished: section.isPublished,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSections(
          sections.map((s) =>
            s.id === section.id ? { ...s, isPublished: !s.isPublished } : s
          )
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Move Section Up or Down
  const handleMove = async (index: number, direction: "UP" | "DOWN") => {
    const targetIndex = direction === "UP" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Recompute display orders
    const reordered = newSections.map((sec, i) => ({
      ...sec,
      displayOrder: i + 1,
    }));

    setSections(reordered);

    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REORDER",
          reorderedSections: reordered.map((r) => ({ id: r.id, displayOrder: r.displayOrder })),
        }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Save Edit Details
  const handleSaveDetails = async (sectionId: string) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "UPDATE_DETAILS",
          sectionId,
          title: editTitle,
          subtitle: editSubtitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSections(
          sections.map((s) =>
            s.id === sectionId ? { ...s, title: editTitle, subtitle: editSubtitle } : s
          )
        );
        setEditingSectionId(null);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // Add Banner
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerModalSectionId) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_BANNER",
          sectionId: bannerModalSectionId,
          newBanner: {
            title: bannerTitle,
            subtitle: bannerSubtitle,
            imageUrl: bannerImageUrl,
            targetUrl: bannerTargetUrl,
            badgeText: bannerBadgeText,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSections(
          sections.map((s) => {
            if (s.id === bannerModalSectionId) {
              return {
                ...s,
                banners: [...(s.banners || []), data.banner],
              };
            }
            return s;
          })
        );
        setBannerModalSectionId(null);
        setBannerTitle("");
        setBannerSubtitle("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sections List */}
      <div className="space-y-4">
        {sections.map((sec, idx) => {
          const isEditing = editingSectionId === sec.id;
          return (
            <div
              key={sec.id}
              className={`bg-white rounded border p-5 shadow-none transition-all ${sec.isPublished ? "border-[#EBEBEB]" : "border-[#EBEBEB] opacity-60 bg-slate-50/50"
                }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Section Index & Title */}
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center font-medium text-xs text-slate-700 flex-shrink-0">
                    {idx + 1}
                  </div>

                  <div>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="px-3 py-1.5 border border-[#EBEBEB] rounded text-xs w-full font-medium focus:outline-none focus:border-[#FFB200]"
                          placeholder="Section Title"
                        />
                        <input
                          type="text"
                          value={editSubtitle}
                          onChange={(e) => setEditSubtitle(e.target.value)}
                          className="px-3 py-1.5 border border-[#EBEBEB] rounded text-xs w-full text-slate-600 font-light focus:outline-none focus:border-[#FFB200]"
                          placeholder="Section Subtitle"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleSaveDetails(sec.id)}
                            className="px-4 py-1.5 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 rounded-full text-xs font-medium uppercase tracking-wider"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingSectionId(null)}
                            className="px-4 py-1.5 border border-[#EBEBEB] text-slate-600 rounded-full text-xs font-light uppercase tracking-wider hover:text-slate-900"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-sm text-slate-900 uppercase tracking-wide">{sec.title}</h3>
                          <span className="font-mono text-[10px] border border-[#EBEBEB] text-slate-500 px-2 py-0.5 rounded-full">
                            {sec.sectionKey}
                          </span>
                        </div>
                        {sec.subtitle && (
                          <p className="text-xs text-slate-500 mt-1 font-light">{sec.subtitle}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions: Reorder, Edit, Toggle */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {sec.banners && sec.banners.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setBannerModalSectionId(sec.id)}
                      className="px-3 py-1.5 rounded-full bg-[#FFF9E6] hover:bg-[#FFF3CC] text-amber-950 text-xs font-light tracking-wide flex items-center gap-1 border border-[#FFE699]"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Hero Banner
                    </button>
                  )}

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingSectionId(sec.id);
                        setEditTitle(sec.title);
                        setEditSubtitle(sec.subtitle || "");
                      }}
                      className="p-1.5 rounded border border-[#EBEBEB] text-slate-600 hover:bg-slate-50"
                      title="Edit text"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(sec)}
                    className={`p-1.5 rounded border text-xs font-light flex items-center gap-1 ${sec.isPublished
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "border-[#EBEBEB] bg-slate-100 text-slate-500"
                      }`}
                    title={sec.isPublished ? "Published on Homepage" : "Hidden from Homepage"}
                  >
                    {sec.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center border border-[#EBEBEB] rounded overflow-hidden">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMove(idx, "UP")}
                      className="p-1.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600 border-r border-[#EBEBEB]"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sections.length - 1}
                      onClick={() => handleMove(idx, "DOWN")}
                      className="p-1.5 hover:bg-slate-100 disabled:opacity-30 text-slate-600"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Display existing banners if hero carousel */}
              {sec.banners && sec.banners.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#EBEBEB]">
                  <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-400 block mb-2">
                    Active Promotional Slides ({sec.banners.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {sec.banners.map((b: any) => (
                      <div
                        key={b.id}
                        className="p-2.5 rounded border border-[#EBEBEB] bg-white flex items-center gap-3 text-xs"
                      >
                        <div className="relative w-12 h-10 rounded bg-slate-50 border border-[#EBEBEB] overflow-hidden flex-shrink-0">
                          <Image src={b.imageUrl} alt={b.title} fill className="object-cover" />
                        </div>
                        <div className="overflow-hidden">
                          <span className="font-medium text-slate-900 block truncate text-xs">{b.title}</span>
                          <span className="text-[10px] text-amber-700 font-light">{b.badgeText}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Banner Modal */}
      {bannerModalSectionId && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
            <h3 className="text-sm font-medium uppercase tracking-wider text-slate-900">
              Add New Hero Carousel Promotional Banner
            </h3>
            <form onSubmit={handleAddBanner} className="space-y-4">
              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="e.g. MacBook Pro M3 Max Deals"
                  className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded text-xs font-light focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Slide Subtitle</label>
                <input
                  type="text"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  placeholder="Extreme performance for Nigerian engineers"
                  className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded text-xs font-light focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Image URL *</label>
                <input
                  type="url"
                  required
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded text-xs font-light focus:outline-none focus:border-[#FFB200]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Target URL</label>
                  <input
                    type="text"
                    value={bannerTargetUrl}
                    onChange={(e) => setBannerTargetUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded text-xs font-light focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 mb-1.5">Badge Tag</label>
                  <input
                    type="text"
                    value={bannerBadgeText}
                    onChange={(e) => setBannerBadgeText(e.target.value)}
                    placeholder="HOT DEAL 🔥"
                    className="w-full px-3 py-2 bg-white border border-[#EBEBEB] rounded text-xs font-light focus:outline-none focus:border-[#FFB200]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#EBEBEB]">
                <button
                  type="button"
                  onClick={() => setBannerModalSectionId(null)}
                  className="px-5 py-2 border border-[#EBEBEB] text-slate-600 font-light text-[11px] uppercase tracking-[0.14em] rounded-full hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#FFB200] hover:bg-[#FFA500] text-slate-950 font-medium text-[11px] uppercase tracking-[0.14em] rounded-full shadow-none transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Create Banner Slide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

