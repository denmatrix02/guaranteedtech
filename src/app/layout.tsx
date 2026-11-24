import type { Metadata } from "next";
import "./globals.css";
import { SiteLayoutWrapper } from "@/components/layout/SiteLayoutWrapper";
import { CartProvider } from "@/context/CartContext";

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
    "Buy certified refurbished, open-box, and brand-new business laptops (ThinkPad, HP EliteBook, MacBook), desktop workstations, displays, and computer accessories with certified warranty and nationwide payment on delivery.",
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
      "Nigeria's verified enterprise computing technology provider. Authentic, tested, and certified business laptops, workstations, and computer hardware with comprehensive certified warranty and nationwide payment on delivery.",
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
      "Certified business laptops, workstations, and peripherals with certified warranty and nationwide payment on delivery in Nigeria.",
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
          <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}

