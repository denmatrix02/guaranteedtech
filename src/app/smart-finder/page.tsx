"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/ui/ProductCard";
import { formatNaira } from "@/lib/currency";
import {
  Compass,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
  Gamepad2,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

export default function SmartFinderPage() {
  const [step, setStep] = useState(1);
  const [purpose, setPurpose] = useState("PROGRAMMING");
  const [budgetMax, setBudgetMax] = useState("800000");
  const [brand, setBrand] = useState("any");
  const [ram, setRam] = useState("16GB");

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleFindProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/smart-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose,
          budgetMax,
          brand,
          ram,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResults(data.recommendations);
        setStep(5); // Go to results view
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setResults(null);
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16 border-t border-slate-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-light uppercase tracking-wider mb-3 border border-amber-200/60">
            <Compass className="w-3.5 h-3.5 text-[#FFB200]" />
            <span>Interactive Guided Recommendation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-slate-800 tracking-wide uppercase">
            Smart Finder
          </h1>
          <p className="text-xs sm:text-sm font-extralight text-slate-400 mt-2">
            Tell us your workload and budget in Naira. Our algorithmic engine will analyze our inventory and recommend the best tested machine with full trade-off transparency.
          </p>
        </div>

        {/* Wizard Container */}
        {step < 5 && (
          <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-10 space-y-8 max-w-3xl mx-auto">
            {/* Progress indicator */}
            <div className="flex items-center justify-between pb-6 border-b border-slate-100 text-xs font-light text-slate-400">
              <span className={step >= 1 ? "text-amber-600 font-normal" : ""}>1. Use Case</span>
              <span>•</span>
              <span className={step >= 2 ? "text-amber-600 font-normal" : ""}>2. Budget</span>
              <span>•</span>
              <span className={step >= 3 ? "text-amber-600 font-normal" : ""}>3. Brand</span>
              <span>•</span>
              <span className={step >= 4 ? "text-amber-600 font-normal" : ""}>4. RAM &amp; Performance</span>
            </div>

            {/* STEP 1: Purpose */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-base font-normal text-slate-800 uppercase tracking-wide">
                  What is your primary computer workload?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      id: "PROGRAMMING",
                      title: "Programming & Software Engineering",
                      desc: "VS Code, Docker, Web Development, Mobile Dev, backend servers",
                      icon: <Code className="w-4 h-4 text-[#FFB200]" />,
                    },
                    {
                      id: "GRAPHIC_DESIGN",
                      title: "Graphic Design, Video & 3D Rendering",
                      desc: "Adobe Photoshop, Premiere Pro, Figma, After Effects, Blender",
                      icon: <Palette className="w-4 h-4 text-purple-500" />,
                    },
                    {
                      id: "BUSINESS",
                      title: "Corporate, Remote Work & Management",
                      desc: "Excel sheets, Zoom presentations, CRM, multitasking, office apps",
                      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
                    },
                    {
                      id: "STUDENT",
                      title: "University Student & Daily Productivity",
                      desc: "Research, browsing, assignments, coursework, video calls",
                      icon: <GraduationCap className="w-4 h-4 text-emerald-500" />,
                    },
                    {
                      id: "GAMING",
                      title: "High-End Gaming & Machine Learning",
                      desc: "AAA games, high frame rates, GPU acceleration, PyTorch/TensorFlow",
                      icon: <Gamepad2 className="w-4 h-4 text-red-500" />,
                    },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPurpose(item.id)}
                      className={`p-4 rounded border text-left transition-all flex items-start gap-3.5 ${
                        purpose === item.id
                          ? "border-[#FFB200] bg-amber-50/40"
                          : "border-[#EBEBEB] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="p-2 rounded bg-slate-50 border border-slate-100 flex-shrink-0">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-normal text-xs text-slate-800">{item.title}</h4>
                        <p className="text-[11px] font-extralight text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Next: Set Budget <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Budget */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-base font-normal text-slate-800 uppercase tracking-wide">
                  What is your maximum target budget in Nigerian Naira (₦)?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { label: "Under ₦500,000", val: "500000", note: "Best for refurbished flagship ThinkPads & EliteBooks" },
                    { label: "₦500,000 – ₦800,000", val: "800000", note: "Sweet spot for Core i7, 16GB RAM & fast NVMe SSDs" },
                    { label: "₦800,000 – ₦1,500,000", val: "1500000", note: "Brand new high-end ultrabooks & MacBook Airs" },
                    { label: "₦1,500,000 & Above", val: "3500000", note: "Top-tier MacBook Pro M3, RTX Gaming, Workstations" },
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setBudgetMax(b.val)}
                      className={`p-4 rounded border text-left transition-all ${
                        budgetMax === b.val
                          ? "border-[#FFB200] bg-amber-50/40"
                          : "border-[#EBEBEB] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <h4 className="font-normal text-xs text-slate-800">{b.label}</h4>
                      <p className="text-[11px] font-extralight text-slate-400 mt-1 leading-snug">{b.note}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-xs font-light text-slate-500 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Next: Brand Preference <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Brand */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-base font-normal text-slate-800 uppercase tracking-wide">
                  Do you have a preferred hardware manufacturer?
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: "any", title: "Any Trusted Brand", note: "Recommend best performance for price" },
                    { id: "lenovo", title: "Lenovo", note: "ThinkPad durability & tactile keyboards" },
                    { id: "hp", title: "HP", note: "EliteBook all-aluminum executive style" },
                    { id: "dell", title: "Dell", note: "Latitude & Precision engineering" },
                    { id: "apple", title: "Apple", note: "MacBook Apple Silicon & macOS" },
                    { id: "asus", title: "ASUS", note: "ROG Gaming & heavy graphical power" },
                  ].map((br) => (
                    <button
                      key={br.id}
                      type="button"
                      onClick={() => setBrand(br.id)}
                      className={`p-4 rounded border text-left transition-all ${
                        brand === br.id
                          ? "border-[#FFB200] bg-amber-50/40"
                          : "border-[#EBEBEB] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <h4 className="font-normal text-xs text-slate-800">{br.title}</h4>
                      <p className="text-[11px] font-extralight text-slate-400 mt-1 leading-snug">{br.note}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-xs font-light text-slate-500 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors shadow-xs"
                  >
                    Next: Memory Needs <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: RAM */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-base font-normal text-slate-800 uppercase tracking-wide">
                  What memory (RAM) capacity do you need?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "8GB", title: "8GB RAM", note: "Standard browsing, study & light office tasks" },
                    { id: "16GB", title: "16GB RAM", note: "Recommended for Software Engineers & Heavy Multitasking" },
                    { id: "32GB", title: "32GB+ RAM", note: "Extreme 32GB+ for Virtual Machines & 4K Video Editing" },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRam(r.id)}
                      className={`p-4 rounded border text-left transition-all ${
                        ram === r.id
                          ? "border-[#FFB200] bg-amber-50/40"
                          : "border-[#EBEBEB] hover:border-slate-300 bg-white"
                      }`}
                    >
                      <h4 className="font-normal text-xs text-slate-800">{r.title}</h4>
                      <p className="text-[11px] font-extralight text-slate-400 mt-1">{r.note}</p>
                    </button>
                  ))}
                </div>

                <div className="pt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-xs font-light text-slate-500 hover:text-slate-900"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFindProducts}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-[#FFB200] hover:bg-[#FFA500] text-white font-light text-xs uppercase tracking-wider rounded flex items-center gap-2 transition-colors shadow-xs"
                  >
                    {isLoading ? "Matching Inventory..." : "Find My Matching Computers"} <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: RESULTS VIEW */}
        {step === 5 && results && (
          <div className="space-y-6">
            <div className="bg-white rounded border border-[#EBEBEB] p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-light text-[#FFB200] uppercase tracking-wider">
                  Recommendation Analysis Complete
                </span>
                <h2 className="text-xl font-normal text-slate-800 mt-1">
                  We found {results.length} suitable {results.length === 1 ? "machine" : "machines"} for your criteria
                </h2>
                <p className="text-xs font-extralight text-slate-400 mt-1">
                  Workload: <strong>{purpose}</strong> • Budget: Up to <strong>{formatNaira(parseFloat(budgetMax))}</strong> • RAM: <strong>{ram}</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-light flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Start Over
              </button>
            </div>

            {results.length === 0 ? (
              <div className="bg-white rounded border border-[#EBEBEB] p-12 text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto stroke-[1.5]" />
                <h3 className="text-base font-light text-slate-800 uppercase tracking-wide">
                  No exact match within this budget range
                </h3>
                <p className="text-xs font-extralight text-slate-400 max-w-md mx-auto">
                  Our inventory updates weekly. You can request a special procurement order directly from our team on WhatsApp.
                </p>
                <div className="pt-2">
                  <a
                    href="https://wa.me/2348067150130?text=Hello%20GuaranteedTech%2C%20I%20used%20your%20Smart%20Finder%20and%20need%20a%20laptop%20sourced%20for%20my%20specs."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-light text-xs uppercase tracking-wider rounded hover:bg-emerald-700 transition-colors shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Request Custom Sourcing on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {results.map((item) => (
                  <ProductCard
                    key={item.product.id}
                    product={item.product}
                    recommendationReason={item.recommendationReason}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
