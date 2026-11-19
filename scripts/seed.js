const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting GuaranteedTech Database Seed...");

  // 1. Clean existing records (in dependency order)
  await prisma.auditLog.deleteMany();
  await prisma.searchDemandLog.deleteMany();
  await prisma.productEnquiry.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.relatedProduct.deleteMany();
  await prisma.productSpecification.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.homepageBanner.deleteMany();
  await prisma.homepageSection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log("Existing tables cleaned.");

  // 2. Create Users
  const adminPassword = await bcrypt.hash("Admin@GT2026!", 10);
  const managerPassword = await bcrypt.hash("Manager@GT2026!", 10);
  const customerPassword = await bcrypt.hash("Customer@GT2026!", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@guaranteedtech.ng",
      passwordHash: adminPassword,
      name: "Dennis (Super Admin)",
      phone: "+2348067150130",
      role: "SUPER_ADMIN",
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@guaranteedtech.ng",
      passwordHash: managerPassword,
      name: "Store Operations Manager",
      phone: "+2348012345678",
      role: "STORE_MANAGER",
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: "customer@guaranteedtech.ng",
      passwordHash: customerPassword,
      name: "Chukwudi Okafor",
      phone: "+2348099887766",
      role: "CUSTOMER",
      addresses: {
        create: {
          fullName: "Chukwudi Okafor",
          phone: "+2348099887766",
          state: "Lagos",
          city: "Ikeja",
          streetAddress: "12 Computer Village, Otigba Street",
          isDefault: true,
        },
      },
    },
  });

  console.log("Users created: Admin, Manager, Customer.");

  // 3. Create Brands
  const brandList = [
    { name: "Lenovo", slug: "lenovo", description: "World-leading PC & ThinkPad enterprise computing systems" },
    { name: "HP", slug: "hp", description: "Hewlett Packard enterprise EliteBooks, ProBooks, and LaserJet printers" },
    { name: "Dell", slug: "dell", description: "Latitude, XPS, OptiPlex, and Precision engineering workstations" },
    { name: "Apple", slug: "apple", description: "MacBook Pro, MacBook Air, iMac, and Apple Silicon devices" },
    { name: "ASUS", slug: "asus", description: "ROG Gaming, ZenBook ultrabooks, and high-performance hardware" },
    { name: "Logitech", slug: "logitech", description: "Ergonomic productivity mice, mechanical keyboards, and webcams" },
    { name: "APC", slug: "apc", description: "Schneider Electric uninterruptible power supply (UPS) systems" },
    { name: "Samsung", slug: "samsung", description: "High-speed NVMe solid state drives and curved gaming monitors" },
    { name: "Anker", slug: "anker", description: "Premium USB-C hubs, power banks, and high-wattage GaN chargers" },
    { name: "Canon", slug: "canon", description: "High-yield continuous ink tank and laser enterprise printers" },
  ];

  const brands = {};
  for (const b of brandList) {
    brands[b.slug] = await prisma.brand.create({ data: b });
  }

  console.log("Brands seeded.");

  // 4. Create Hierarchical Categories
  const catLaptops = await prisma.category.create({
    data: {
      name: "Laptops",
      slug: "laptops",
      description: "Business laptops, ultrabooks, student laptops, and gaming machines",
      isPopular: true,
      displayOrder: 1,
    },
  });

  const catBusinessLaptops = await prisma.category.create({
    data: {
      name: "Business Laptops",
      slug: "business-laptops",
      parentId: catLaptops.id,
      isPopular: true,
      displayOrder: 1,
    },
  });

  const catGamingLaptops = await prisma.category.create({
    data: {
      name: "Gaming Laptops",
      slug: "gaming-laptops",
      parentId: catLaptops.id,
      isPopular: true,
      displayOrder: 2,
    },
  });

  const catDesktops = await prisma.category.create({
    data: {
      name: "Desktop Computers",
      slug: "desktop-computers",
      description: "Tower desktops, all-in-one PCs, and micro form factor workstations",
      isPopular: true,
      displayOrder: 2,
    },
  });

  const catPrinters = await prisma.category.create({
    data: {
      name: "Printers & Supplies",
      slug: "printers-supplies",
      description: "LaserJet printers, MegaTank multifunction inkjets, and toner",
      isPopular: true,
      displayOrder: 3,
    },
  });

  const catMonitors = await prisma.category.create({
    data: {
      name: "Monitors & Displays",
      slug: "monitors-displays",
      description: "4K IPS designer displays, curved gaming monitors, and dual-monitor mounts",
      isPopular: true,
      displayOrder: 4,
    },
  });

  const catPower = await prisma.category.create({
    data: {
      name: "UPS & Power Solutions",
      slug: "ups-power-solutions",
      description: "Pure sine wave uninterruptible power supplies, surge arresters, and backup batteries",
      isPopular: true,
      displayOrder: 5,
    },
  });

  const catStorage = await prisma.category.create({
    data: {
      name: "Storage & Components",
      slug: "storage-components",
      description: "NVMe M.2 SSDs, high-frequency DDR4/DDR5 RAM, and external hard drives",
      isPopular: true,
      displayOrder: 6,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: "Computer Accessories",
      slug: "computer-accessories",
      description: "Wireless mice, keyboards, docking stations, USB-C multi-port hubs, and laptop bags",
      isPopular: true,
      displayOrder: 7,
    },
  });

  console.log("Categories seeded.");

  // 5. Seed Core Products & Variants
  // Product 1: Lenovo ThinkPad T490s (Hero product from UGC Video and Store Inventory)
  const pThinkpad = await prisma.product.create({
    data: {
      name: "Lenovo ThinkPad T490s 14\" FHD Touchscreen (Core i7, 16GB RAM, 256GB SSD)",
      slug: "lenovo-thinkpad-t490s-core-i7-16gb-256gb-touchscreen",
      sku: "GT-LEN-T490S-01",
      brandId: brands["lenovo"].id,
      categoryId: catBusinessLaptops.id,
      series: "ThinkPad",
      modelNumber: "T490s",
      condition: "REFURBISHED",
      conditionDetails: "Grade A+ Certified — 100% GTC Quality Inspected, Pristine Outer Shell, 100% Battery Health Tested",
      basePrice: 485000,
      comparePrice: 550000,
      discountPercent: 12,
      stockQuantity: 18,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 6,
      warrantyDetails: "GuaranteedTech 6-Month Comprehensive Warranty with Free Technical Support & Diagnostic Checkups",
      shortDescription: "The gold standard in corporate reliability. Features an Intel Core i7 processor (4 cores, 8 threads), 16GB RAM, 256GB SSD, and responsive 10-point FHD Touchscreen running Windows 11 Pro.",
      fullDescription: "Built for professionals who need a durable, lightning-fast workhorse. The ThinkPad T490s features MIL-SPEC military-grade durability, the legendary spill-resistant ThinkPad keyboard with TrackPoint, an anti-glare 10-point multi-touch display, and robust hardware security. Inspected and verified by GuaranteedTech technicians with official GTC QC certification.",
      intendedUsage: "PROGRAMMING,BUSINESS,STUDENT,OFFICE,GENERAL_PRODUCTIVITY",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: true,
      viewCount: 1420,
      salesCount: 42,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80", altText: "Lenovo ThinkPad T490s Lid and Keyboard", isPrimary: true, displayOrder: 1 },
          { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", altText: "ThinkPad T490s Side Profile & Ports", isPrimary: false, displayOrder: 2 },
          { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80", altText: "ThinkPad T490s Touchscreen Display", isPrimary: false, displayOrder: 3 },
        ],
      },
      variants: {
        create: [
          { sku: "GT-LEN-T490S-16-256", name: "16GB RAM / 256GB NVMe SSD (Core i7)", ram: "16GB", storage: "256GB SSD", cpu: "Intel Core i7-8665U", priceAdjustment: 0, stockQuantity: 12, isDefault: true },
          { sku: "GT-LEN-T490S-16-512", name: "16GB RAM / 512GB NVMe SSD (Core i7)", ram: "16GB", storage: "512GB SSD", cpu: "Intel Core i7-8665U", priceAdjustment: 35000, stockQuantity: 6, isDefault: false },
        ],
      },
      specifications: {
        create: [
          { category: "Processor", specKey: "CPU Model", specValue: "Intel Core i7-8665U vPro (4 Cores, 8 Threads, up to 4.8GHz)", displayOrder: 1 },
          { category: "Memory", specKey: "Installed RAM", specValue: "16GB DDR4 High-Frequency Memory", displayOrder: 2 },
          { category: "Storage", specKey: "Drive Type", specValue: "256GB / 512GB M.2 PCIe NVMe Solid State Drive", displayOrder: 3 },
          { category: "Display", specKey: "Screen Size & Resolution", specValue: "14.0\" FHD (1920 x 1080) IPS, 10-Point Multi-Touch Support", displayOrder: 4 },
          { category: "Graphics", specKey: "GPU", specValue: "Intel UHD Graphics 620", displayOrder: 5 },
          { category: "Operating System", specKey: "OS", specValue: "Windows 11 Pro 64-Bit Licensed", displayOrder: 6 },
          { category: "Ports & Connectivity", specKey: "I/O Ports", specValue: "2x USB 3.1, 1x USB-C / Thunderbolt 3, 1x HDMI 1.4b, RJ45 Ethernet via dongle, Audio combo jack", displayOrder: 7 },
          { category: "Battery & Security", specKey: "Battery & Biometrics", specValue: "Rapid Charge 57Wh Battery, Match-on-Chip Fingerprint Reader, ThinkShutter Privacy Camera", displayOrder: 8 },
        ],
      },
    },
  });

  // Product 2: HP EliteBook 840 G8
  const pElitebook840 = await prisma.product.create({
    data: {
      name: "HP EliteBook 840 G8 14\" Business Laptop (Core i7 11th Gen, 16GB RAM, 512GB SSD)",
      slug: "hp-elitebook-840-g8-core-i7-16gb-512gb",
      sku: "GT-HP-840G8-01",
      brandId: brands["hp"].id,
      categoryId: catBusinessLaptops.id,
      series: "EliteBook",
      modelNumber: "840 G8",
      condition: "BRAND_NEW",
      conditionDetails: "Brand New Sealed in Original Factory Box with 1-Year Manufacturer Warranty",
      basePrice: 850000,
      comparePrice: 950000,
      discountPercent: 11,
      stockQuantity: 10,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 12,
      warrantyDetails: "1-Year Official HP Manufacturer Warranty + GuaranteedTech Tech Support Guarantee",
      shortDescription: "Ultra-premium business elegance. Intel Core i7 11th Gen vPro, 16GB DDR4 RAM, 512GB NVMe SSD, Bang & Olufsen tuned audio, and all-aluminum unibody chassis.",
      fullDescription: "Designed for modern executives and demanding engineers. The HP EliteBook 840 G8 delivers AI-based audio reduction, HP Sure Start self-healing BIOS protection, and stellar battery performance in an ultra-portable 1.35kg chassis.",
      intendedUsage: "PROGRAMMING,BUSINESS,STUDENT,OFFICE",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSpecialOffer: false,
      viewCount: 2150,
      salesCount: 38,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80", altText: "HP EliteBook 840 G8 Front Angle", isPrimary: true, displayOrder: 1 },
          { url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80", altText: "HP EliteBook 840 G8 Keyboard & Screen", isPrimary: false, displayOrder: 2 },
        ],
      },
      variants: {
        create: [
          { sku: "GT-HP-840G8-16-512", name: "16GB RAM / 512GB SSD", ram: "16GB", storage: "512GB SSD", cpu: "Intel Core i7-1185G7", priceAdjustment: 0, stockQuantity: 7, isDefault: true },
          { sku: "GT-HP-840G8-32-1TB", name: "32GB RAM / 1TB SSD", ram: "32GB", storage: "1TB SSD", cpu: "Intel Core i7-1185G7", priceAdjustment: 120000, stockQuantity: 3, isDefault: false },
        ],
      },
      specifications: {
        create: [
          { category: "Processor", specKey: "CPU", specValue: "Intel Core i7-1185G7 (4 Cores, 8 Threads, up to 4.80GHz)", displayOrder: 1 },
          { category: "Memory", specKey: "RAM", specValue: "16GB / 32GB DDR4-3200MHz (2x SODIMM Slots)", displayOrder: 2 },
          { category: "Storage", specKey: "Storage", specValue: "512GB / 1TB PCIe NVMe M.2 SSD", displayOrder: 3 },
          { category: "Display", specKey: "Screen", specValue: "14\" FHD (1920x1080) IPS Anti-glare 400 nits, 100% sRGB", displayOrder: 4 },
          { category: "Operating System", specKey: "OS", specValue: "Windows 11 Pro 64-Bit Licensed", displayOrder: 5 },
        ],
      },
    },
  });

  // Product 3: HP EliteBook 840 G7 (Essential Alternative for G8 when budget is sensitive)
  const pElitebook840G7 = await prisma.product.create({
    data: {
      name: "HP EliteBook 840 G7 14\" Business Ultrabook (Core i5 10th Gen, 16GB RAM, 256GB SSD)",
      slug: "hp-elitebook-840-g7-core-i5-16gb-256gb",
      sku: "GT-HP-840G7-01",
      brandId: brands["hp"].id,
      categoryId: catBusinessLaptops.id,
      series: "EliteBook",
      modelNumber: "840 G7",
      condition: "REFURBISHED",
      conditionDetails: "Grade A+ Refurbished — Clean outer body, battery life tested at 90%+, GuaranteedTech certified",
      basePrice: 395000,
      comparePrice: 460000,
      discountPercent: 14,
      stockQuantity: 15,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 6,
      warrantyDetails: "GuaranteedTech 6-Month Warranty with Free Diagnostic Support",
      shortDescription: "Budget-friendly flagship performance. Intel Core i5 10th Gen, 16GB RAM, 256GB SSD, aluminum chassis. Perfect alternative to the G8 at almost half the price.",
      fullDescription: "Shares the same premium aluminum chassis and Bang & Olufsen sound system as the 840 G8, offering exceptional value for programmers, business analysts, and remote executives.",
      intendedUsage: "PROGRAMMING,BUSINESS,STUDENT,OFFICE",
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: true,
      viewCount: 1820,
      salesCount: 51,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80", altText: "HP EliteBook 840 G7 Front View", isPrimary: true, displayOrder: 1 },
        ],
      },
      variants: {
        create: [
          { sku: "GT-HP-840G7-16-256", name: "16GB RAM / 256GB SSD", ram: "16GB", storage: "256GB SSD", cpu: "Intel Core i5-10310U", priceAdjustment: 0, stockQuantity: 15, isDefault: true },
        ],
      },
    },
  });

  // Product 4: Dell Latitude 7420
  const pDell7420 = await prisma.product.create({
    data: {
      name: "Dell Latitude 7420 Carbon Fiber 14\" Ultrabook (Core i7 11th Gen, 16GB RAM, 512GB SSD)",
      slug: "dell-latitude-7420-core-i7-16gb-512gb",
      sku: "GT-DEL-7420-01",
      brandId: brands["dell"].id,
      categoryId: catBusinessLaptops.id,
      series: "Latitude",
      modelNumber: "7420",
      condition: "REFURBISHED",
      conditionDetails: "Grade A+ Carbon Fiber Weave Finish, Tested 100% Functionality",
      basePrice: 620000,
      comparePrice: 700000,
      discountPercent: 11,
      stockQuantity: 8,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 6,
      shortDescription: "Carbon-fiber lightweight engineering. 11th Gen Intel Core i7, 16GB RAM, 512GB NVMe SSD, ExpressCharge, and Thunderbolt 4.",
      fullDescription: "Premium Dell enterprise ultrabook competing directly with the ThinkPad T14/X1 Carbon and HP EliteBook 840 G8. Features an expressive FHD screen, intelligent audio, and ExpressConnect.",
      intendedUsage: "PROGRAMMING,BUSINESS,STUDENT,ENGINEERING",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isSpecialOffer: false,
      viewCount: 940,
      salesCount: 19,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80", altText: "Dell Latitude 7420 Open Lid", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 5: Apple MacBook Pro 16" M3 Pro
  const pMacBookPro = await prisma.product.create({
    data: {
      name: "Apple MacBook Pro 16\" (M3 Pro Chip 12-Core CPU / 18-Core GPU, 18GB RAM, 512GB SSD, Space Black)",
      slug: "apple-macbook-pro-16-m3-pro-18gb-512gb-space-black",
      sku: "GT-APL-MBP16-M3",
      brandId: brands["apple"].id,
      categoryId: catLaptops.id,
      series: "MacBook Pro",
      modelNumber: "M3 Pro",
      condition: "BRAND_NEW",
      conditionDetails: "Brand New Factory Sealed, 1-Year Official AppleCare Warranty",
      basePrice: 3450000,
      comparePrice: 3700000,
      discountPercent: 7,
      stockQuantity: 5,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 12,
      shortDescription: "Mind-blowing performance for extreme workflows. Apple M3 Pro chip, Liquid Retina XDR display, up to 22 hours battery life, Space Black finish.",
      fullDescription: "The ultimate machine for senior software engineers, 3D animators, data scientists, and creative directors in Nigeria. Powered by Apple Silicon M3 Pro with hardware-accelerated ray tracing.",
      intendedUsage: "PROGRAMMING,GRAPHIC_DESIGN,ENGINEERING,WORKSTATION",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSpecialOffer: false,
      viewCount: 3890,
      salesCount: 14,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80", altText: "MacBook Pro 16 Space Black", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 6: ASUS ROG Zephyrus G14 Gaming Laptop
  const pAsusROG = await prisma.product.create({
    data: {
      name: "ASUS ROG Zephyrus G14 Gaming Laptop (Ryzen 9 7940HS, 16GB DDR5, 1TB SSD, RTX 4060, 165Hz QHD)",
      slug: "asus-rog-zephyrus-g14-ryzen-9-rtx-4060-1tb-ssd",
      sku: "GT-ASUS-ROG14-01",
      brandId: brands["asus"].id,
      categoryId: catGamingLaptops.id,
      series: "ROG Zephyrus",
      modelNumber: "G14",
      condition: "BRAND_NEW",
      conditionDetails: "Brand New in Box with Factory Warranty",
      basePrice: 2100000,
      comparePrice: 2350000,
      discountPercent: 11,
      stockQuantity: 6,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 12,
      shortDescription: "Ultra-compact gaming beast. AMD Ryzen 9 7940HS, NVIDIA GeForce RTX 4060 8GB GDDR6, ROG Nebula QHD 165Hz Display, Moonlight White.",
      fullDescription: "Combines immense graphical horsepower with portable ultrabook battery life and styling. Ideal for AAA gaming, AI modeling, machine learning, and Unreal Engine rendering.",
      intendedUsage: "GAMING,ENGINEERING,GRAPHIC_DESIGN,PROGRAMMING",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isSpecialOffer: true,
      viewCount: 1950,
      salesCount: 11,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80", altText: "ASUS ROG Zephyrus G14", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 7: HP LaserJet Pro MFP M428fdw Wireless Printer
  const pPrinter = await prisma.product.create({
    data: {
      name: "HP LaserJet Pro MFP M428fdw Wireless Monochrome All-in-One Enterprise Printer",
      slug: "hp-laserjet-pro-mfp-m428fdw-wireless-printer",
      sku: "GT-HP-M428FDW-01",
      brandId: brands["hp"].id,
      categoryId: catPrinters.id,
      series: "LaserJet Pro",
      modelNumber: "M428fdw",
      condition: "BRAND_NEW",
      conditionDetails: "Brand New in Sealed HP Box with full starter toner cartridge",
      basePrice: 590000,
      comparePrice: 650000,
      discountPercent: 9,
      stockQuantity: 12,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 12,
      shortDescription: "Fast, reliable monochrome laser multi-function printer. Print, scan, copy, and fax with automatic 2-sided scanning, dual-band Wi-Fi, and PIN printing.",
      fullDescription: "Built to keep your business moving forward. Prints up to 40 pages per minute with world-class HP Wolf Pro security embedded.",
      intendedUsage: "OFFICE,BUSINESS",
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: false,
      viewCount: 880,
      salesCount: 27,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&q=80", altText: "HP LaserJet Pro MFP M428fdw", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 8: Dell UltraSharp U2723QE 27" 4K Monitor
  const pMonitor = await prisma.product.create({
    data: {
      name: "Dell UltraSharp U2723QE 27\" 4K UHD IPS USB-C Hub Monitor (90W PD, IPS Black, 98% DCI-P3)",
      slug: "dell-ultrasharp-u2723qe-27-4k-usb-c-monitor",
      sku: "GT-DEL-U2723QE",
      brandId: brands["dell"].id,
      categoryId: catMonitors.id,
      series: "UltraSharp",
      modelNumber: "U2723QE",
      condition: "BRAND_NEW",
      basePrice: 750000,
      comparePrice: 820000,
      discountPercent: 9,
      stockQuantity: 9,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 36,
      shortDescription: "Groundbreaking IPS Black technology with 2000:1 contrast ratio. Single-cable 90W USB-C charging, RJ45 Ethernet hub, and factory color calibrated.",
      fullDescription: "The premier monitor for developers and creatives. Connect your laptop via one USB-C cable for power, video, and gigabit wired networking.",
      intendedUsage: "PROGRAMMING,GRAPHIC_DESIGN,OFFICE,WORKSTATION",
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isSpecialOffer: false,
      viewCount: 1340,
      salesCount: 16,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80", altText: "Dell UltraSharp U2723QE Monitor", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 9: APC Smart-UPS 1500VA LCD 230V
  const pUPS = await prisma.product.create({
    data: {
      name: "APC Smart-UPS 1500VA LCD 230V Pure Sine Wave Power Backup (SMT1500I)",
      slug: "apc-smart-ups-1500va-lcd-230v-pure-sine-wave",
      sku: "GT-APC-SMT1500I",
      brandId: brands["apc"].id,
      categoryId: catPower.id,
      series: "Smart-UPS",
      modelNumber: "SMT1500I",
      condition: "BRAND_NEW",
      basePrice: 620000,
      comparePrice: 680000,
      discountPercent: 9,
      stockQuantity: 8,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 24,
      shortDescription: "Enterprise-grade power protection against outages and power surges in Nigeria. Pure sine wave output for sensitive PCs, servers, and network storage.",
      fullDescription: "Safeguards critical workstations and servers from Nigeria's unpredictable power fluctuations. Features intelligent battery management with temperature-compensated charging.",
      intendedUsage: "OFFICE,BUSINESS,WORKSTATION",
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: false,
      viewCount: 710,
      salesCount: 22,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80", altText: "APC Smart-UPS 1500VA", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 10: Logitech MX Master 3S Wireless Mouse
  const pMouse = await prisma.product.create({
    data: {
      name: "Logitech MX Master 3S Performance Wireless Ergonomic Mouse (8K DPI, Quiet Clicks)",
      slug: "logitech-mx-master-3s-wireless-mouse-graphite",
      sku: "GT-LOG-MX3S",
      brandId: brands["logitech"].id,
      categoryId: catAccessories.id,
      series: "MX Master",
      modelNumber: "3S",
      condition: "BRAND_NEW",
      basePrice: 115000,
      comparePrice: 130000,
      discountPercent: 12,
      stockQuantity: 24,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 12,
      shortDescription: "An icon remastered. 8,000 DPI track-on-glass sensor, MagSpeed electromagnetic scroll wheel, and 90% quieter clicks.",
      fullDescription: "Pair with up to 3 computers across Windows and Mac. The gold standard in precision productivity navigation.",
      intendedUsage: "PROGRAMMING,OFFICE,GRAPHIC_DESIGN,STUDENT",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: false,
      viewCount: 2280,
      salesCount: 68,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80", altText: "Logitech MX Master 3S Graphite", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 11: Anker 555 USB-C Hub 8-in-1
  const pHub = await prisma.product.create({
    data: {
      name: "Anker 555 USB-C Hub 8-in-1 PowerExpand (100W Power Delivery, 4K 60Hz HDMI, 1Gbps LAN)",
      slug: "anker-555-usb-c-hub-8-in-1-powerexpand",
      sku: "GT-ANK-555HUB",
      brandId: brands["anker"].id,
      categoryId: catAccessories.id,
      series: "PowerExpand",
      modelNumber: "555",
      condition: "BRAND_NEW",
      basePrice: 65000,
      comparePrice: 75000,
      discountPercent: 13,
      stockQuantity: 30,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 18,
      shortDescription: "Massive 8-port expansion. Pass-through 100W USB-C charging, 4K 60Hz HDMI, gigabit Ethernet, high-speed 10Gbps USB-C data, and SD/microSD slots.",
      fullDescription: "Turn your single laptop port into a full desktop workstation dock. Tested and fully compatible with ThinkPads, EliteBooks, MacBooks, and Dell Latitudes.",
      intendedUsage: "PROGRAMMING,STUDENT,OFFICE,BUSINESS",
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: true,
      viewCount: 1670,
      salesCount: 74,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80", altText: "Anker 555 USB-C Hub", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Product 12: Samsung 980 PRO 1TB NVMe SSD
  const pSSD = await prisma.product.create({
    data: {
      name: "Samsung 980 PRO 1TB PCIe 4.0 NVMe M.2 Internal Solid State Drive (Up to 7,000 MB/s)",
      slug: "samsung-980-pro-1tb-nvme-pcie-4-ssd",
      sku: "GT-SAM-980PRO-1TB",
      brandId: brands["samsung"].id,
      categoryId: catStorage.id,
      series: "980 PRO",
      modelNumber: "MZ-V8P1T0B/AM",
      condition: "BRAND_NEW",
      basePrice: 135000,
      comparePrice: 155000,
      discountPercent: 13,
      stockQuantity: 20,
      availabilityStatus: "IN_STOCK",
      warrantyMonths: 60,
      shortDescription: "Next-level SSD performance. Sequential read speeds up to 7,000 MB/s. Perfect for upgrading laptops, workstations, or PS5 consoles.",
      fullDescription: "Powered by Samsung's in-house Elpis Controller. Provides thermal control and unmatched durability with 600 TBW endurance.",
      intendedUsage: "GAMING,PROGRAMMING,WORKSTATION",
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isSpecialOffer: false,
      viewCount: 1110,
      salesCount: 39,
      images: {
        create: [
          { url: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80", altText: "Samsung 980 PRO SSD", isPrimary: true, displayOrder: 1 },
        ],
      },
    },
  });

  // Link Related Products (Crucial for Alternatives and Cross-Sell)
  await prisma.relatedProduct.createMany({
    data: [
      { productId: pElitebook840.id, relatedProductId: pElitebook840G7.id, relationType: "ALTERNATIVE" },
      { productId: pElitebook840.id, relatedProductId: pThinkpad.id, relationType: "ALTERNATIVE" },
      { productId: pElitebook840.id, relatedProductId: pDell7420.id, relationType: "ALTERNATIVE" },
      { productId: pThinkpad.id, relatedProductId: pHub.id, relationType: "ACCESSORY" },
      { productId: pThinkpad.id, relatedProductId: pMouse.id, relationType: "FREQUENTLY_BOUGHT_TOGETHER" },
      { productId: pThinkpad.id, relatedProductId: pDell7420.id, relationType: "ALTERNATIVE" },
      { productId: pDell7420.id, relatedProductId: pThinkpad.id, relationType: "ALTERNATIVE" },
    ],
  });

  // Seed Customer Reviews
  await prisma.review.createMany({
    data: [
      {
        productId: pThinkpad.id,
        userId: customer.id,
        reviewerName: "Emeka Balogun",
        rating: 5,
        title: "Cleanest Refurbished ThinkPad I've ever bought in Lagos!",
        comment: "Received this in Ikeja via GIG Logistics within 24 hours. The battery lasts over 6 hours and the touch screen is super responsive. Windows 11 Pro was cleanly installed.",
        isVerifiedPurchase: true,
        isApproved: true,
      },
      {
        productId: pThinkpad.id,
        reviewerName: "Fatima Aliyu",
        rating: 5,
        title: "Superb for coding and remote work",
        comment: "Runs VS Code, Docker, and 20 Chrome tabs without breaking a sweat. GuaranteedTech customer service on WhatsApp is top tier.",
        isVerifiedPurchase: true,
        isApproved: true,
      },
      {
        productId: pElitebook840.id,
        reviewerName: "Babajide Williams",
        rating: 5,
        title: "Brand New Sealed as promised",
        comment: "Was hesitant at first to pay before delivery, but GTC delivered seamlessly. HP warranty registered successfully on HP's website.",
        isVerifiedPurchase: true,
        isApproved: true,
      },
    ],
  });

  // 6. Seed Complete Dynamic Homepage CMS Sections
  const sections = [
    {
      sectionKey: "announcement_bar",
      title: "Promotional Announcement Bar",
      sectionType: "HTML_BLOCK",
      displayOrder: 1,
      isPublished: true,
      configJson: JSON.stringify({
        text: "⚡ Fast Nationwide Delivery via GIG Logistics | 6-Month GuaranteedTech Warranty | WhatsApp Order Support: +234 806 715 0130",
        linkText: "Shop New Arrivals",
        linkUrl: "/shop?sort=newest",
        bgColor: "#0F172A",
        textColor: "#FFFFFF",
      }),
    },
    {
      sectionKey: "hero_carousel",
      title: "Hero Promotional Campaigns",
      subtitle: "Main homepage interactive banner carousel",
      sectionType: "HERO_CAROUSEL",
      displayOrder: 2,
      isPublished: true,
      banners: {
        create: [
          {
            title: "Lenovo ThinkPad T490s Touchscreen",
            subtitle: "Intel Core i7 | 16GB RAM | 256GB SSD | Windows 11 Pro — Inspected & Certified",
            imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=1600&q=85",
            targetUrl: `/products/${pThinkpad.slug}`,
            buttonText: "Order Now — ₦485,000",
            badgeText: "HOT DEAL 🔥",
            displayOrder: 1,
            isPublished: true,
          },
          {
            title: "HP EliteBook 840 Series",
            subtitle: "Executive Business Laptops for Developers & Founders — From ₦395,000",
            imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=85",
            targetUrl: `/shop?brand=hp`,
            buttonText: "Explore EliteBooks",
            badgeText: "POPULAR CHOICE",
            displayOrder: 2,
            isPublished: true,
          },
          {
            title: "Enterprise Power & Workstations",
            subtitle: "APC Pure Sine Wave UPS, Dell 4K Displays & NVMe High-Speed Storage",
            imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1600&q=85",
            targetUrl: `/shop?category=monitors-displays`,
            buttonText: "Upgrade Setup",
            badgeText: "OFFICE WORKSTATIONS",
            displayOrder: 3,
            isPublished: true,
          },
        ],
      },
    },
    {
      sectionKey: "category_navigation",
      title: "Browse Top Categories",
      subtitle: "Find the exact equipment built for your workflow",
      sectionType: "CATEGORY_GRID",
      displayOrder: 3,
      isPublished: true,
    },
    {
      sectionKey: "featured_products",
      title: "Featured Hardware",
      subtitle: "Hand-picked high-demand laptops and professional workstations",
      sectionType: "PRODUCT_GRID",
      displayOrder: 4,
      isPublished: true,
      configJson: JSON.stringify({ filter: "featured", limit: 8 }),
    },
    {
      sectionKey: "smart_finder_promo",
      title: "Not Sure What Laptop You Need?",
      subtitle: "Use our Smart Recommendation Finder to match your budget and exact technical requirements in under 60 seconds.",
      sectionType: "BANNER_PROMO",
      displayOrder: 5,
      isPublished: true,
      configJson: JSON.stringify({
        ctaText: "Launch Smart Finder",
        ctaUrl: "/smart-finder",
        accentColor: "#FFB200",
      }),
    },
    {
      sectionKey: "best_sellers",
      title: "Best-Selling Laptops & Systems",
      subtitle: "Proven favorites trusted by Nigerian businesses and programmers",
      sectionType: "PRODUCT_GRID",
      displayOrder: 6,
      isPublished: true,
      configJson: JSON.stringify({ filter: "best_seller", limit: 4 }),
    },
    {
      sectionKey: "special_offers",
      title: "Special Deals & Discounts",
      subtitle: "Limited-time price cuts on certified computers and components",
      sectionType: "PRODUCT_GRID",
      displayOrder: 7,
      isPublished: true,
      configJson: JSON.stringify({ filter: "special_offer", limit: 4 }),
    },
    {
      sectionKey: "popular_accessories",
      title: "Must-Have Tech Accessories",
      subtitle: "Ergonomic mice, USB-C docks, and enterprise accessories",
      sectionType: "PRODUCT_GRID",
      displayOrder: 8,
      isPublished: true,
      configJson: JSON.stringify({ categorySlug: "computer-accessories", limit: 4 }),
    },
    {
      sectionKey: "customer_reviews",
      title: "What Nigerian Techies Say About Us",
      subtitle: "Real verified purchases from customers across Lagos, Abuja, Port Harcourt, and Ibadan",
      sectionType: "REVIEWS_CAROUSEL",
      displayOrder: 9,
      isPublished: true,
    },
  ];

  for (const sec of sections) {
    const { banners, ...secData } = sec;
    const createdSec = await prisma.homepageSection.create({ data: secData });
    if (banners && banners.create) {
      for (const b of banners.create) {
        await prisma.homepageBanner.create({
          data: {
            ...b,
            sectionId: createdSec.id,
          },
        });
      }
    }
  }

  console.log("Homepage CMS Sections configured.");

  // 7. Seed Sample Search Demand Log
  await prisma.searchDemandLog.createMany({
    data: [
      {
        query: "HP EliteBook 840 G8",
        normalizedQuery: "hp elitebook 840 g8",
        brandFilter: "HP",
        resultCount: 2,
        hasExactMatch: true,
        isUnavailableProduct: false,
      },
      {
        query: "MacBook Air M3 16GB",
        normalizedQuery: "macbook air m3 16gb",
        brandFilter: "Apple",
        resultCount: 0,
        hasExactMatch: false,
        isUnavailableProduct: true,
        requestedAlternatives: JSON.stringify([pMacBookPro.id]),
      },
      {
        query: "Gaming laptop under 1000000",
        normalizedQuery: "gaming laptop under 1000000",
        maxPrice: 1000000,
        resultCount: 1,
        hasExactMatch: false,
        isUnavailableProduct: false,
        requestedAlternatives: JSON.stringify([pAsusROG.id]),
      },
    ],
  });

  console.log("GuaranteedTech Database Seed Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

