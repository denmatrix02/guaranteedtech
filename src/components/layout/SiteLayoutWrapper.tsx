"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MessageSquare } from "lucide-react";

export function SiteLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin portal: completely free of storefront header, storefront footer, and customer floating CTA
    return <main className="flex-1 min-h-screen w-full bg-[#FAFBFD]">{children}</main>;
  }

  // Storefront customer layout
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Persistent Floating WhatsApp CTA Widget for Storefront Only */}
      <a
        href="https://wa.me/2348067150130?text=Hello%20GuaranteedTech%2C%20I%20am%20visiting%20your%20website%20and%20need%20assistance%20with%20a%20product."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Assistance"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden sm:inline-block">Chat on WhatsApp</span>
      </a>
    </>
  );
}
