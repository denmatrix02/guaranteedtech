const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedInstagramGallery() {
  console.log("Seeding instagram_gallery in database...");

  let section = await prisma.homepageSection.findUnique({
    where: { sectionKey: "instagram_gallery" },
    include: { banners: true },
  });

  if (!section) {
    section = await prisma.homepageSection.create({
      data: {
        sectionKey: "instagram_gallery",
        title: "INSTAGRAM @GUARANTEED_TECH",
        subtitle: "Live showroom inventory, unboxing previews, and customer deliveries from our Aba enterprise hubs.",
        sectionType: "HTML_BLOCK",
        displayOrder: 10,
        isPublished: true,
      },
      include: { banners: true },
    });
    console.log("Created 'instagram_gallery' section:", section.id);
  }

  if (section.banners.length === 0) {
    const initialInsta = [
      {
        title: "MacBook Pro M3 Space Black Showroom Unboxing",
        subtitle: "Pristine Apple Silicon workstations inspected and ready for dispatch.",
        imageUrl: "/images/ui/insta_1.jpg",
        targetUrl: "https://www.instagram.com/guaranteed_tech/",
        badgeText: "INSTAGRAM",
        displayOrder: 1,
        isPublished: true,
      },
      {
        title: "Lenovo ThinkPad T-Series Fleet Sourcing",
        subtitle: "Corporate batch testing: 100% battery health diagnostic checks.",
        imageUrl: "/images/ui/insta_2.jpg",
        targetUrl: "https://www.instagram.com/guaranteed_tech/",
        badgeText: "INSTAGRAM",
        displayOrder: 2,
        isPublished: true,
      },
      {
        title: "HP EliteBook 840 Executive Ultrabooks",
        subtitle: "Sleek aluminum unibody laptops with backlit keyboards and FHD displays.",
        imageUrl: "/images/ui/insta_3.jpg",
        targetUrl: "https://www.instagram.com/guaranteed_tech/",
        badgeText: "INSTAGRAM",
        displayOrder: 3,
        isPublished: true,
      },
      {
        title: "Dell Latitude & Precision Workstations",
        subtitle: "Heavy-duty CAD and engineering machines prepared for client delivery.",
        imageUrl: "/images/ui/insta_4.jpg",
        targetUrl: "https://www.instagram.com/guaranteed_tech/",
        badgeText: "INSTAGRAM",
        displayOrder: 4,
        isPublished: true,
      },
      {
        title: "APC Smart-UPS & Clean Power Solutions",
        subtitle: "Enterprise power protection systems for developer desks and servers.",
        imageUrl: "/images/ui/insta_5.jpg",
        targetUrl: "https://www.instagram.com/guaranteed_tech/",
        badgeText: "INSTAGRAM",
        displayOrder: 5,
        isPublished: true,
      },
      {
        title: "GuaranteedTech Flagship Aba Showroom",
        subtitle: "Visit us at 111/113 Azikiwe Road & No. 2 Asa Road, Aba, Abia State.",
        imageUrl: "/images/ui/insta_6.jpg",
        targetUrl: "https://www.instagram.com/guaranteed_tech/",
        badgeText: "INSTAGRAM",
        displayOrder: 6,
        isPublished: true,
      },
    ];

    for (const item of initialInsta) {
      await prisma.homepageBanner.create({
        data: {
          sectionId: section.id,
          ...item,
        },
      });
    }
    console.log("Seeded 6 Instagram gallery items.");
  } else {
    console.log(`'instagram_gallery' already has ${section.banners.length} items.`);
  }
}

seedInstagramGallery().catch(console.error).finally(() => prisma.$disconnect());
