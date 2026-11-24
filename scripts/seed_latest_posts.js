const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedLatestPosts() {
  console.log("Seeding latest_posts section in database...");

  // Check if sectionKey 'latest_posts' already exists
  let section = await prisma.homepageSection.findUnique({
    where: { sectionKey: "latest_posts" },
    include: { banners: true },
  });

  if (!section) {
    section = await prisma.homepageSection.create({
      data: {
        sectionKey: "latest_posts",
        title: "LATEST POSTS",
        subtitle: "Official GuaranteedTech tech insights, enterprise hardware reviews, and Facebook community updates.",
        sectionType: "ARTICLES_GRID",
        displayOrder: 8,
        isPublished: true,
      },
      include: { banners: true },
    });
    console.log("Created 'latest_posts' homepage section:", section.id);
  }

  // If banners are empty, populate the 4 initial sample posts pointing to Facebook
  if (section.banners.length === 0) {
    const initialPosts = [
      {
        title: "Best Business Laptops for Nigerian Developers in 2026",
        subtitle: "Detailed comparison of ThinkPad T-Series vs HP EliteBook 840 for long battery life and heavy Docker workloads.",
        imageUrl: "/images/ui/post_1.jpg",
        targetUrl: "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr",
        badgeText: "LAPTOPS",
        buttonText: "READ MORE",
        displayOrder: 1,
        isPublished: true,
      },
      {
        title: "How to Choose the Right Desktop Workstation",
        subtitle: "Factors to consider when selecting CAD, 3D animation, and deep learning workstation towers.",
        imageUrl: "/images/ui/post_2.jpg",
        targetUrl: "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr",
        badgeText: "ENTERPRISE",
        buttonText: "READ MORE",
        displayOrder: 2,
        isPublished: true,
      },
      {
        title: "Extending Battery Longevity in Refurbished Laptops",
        subtitle: "Proven configuration tips, charging cycles, and power management settings for maximum daily endurance.",
        imageUrl: "/images/ui/post_3.jpg",
        targetUrl: "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr",
        badgeText: "TIPS",
        buttonText: "READ MORE",
        displayOrder: 3,
        isPublished: true,
      },
      {
        title: "Why Hardware TPM 2.0 Matters for Remote Work",
        subtitle: "Essential enterprise security protocols for protecting proprietary company data on portable workstations.",
        imageUrl: "/images/ui/post_4.jpg",
        targetUrl: "https://www.facebook.com/share/1VKj3gkgd2/?mibextid=wwXIfr",
        badgeText: "SECURITY",
        buttonText: "READ MORE",
        displayOrder: 4,
        isPublished: true,
      },
    ];

    for (const p of initialPosts) {
      await prisma.homepageBanner.create({
        data: {
          sectionId: section.id,
          ...p,
        },
      });
    }
    console.log("Seeded 4 initial Facebook posts into 'latest_posts' section.");
  } else {
    console.log(`'latest_posts' already has ${section.banners.length} posts.`);
  }
}

seedLatestPosts().catch(console.error).finally(() => prisma.$disconnect());
