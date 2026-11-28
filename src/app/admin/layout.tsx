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
  X,
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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsMobileDrawerOpen(false);
  }, [pathname]);

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

  const renderSidebarContent = (isMobile = false) => (
    <>
      {/* Brand Header */}
      <div className="h-16 lg:h-20 px-5 lg:px-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
        <Link href="/admin" className="flex items-center flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ui/guaranteed_brand_logo.png"
            alt="GuaranteedTech"
            className="h-6 lg:h-7 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-light uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
            Admin
          </span>
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(false)}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Close Navigation"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Current Operator Profile */}
      <div className="p-3 mx-3 lg:mx-4 my-3 bg-slate-50/80 rounded border border-slate-100 flex items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-[#FFB200] text-white font-normal text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
            {operator?.name ? operator.name[0] : "A"}
          </div>
          <div className="overflow-hidden min-w-0">
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
      <nav className="flex-1 px-3 py-2 space-y-4 overflow-y-auto">
        {navSections.map((sec) => (
          <div key={sec.title} className="space-y-0.5">
            <span className="px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 block mb-1">
              {sec.title}
            </span>
            {sec.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileDrawerOpen(false)}
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
      <div className="p-3.5 border-t border-slate-100 text-[11px] font-extralight text-slate-400 flex items-center justify-between flex-shrink-0">
        <span>Enterprise Portal</span>
        <span className="text-emerald-600 flex items-center gap-1 font-light">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
        </span>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#FAFBFD] flex flex-col lg:flex-row text-slate-800 font-sans">
      {/* 1. Desktop Fixed Left Sidebar */}
      <aside className="hidden lg:flex fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-100 flex-col flex-shrink-0 z-30 h-screen overflow-y-auto">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. Mobile Backdrop Overlay */}
      {isMobileDrawerOpen && (
        <div
          onClick={() => setIsMobileDrawerOpen(false)}
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-2xs z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* 3. Mobile Slide-Over Off-Canvas Drawer */}
      {isMobileDrawerOpen && (
        <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white z-50 flex flex-col lg:hidden border-r border-slate-200 shadow-2xl overflow-hidden animate-in slide-in-from-left duration-200">
          {renderSidebarContent(true)}
        </aside>
      )}

      {/* 4. Main Admin Content Area - Offset on Desktop by Fixed Sidebar Width */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 h-16 lg:h-20 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 focus:outline-none"
              aria-label="Open Navigation"
            >
              <Menu className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* Breadcrumb text */}
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-light text-slate-400 truncate">
              <Link href="/" className="hover:text-slate-800 transition-colors hidden sm:inline">
                Storefront
              </Link>
              <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:inline flex-shrink-0" />
              <span className="text-slate-700 font-normal truncate">Administration</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <Link
              href="/"
              target="_blank"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-[#EBEBEB] hover:border-[#FFB200] text-slate-700 hover:text-[#FFB200] font-light text-xs uppercase tracking-[0.12em] rounded-full flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Public Storefront</span>
              <span className="sm:hidden">Storefront</span>
            </Link>
          </div>
        </header>

        {/* Content Viewport locking onto unified container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-[1240px] mx-auto space-y-6 sm:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
