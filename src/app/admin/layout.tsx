"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  SlidersHorizontal,
  ShoppingCart,
  Truck,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Loader2,
  Share2,
  PlusCircle,
  Layers,
  Award,
  Sparkles,
  FileText,
  Menu,
  ImageIcon,
  Briefcase,
  Star,
  BookOpen,
  Settings,
  Users,
  Boxes,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [operator, setOperator] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(pathname !== "/admin/login");

  // Check authentication session on mount
  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsVerifying(false);
      return;
    }

    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/session", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });
        const data = await res.json();
        if (!data.authenticated) {
          router.replace("/admin/login");
        } else {
          setOperator(data.user);
          setIsVerifying(false);
        }
      } catch {
        router.replace("/admin/login");
      }
    };

    checkSession();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } catch {
      router.replace("/admin/login");
    }
  };

  // If on login route, render standalone login view without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // If session is still verifying, display minimal clean loading skeleton
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#FAFBFD] flex flex-col items-center justify-center p-6 font-sans">
        <div className="flex items-center gap-2.5 text-xs font-light text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin text-[#FFB200]" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  const navSections = [
    {
      title: "Core",
      items: [
        { name: "Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4 stroke-[1.4]" /> },
      ],
    },
    {
      title: "Catalog",
      items: [
        { name: "Products", href: "/admin/products", icon: <Package className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Add Product", href: "/admin/products/new", icon: <PlusCircle className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Categories", href: "/admin/categories", icon: <Layers className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Brands", href: "/admin/brands", icon: <Award className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Inventory", href: "/admin/inventory", icon: <Boxes className="w-4 h-4 stroke-[1.4]" /> },
      ],
    },
    {
      title: "Storefront CMS",
      items: [
        { name: "Homepage CMS", href: "/admin/cms", icon: <SlidersHorizontal className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Promotions & Offers", href: "/admin/promotions", icon: <Sparkles className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Website Pages", href: "/admin/pages", icon: <FileText className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Navigation Menus", href: "/admin/menus", icon: <Menu className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Social Feed", href: "/admin/posts", icon: <Share2 className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Media Assets", href: "/admin/media", icon: <ImageIcon className="w-4 h-4 stroke-[1.4]" /> },
      ],
    },
    {
      title: "Sales & Operations",
      items: [
        { name: "Orders & Sales", href: "/admin/orders", icon: <ShoppingCart className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Corporate RFQ", href: "/admin/rfq", icon: <Briefcase className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Customer Enquiries", href: "/admin/enquiries", icon: <MessageSquare className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Product Reviews", href: "/admin/reviews", icon: <Star className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Search Demand", href: "/admin/search-demand", icon: <TrendingUp className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Logistics", href: "/admin/logistics", icon: <Truck className="w-4 h-4 stroke-[1.4]" /> },
      ],
    },
    {
      title: "Content & Settings",
      items: [
        { name: "Hardware Blog", href: "/admin/blog", icon: <BookOpen className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Business Settings", href: "/admin/settings", icon: <Settings className="w-4 h-4 stroke-[1.4]" /> },
        { name: "Staff & Roles", href: "/admin/staff", icon: <Users className="w-4 h-4 stroke-[1.4]" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col lg:flex-row text-slate-800 font-sans">
      {/* Sidebar - Fixed to Left Screen Edge on Desktop, Never Scrolling Off */}
      <aside className="w-full lg:fixed lg:top-0 lg:bottom-0 lg:left-0 lg:w-64 bg-white border-r border-slate-100 flex flex-col flex-shrink-0 z-30 lg:h-screen lg:overflow-y-auto">
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="flex items-center flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/ui/guaranteed_brand_logo.png"
              alt="GuaranteedTech"
              className="h-7 w-auto object-contain"
            />
          </Link>
          <span className="text-[9px] font-light uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
            Admin
          </span>
        </div>

        {/* Current Operator Profile */}
        <div className="p-3.5 mx-4 my-3 bg-slate-50/70 rounded border border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#FFB200] text-white font-normal text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              {operator?.name ? operator.name[0] : "A"}
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-normal text-slate-800 block truncate">
                {operator?.name || "Executive Admin"}
              </span>
              <span className="text-[10px] font-extralight text-slate-400 block truncate">
                {operator?.email || "guarateedtech17@gmail.com"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 rounded hover:bg-slate-200/70 text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5 stroke-[1.4]" />
          </button>
        </div>

        {/* Navigation Items (Organized by Module Groups) */}
        <nav className="flex-1 px-3 py-3 space-y-5 overflow-y-auto">
          {navSections.map((sec) => (
            <div key={sec.title} className="space-y-1">
              <span className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 block mb-1">
                {sec.title}
              </span>
              {sec.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-light tracking-[0.06em] transition-all ${
                      isActive
                        ? "bg-amber-50 text-[#FFB200] font-normal border-l-2 border-[#FFB200]"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span className={isActive ? "text-[#FFB200]" : "text-slate-400"}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 text-[11px] font-extralight text-slate-400 flex items-center justify-between">
          <span>Enterprise Portal</span>
          <span className="text-emerald-600 flex items-center gap-1 font-light">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </span>
        </div>
      </aside>

      {/* Main Admin Content Area - Offset on Desktop by Fixed Sidebar Width */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-100 px-6 sm:px-8 h-20 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-xs font-light text-slate-400">
            <Link href="/" className="hover:text-slate-800 transition-colors">Storefront</Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-700 font-normal">Administration</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-[#FFB200] font-light text-xs uppercase tracking-[0.14em] rounded-full flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Storefront
            </Link>
          </div>
        </header>

        {/* Content Viewport locking onto unified container */}
        <main className="flex-1 p-6 sm:p-8">
          <div className="max-w-[1240px] mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
