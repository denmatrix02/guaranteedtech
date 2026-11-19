import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "GuaranteedTech — Certified Computers, Laptops & IT Hardware in Nigeria",
  description:
    "Buy certified refurbished and brand-new business laptops (ThinkPad, HP EliteBook, MacBook), workstations, displays, and computer accessories with 6-month warranty and nationwide GIG Logistics delivery.",
  openGraph: {
    title: "GuaranteedTech — Premium Electronics & Laptops Nigeria",
    description: "Quality inspected business laptops, workstations, and peripherals. Fast nationwide shipping via GIG Logistics.",
    siteName: "GuaranteedTech",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-amber-400 selection:text-slate-950">
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />

          {/* Persistent Floating WhatsApp CTA Widget */}
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
        </CartProvider>
      </body>
    </html>
  );
}

