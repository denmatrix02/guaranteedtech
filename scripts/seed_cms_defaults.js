require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function main() {
  console.log("Seeding CMS defaults and business settings...");

  // 1. Business Settings
  const settings = [
    {
      key: "general",
      valueJson: JSON.stringify({
        storeName: "GuaranteedTech",
        tagline: "Certified Computers, Laptops & IT Hardware in Nigeria",
        logoUrl: "/images/ui/guaranteed_brand_logo.png",
        currency: "NGN",
        currencySymbol: "₦",
        defaultDeliveryFee: 4500,
        freeDeliveryThreshold: 500000,
        enablePaymentOnDelivery: true,
        enableWhatsAppOrdering: true,
        supportEmail: "guarateedtech17@gmail.com",
        supportPhone: "+2348067150130",
        whatsappNumber: "2348067150130",
        announcementText: "⚡ FAST NATIONWIDE DELIVERY VIA GIG LOGISTICS • INSPECT BEFORE PAYMENT ON DELIVERY",
        announcementLink: "/shop",
        announcementEnabled: true,
      }),
    },
    {
      key: "branches",
      valueJson: JSON.stringify([
        {
          id: "azikiwe",
          name: "Flagship Showroom (Azikiwe Road)",
          address: "111/113 Azikiwe Road, Aba, Abia State",
          phone: "+2348067150130",
          email: "guarateedtech17@gmail.com",
          hours: "Mon - Sat: 8:00 AM - 6:00 PM",
          manager: "Executive Operations",
          isPrimary: true,
        },
        {
          id: "asa_road",
          name: "Town Hall Tech Hub (Asa Road)",
          address: "No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State",
          phone: "+2348067150130",
          email: "guarateedtech17@gmail.com",
          hours: "Mon - Sat: 8:30 AM - 5:30 PM",
          manager: "Hardware Services Lead",
          isPrimary: false,
        },
      ]),
    },
    {
      key: "warranty_defaults",
      valueJson: JSON.stringify({
        refurbishedMonths: 3,
        refurbishedTerms: "3-Month Comprehensive GTC Hardware Warranty with free parts & labor",
        openBoxMonths: 6,
        openBoxTerms: "6-Month Comprehensive GTC Hardware Warranty with direct replacement coverage",
        brandNewMonths: 12,
        brandNewTerms: "1-Year Official Manufacturer Warranty with authorized service center support",
        moneyBackGuaranteeDays: 7,
      }),
    },
    {
      key: "social_links",
      valueJson: JSON.stringify({
        facebook: "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr",
        instagram: "https://www.instagram.com/guaranteed_tech/",
        whatsapp: "https://wa.me/2348067150130",
        twitter: "https://twitter.com/guaranteedtech",
      }),
    },
  ];

  for (const s of settings) {
    await prisma.businessSetting.upsert({
      where: { key: s.key },
      update: { valueJson: s.valueJson },
      create: { key: s.key, valueJson: s.valueJson },
    });
    console.log(`Setting [${s.key}] updated.`);
  }

  // 2. CMS Pages
  const pages = [
    {
      slug: "about",
      title: "About GuaranteedTech",
      subtitle: "Nigeria's Premier Certified Enterprise Hardware Supplier",
      contentHtml: `<p>GuaranteedTech is Nigeria's most trusted direct vendor of enterprise-grade business laptops, certified workstations, LaserJet printing systems, and critical power infrastructure.</p><p>Headquartered in the commercial heart of Aba, Abia State, with physical flagship centers at 111/113 Azikiwe Road and No. 2 Asa Road, we bridge the gap between world-class Silicon Valley computing hardware and Nigerian businesses, software engineers, banking institutions, and universities.</p>`,
      seoTitle: "About Us | GuaranteedTech Nigeria",
      seoDescription: "Learn about GuaranteedTech, our diagnostic lab testing, and nationwide delivery across Nigeria.",
      isPublished: true,
    },
    {
      slug: "warranty",
      title: "Warranty & Quality Guarantee Policy",
      subtitle: "Peace of Mind with Comprehensive Hardware Coverage",
      contentHtml: `<p>Every computing machine sold by GuaranteedTech undergoes a rigorous 30-point diagnostic inspection testing the processor, dedicated graphics, battery wear cycles, RAM parity, thermals, display calibration, and structural unibody integrity.</p><p>We provide full warranty support: 3 months for Certified Refurbished, 6 months for Open Box, and 1 full year for Brand New hardware.</p>`,
      seoTitle: "Warranty & Guarantee | GuaranteedTech Nigeria",
      seoDescription: "Official warranty terms, service centers in Aba, and claim procedures.",
      isPublished: true,
    },
    {
      slug: "shipping",
      title: "Nationwide Shipping & GIG Logistics",
      subtitle: "Fast, Insured Deliveries to All 36 States and FCT Abuja",
      contentHtml: `<p>We partner with GIG Logistics, Nigeria's premier courier service, to guarantee door-to-door delivery within 24 to 72 hours across Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Owerri, Kano, and all 36 states.</p><p>Payment on Delivery is supported in major regional hubs, allowing you to power on, inspect, and verify your hardware before completing payment.</p>`,
      seoTitle: "Shipping & Delivery Rates | GuaranteedTech Nigeria",
      seoDescription: "Nationwide logistics tracking, door delivery times, and GIG Logistics dispatch.",
      isPublished: true,
    },
    {
      slug: "returns",
      title: "Return & Exchange Policy",
      subtitle: "Simple, Hassle-Free Hardware Replacement Guarantee",
      contentHtml: `<p>If your certified system exhibits any hardware fault within 7 days of delivery, GuaranteedTech provides immediate troubleshooting, express return logistics, and immediate replacement or full refund.</p>`,
      seoTitle: "Return & Exchange Policy | GuaranteedTech Nigeria",
      seoDescription: "7-day return policy and exchange terms.",
      isPublished: true,
    },
    {
      slug: "procurement",
      title: "Corporate Procurement & Bulk RFQs",
      subtitle: "Equip Your Remote Engineering Team or Corporate Enterprise",
      contentHtml: `<p>GuaranteedTech delivers fleet procurement for engineering firms, commercial banks, universities, and tech startups. We provide official invoices, bulk discounting, and standardized fleet configurations.</p>`,
      seoTitle: "Corporate Procurement & RFQs | GuaranteedTech Nigeria",
      seoDescription: "Request bulk hardware quotations for corporate engineering fleets.",
      isPublished: true,
    },
    {
      slug: "privacy",
      title: "Privacy & Data Protection Policy",
      subtitle: "How We Protect Your Commercial and Personal Information",
      contentHtml: `<p>GuaranteedTech respects your privacy. We never share customer phone numbers, delivery addresses, or purchase history with third-party advertising brokers.</p>`,
      seoTitle: "Privacy Policy | GuaranteedTech Nigeria",
      seoDescription: "Privacy policy and data protection for GuaranteedTech customers.",
      isPublished: true,
    },
    {
      slug: "terms",
      title: "Terms of Service & Hardware Sale",
      subtitle: "Commercial Sales Agreement and Dispatch Guidelines",
      contentHtml: `<p>All products sold on GuaranteedTech are backed by our authenticity guarantee. Orders placed online are confirmed via telephone or WhatsApp before logistics dispatch.</p>`,
      seoTitle: "Terms of Service | GuaranteedTech Nigeria",
      seoDescription: "Standard terms and commercial conditions of sale.",
      isPublished: true,
    },
  ];

  for (const p of pages) {
    await prisma.cmsPage.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        subtitle: p.subtitle,
        contentHtml: p.contentHtml,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        isPublished: p.isPublished,
      },
      create: p,
    });
    console.log(`Page [${p.slug}] updated.`);
  }

  // 3. Initial Active Promotion
  const defaultPromo = await prisma.promotion.upsert({
    where: { slug: "apple-collection-30" },
    update: {
      title: "30% Discount on Apple Collection",
      discountType: "PERCENTAGE",
      discountValue: 30,
      bannerUrl: "/images/ui/promo_laptop.jpg",
      ctaLabel: "Shop Apple Collection",
      ctaUrl: "/shop?brand=apple",
      countdownEnabled: true,
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days ahead
      isActive: true,
    },
    create: {
      title: "30% Discount on Apple Collection",
      slug: "apple-collection-30",
      description: "Exclusive promotional pricing on Apple MacBook Pro M3, MacBook Air, and iMac displays.",
      discountType: "PERCENTAGE",
      discountValue: 30,
      bannerUrl: "/images/ui/promo_laptop.jpg",
      ctaLabel: "Shop Apple Collection",
      ctaUrl: "/shop?brand=apple",
      countdownEnabled: true,
      startAt: new Date(),
      endAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      applicableCategories: JSON.stringify(["laptops", "desktops"]),
    },
  });
  console.log("Promo seeded:", defaultPromo.title);

  // 4. Default Blog Post
  const blog = await prisma.blogPost.upsert({
    where: { slug: "best-business-laptops-nigeria-2026" },
    update: {},
    create: {
      title: "Best Business Laptops for Nigerian Developers in 2026",
      slug: "best-business-laptops-nigeria-2026",
      excerpt: "Detailed comparison of ThinkPad T-Series vs HP EliteBook 840 for long battery life and heavy Docker workloads.",
      contentHtml: "<p>When selecting a business laptop for modern software development in Nigeria, reliable thermals, 10+ hours battery endurance, and hardware durability are non-negotiable.</p>",
      featuredImage: "/images/ui/post_1.jpg",
      category: "LAPTOPS",
      tags: "Laptops,Programming,ThinkPad,HP",
      isPublished: true,
      isFeatured: true,
    },
  });
  console.log("Blog post seeded:", blog.title);

  // 5. Default Navigation Menus
  const navMenus = [
    { location: "HEADER", label: "Home", url: "/", displayOrder: 1 },
    { location: "HEADER", label: "Shop All", url: "/shop", displayOrder: 2 },
    { location: "HEADER", label: "Laptops", url: "/shop?category=laptops", displayOrder: 3 },
    { location: "HEADER", label: "Printers", url: "/shop?category=a4-printers", displayOrder: 4 },
    { location: "HEADER", label: "Corporate RFQ", url: "/procurement", displayOrder: 5 },
    { location: "HEADER", label: "About Us", url: "/about", displayOrder: 6 },
    { location: "HEADER", label: "Contact", url: "/contact", displayOrder: 7 },
  ];

  for (const m of navMenus) {
    const existing = await prisma.navigationMenu.findFirst({
      where: { location: m.location, label: m.label },
    });
    if (!existing) {
      await prisma.navigationMenu.create({ data: m });
    }
  }
  console.log("Navigation menus seeded.");

  console.log("All CMS defaults successfully seeded!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
