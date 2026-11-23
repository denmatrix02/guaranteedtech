import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { MessageSquare } from "lucide-react";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://guaranteedtech.vercel.app");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GuaranteedTech — Certified Computers, Laptops & IT Hardware in Nigeria",
    template: "%s | GuaranteedTech",
  },
  description:
    "Buy certified refurbished and brand-new business laptops (ThinkPad, HP EliteBook, MacBook), desktop workstations, displays, and computer accessories with 6-month warranty and nationwide payment on delivery.",
  applicationName: "GuaranteedTech",
  keywords: [
    "GuaranteedTech",
    "laptops in Nigeria",
    "certified refurbished laptops",
    "business laptops Aba",
    "Lenovo ThinkPad Nigeria",
    "HP EliteBook",
    "MacBook Pro Nigeria",
    "computer hardware Aba Abia State",
    "payment on delivery laptops",
  ],
  authors: [{ name: "GuaranteedTech", url: siteUrl }],
  creator: "GuaranteedTech",
  publisher: "GuaranteedTech",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl,
    siteName: "GuaranteedTech",
    title: "GuaranteedTech — Certified Computers, Laptops & IT Hardware in Nigeria",
    description:
      "Nigeria's verified enterprise computing technology provider. Authentic, tested, and certified business laptops, workstations, and computer hardware with 6-month warranty and nationwide payment on delivery.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        secureUrl: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "GuaranteedTech — Certified Computers, Laptops & IT Hardware in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GuaranteedTech — Certified Computers, Laptops & IT Hardware in Nigeria",
    description:
      "Certified business laptops, workstations, and peripherals with 6-month warranty and nationwide payment on delivery in Nigeria.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
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

