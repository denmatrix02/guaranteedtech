export interface CategoryItem {
  name: string;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  badge?: string;
}

export interface BudgetRange {
  label: string;
  min?: number;
  max?: number;
}

export interface CategoryFilterConfig {
  brands: { name: string; slug: string }[];
  budgetRanges: BudgetRange[];
  conditions: { label: string; val: string }[];
}

/**
 * 11+ Official Categories Requested by Store Owner
 */
export const OFFICIAL_CATEGORIES: CategoryItem[] = [
  {
    name: "Laptops",
    slug: "laptops",
    description: "Certified business laptops, executive ultrabooks, student laptops & workstation machines.",
    image: "/images/ui/category_6.jpg",
    iconName: "Laptop",
    badge: "Certified Grade A+",
  },
  {
    name: "Desktops",
    slug: "desktops",
    description: "Tower desktops, all-in-one PCs, and micro form factor workstations for business & CAD.",
    image: "/images/ui/category_4.jpg",
    iconName: "Monitor",
    badge: "Enterprise Towers",
  },
  {
    name: "A4 Printers",
    slug: "a4-printers",
    description: "LaserJet printers, high-capacity MegaTank/EcoTank multifunction color printers.",
    image: "/images/ui/category_1.jpg",
    iconName: "Printer",
    badge: "Laser & Tank",
  },
  {
    name: "Receipt Printers",
    slug: "receipt-printers",
    description: "Thermal POS 58mm & 80mm receipt printers with USB, Bluetooth, and LAN connectivity.",
    image: "/images/categories/receipt-printers.svg",
    iconName: "Receipt",
    badge: "High-Speed Thermal",
  },
  {
    name: "Projectors",
    slug: "projectors",
    description: "Full HD & 4K presentation projectors for executive boardrooms, churches & classrooms.",
    image: "/images/ui/category_2.jpg",
    iconName: "Projector",
    badge: "High Lumens",
  },
  {
    name: "Routers",
    slug: "routers",
    description: "Dual-band Gigabit Wi-Fi 6 routers, multi-WAN load balance routers & enterprise VPN gateways.",
    image: "/images/categories/routers.svg",
    iconName: "Wifi",
    badge: "Gigabit & Mesh",
  },
  {
    name: "Access Points",
    slug: "access-points",
    description: "Long-range ceiling and outdoor dual-band PoE wireless access points for seamless coverage.",
    image: "/images/categories/access-points.svg",
    iconName: "Radio",
    badge: "PoE Long Range",
  },
  {
    name: "Network Cables",
    slug: "network-cables",
    description: "Pure copper Cat6 & Cat6A UTP/FTP patch cords, RJ45 connectors & 305m roll cables.",
    image: "/images/categories/network-cables.svg",
    iconName: "Cable",
    badge: "Pure Copper Cat6",
  },
  {
    name: "Laptop Batteries",
    slug: "laptop-batteries",
    description: "Original OEM certified replacement batteries for HP, Dell, Lenovo, Apple & ASUS laptops.",
    image: "/images/categories/laptop-batteries.svg",
    iconName: "BatteryCharging",
    badge: "Genuine OEM Cells",
  },
  {
    name: "UPS",
    slug: "ups",
    description: "Pure sine wave uninterruptible power supplies, voltage surge protectors & power backups.",
    image: "/images/categories/ups.svg",
    iconName: "Zap",
    badge: "Pure Sine Wave",
  },
  {
    name: "Point of Sale Systems",
    slug: "pos-systems",
    description: "Touchscreen POS terminals, 1D/2D barcode scanners, metal cash drawers & accessories.",
    image: "/images/categories/pos-systems.svg",
    iconName: "ScanBarcode",
    badge: "Retail & Hospitality",
  },
  {
    name: "Other Accessories",
    slug: "other-accessories",
    description: "Ergonomic mice, mechanical keyboards, multi-port USB-C hubs, power adapters & laptop bags.",
    image: "/images/ui/category_3.jpg",
    iconName: "Layers",
    badge: "Tech Essentials",
  },
];

/**
 * Robust Category Alias Map
 * Normalizes user queries, query params, and legacy database slugs into canonical categories.
 */
export const CATEGORY_ALIAS_MAP: Record<string, string> = {
  // Laptops
  "laptops": "laptops",
  "laptop": "laptops",
  "notebooks": "laptops",
  "business-laptops": "laptops",
  "gaming-laptops": "laptops",

  // Desktops
  "desktops": "desktops",
  "desktop": "desktops",
  "desktop-computers": "desktops",
  "workstations": "desktops",
  "towers": "desktops",
  "all-in-one": "desktops",

  // A4 Printers
  "a4-printers": "a4-printers",
  "a4-printer": "a4-printers",
  "printers": "a4-printers",
  "printer": "a4-printers",
  "printers-supplies": "a4-printers",
  "printing-supplies": "a4-printers",
  "inks-toner": "a4-printers",

  // Receipt Printers
  "receipt-printers": "receipt-printers",
  "receipt-printer": "receipt-printers",
  "thermal-printers": "receipt-printers",
  "pos-printers": "receipt-printers",
  "pos-printer": "receipt-printers",

  // Projectors
  "projectors": "projectors",
  "projector": "projectors",
  "monitors-displays": "projectors",
  "monitors": "projectors",
  "displays": "projectors",

  // Routers
  "routers": "routers",
  "router": "routers",
  "wifi-routers": "routers",
  "network-routers": "routers",

  // Access Points
  "access-points": "access-points",
  "access-point": "access-points",
  "ap": "access-points",
  "wireless-ap": "access-points",

  // Network Cables
  "network-cables": "network-cables",
  "network-cable": "network-cables",
  "ethernet-cables": "network-cables",
  "cat6": "network-cables",
  "cables": "network-cables",

  // Laptop Batteries
  "laptop-batteries": "laptop-batteries",
  "laptop-battery": "laptop-batteries",
  "batteries": "laptop-batteries",
  "battery": "laptop-batteries",

  // UPS
  "ups": "ups",
  "ups-power-solutions": "ups",
  "power": "ups",
  "inverters": "ups",
  "backup-power": "ups",

  // POS Systems
  "pos-systems": "pos-systems",
  "pos": "pos-systems",
  "point-of-sale": "pos-systems",
  "point-of-sale-system-and-accessories": "pos-systems",
  "barcode-scanners": "pos-systems",
  "cash-drawers": "pos-systems",

  // Other Accessories
  "other-accessories": "other-accessories",
  "accessories": "other-accessories",
  "computer-accessories": "other-accessories",
  "equipment": "other-accessories",
  "storage-components": "other-accessories",
  "storage": "other-accessories",
};

/**
 * Normalizes any raw category slug
 */
export function normalizeCategorySlug(rawSlug?: string | null): string | null {
  if (!rawSlug) return null;
  const cleaned = rawSlug.trim().toLowerCase();
  return CATEGORY_ALIAS_MAP[cleaned] || cleaned;
}

/**
 * Canonical Category Metadata Registry
 */
export const CANONICAL_CATEGORIES: Record<string, { name: string; description: string }> = {
  "laptops": {
    name: "Laptops & Ultrabooks",
    description: "Certified business laptops, executive ultrabooks, and high-performance workstation machines.",
  },
  "desktops": {
    name: "Desktop Workstations & Computers",
    description: "Enterprise tower workstations, micro form factor PCs, and engineering desktop systems.",
  },
  "a4-printers": {
    name: "A4 Printers & Supplies",
    description: "Certified enterprise LaserJet printers, high-capacity MegaTank multifunction inkjets, and toner.",
  },
  "receipt-printers": {
    name: "Receipt Printers (Thermal & POS)",
    description: "High-speed 58mm & 80mm thermal receipt printers with USB, Bluetooth, and LAN interfaces.",
  },
  "projectors": {
    name: "Projectors & Presentation Displays",
    description: "High-lumen Full HD & 4K presentation projectors for boardrooms, educational centers, and events.",
  },
  "routers": {
    name: "Routers & Network Gateways",
    description: "Gigabit dual-band Wi-Fi 6 routers, multi-WAN load-balancing gateways, and VPN hardware.",
  },
  "access-points": {
    name: "Wireless Access Points (PoE)",
    description: "High-density enterprise ceiling and outdoor dual-band PoE access points with seamless roaming.",
  },
  "network-cables": {
    name: "Network Cables & Infrastructure",
    description: "Pure copper Cat6/Cat6A patch cords, RJ45 crimp accessories, and 305m roll cables.",
  },
  "laptop-batteries": {
    name: "Laptop Batteries (OEM Certified)",
    description: "Authentic Grade A OEM replacement batteries for HP, Dell, Lenovo, Apple, and ASUS laptops.",
  },
  "ups": {
    name: "UPS & Clean Power Solutions",
    description: "Pure sine wave uninterruptible power supply systems, line interactive UPS, and surge arresters.",
  },
  "pos-systems": {
    name: "Point of Sale (POS) Systems & Accessories",
    description: "All-in-one touchscreen POS systems, high-speed 1D/2D barcode scanners, and metal cash drawers.",
  },
  "other-accessories": {
    name: "Accessories & Peripherals",
    description: "Logitech precision mice, mechanical keyboards, multi-port USB-C hubs, and protective laptop sleeves.",
  },
};

export function getCategoryMetadata(canonicalSlug: string): { name: string; description: string } {
  return (
    CANONICAL_CATEGORIES[canonicalSlug] || {
      name: canonicalSlug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      description: "Explore our certified hardware inventory with comprehensive warranty and nationwide delivery.",
    }
  );
}

/**
 * Dynamic Filter Configurations:
 * Changes Brands, Conditions, and Budget price ranges depending on the category selected!
 */
export function getCategoryFilterConfig(categorySlug?: string | null): CategoryFilterConfig {
  const slug = normalizeCategorySlug(categorySlug);

  // Default Standard Conditions
  const standardConditions = [
    { label: "Brand New (Factory Sealed)", val: "BRAND_NEW" },
    { label: "Refurbished (GTC Certified)", val: "REFURBISHED" },
    { label: "Open Box", val: "OPEN_BOX" },
  ];

  const brandNewTestedConditions = [
    { label: "Brand New (Factory Sealed)", val: "BRAND_NEW" },
    { label: "Certified / Tested", val: "REFURBISHED" },
    { label: "Open Box", val: "OPEN_BOX" },
  ];

  const brandNewOnly = [
    { label: "Brand New (Factory Sealed)", val: "BRAND_NEW" },
    { label: "Open Box", val: "OPEN_BOX" },
  ];

  switch (slug) {
    case "laptops":
      return {
        brands: [
          { name: "HP", slug: "hp" },
          { name: "Dell", slug: "dell" },
          { name: "Lenovo", slug: "lenovo" },
          { name: "Apple", slug: "apple" },
          { name: "ASUS", slug: "asus" },
          { name: "Acer", slug: "acer" },
        ],
        budgetRanges: [
          { label: "Under ₦350,000", max: 350000 },
          { label: "₦350,000 – ₦650,000", min: 350000, max: 650000 },
          { label: "₦650,000 – ₦1,200,000", min: 650000, max: 1200000 },
          { label: "₦1,200,000 & Above", min: 1200000 },
        ],
        conditions: standardConditions,
      };

    case "desktops":
      return {
        brands: [
          { name: "HP", slug: "hp" },
          { name: "Dell", slug: "dell" },
          { name: "Lenovo", slug: "lenovo" },
          { name: "Apple", slug: "apple" },
        ],
        budgetRanges: [
          { label: "Under ₦300,000", max: 300000 },
          { label: "₦300,000 – ₦600,000", min: 300000, max: 600000 },
          { label: "₦600,000 – ₦1,000,000", min: 600000, max: 1000000 },
          { label: "₦1,000,000 & Above", min: 1000000 },
        ],
        conditions: standardConditions,
      };

    case "a4-printers":
      return {
        brands: [
          { name: "HP", slug: "hp" },
          { name: "Canon", slug: "canon" },
          { name: "Epson", slug: "epson" },
          { name: "Brother", slug: "brother" },
        ],
        budgetRanges: [
          { label: "Under ₦150,000", max: 150000 },
          { label: "₦150,000 – ₦300,000", min: 150000, max: 300000 },
          { label: "₦300,000 – ₦600,000", min: 300000, max: 600000 },
          { label: "₦600,000 & Above", min: 600000 },
        ],
        conditions: brandNewTestedConditions,
      };

    case "receipt-printers":
      return {
        brands: [
          { name: "Epson", slug: "epson" },
          { name: "Xprinter", slug: "xprinter" },
          { name: "Zebra", slug: "zebra" },
          { name: "Rongta", slug: "rongta" },
          { name: "HPRT", slug: "hprt" },
        ],
        budgetRanges: [
          { label: "Under ₦60,000", max: 60000 },
          { label: "₦60,000 – ₦120,000", min: 60000, max: 120000 },
          { label: "₦120,000 – ₦250,000", min: 120000, max: 250000 },
          { label: "₦250,000 & Above", min: 250000 },
        ],
        conditions: brandNewOnly,
      };

    case "projectors":
      return {
        brands: [
          { name: "Epson", slug: "epson" },
          { name: "BenQ", slug: "benq" },
          { name: "ViewSonic", slug: "viewsonic" },
          { name: "Optoma", slug: "optoma" },
          { name: "Sony", slug: "sony" },
        ],
        budgetRanges: [
          { label: "Under ₦200,000", max: 200000 },
          { label: "₦200,000 – ₦450,000", min: 200000, max: 450000 },
          { label: "₦450,000 – ₦900,000", min: 450000, max: 900000 },
          { label: "₦900,000 & Above", min: 900000 },
        ],
        conditions: standardConditions,
      };

    case "routers":
      return {
        brands: [
          { name: "TP-Link", slug: "tp-link" },
          { name: "Cisco", slug: "cisco" },
          { name: "MikroTik", slug: "mikrotik" },
          { name: "D-Link", slug: "d-link" },
          { name: "Netgear", slug: "netgear" },
          { name: "Huawei", slug: "huawei" },
        ],
        budgetRanges: [
          { label: "Under ₦45,000", max: 45000 },
          { label: "₦45,000 – ₦95,000", min: 45000, max: 95000 },
          { label: "₦95,000 – ₦220,000", min: 95000, max: 220000 },
          { label: "₦220,000 & Above", min: 220000 },
        ],
        conditions: brandNewTestedConditions,
      };

    case "access-points":
      return {
        brands: [
          { name: "Ubiquiti", slug: "ubiquiti" },
          { name: "TP-Link", slug: "tp-link" },
          { name: "Cisco", slug: "cisco" },
          { name: "MikroTik", slug: "mikrotik" },
          { name: "Ruijie", slug: "ruijie" },
        ],
        budgetRanges: [
          { label: "Under ₦60,000", max: 60000 },
          { label: "₦60,000 – ₦130,000", min: 60000, max: 130000 },
          { label: "₦130,000 – ₦280,000", min: 130000, max: 280000 },
          { label: "₦280,000 & Above", min: 280000 },
        ],
        conditions: brandNewTestedConditions,
      };

    case "network-cables":
      return {
        brands: [
          { name: "CommScope", slug: "commscope" },
          { name: "D-Link", slug: "d-link" },
          { name: "Schneider", slug: "schneider" },
          { name: "Siemon", slug: "siemon" },
          { name: "TP-Link", slug: "tp-link" },
        ],
        budgetRanges: [
          { label: "Under ₦10,000", max: 10000 },
          { label: "₦10,000 – ₦25,000", min: 10000, max: 25000 },
          { label: "₦25,000 – ₦60,000", min: 25000, max: 60000 },
          { label: "₦60,000 & Above", min: 60000 },
        ],
        conditions: brandNewOnly,
      };

    case "laptop-batteries":
      return {
        brands: [
          { name: "HP", slug: "hp" },
          { name: "Dell", slug: "dell" },
          { name: "Lenovo", slug: "lenovo" },
          { name: "Apple", slug: "apple" },
          { name: "ASUS", slug: "asus" },
          { name: "Toshiba", slug: "toshiba" },
        ],
        budgetRanges: [
          { label: "Under ₦25,000", max: 25000 },
          { label: "₦25,000 – ₦45,000", min: 25000, max: 45000 },
          { label: "₦45,000 – ₦75,000", min: 45000, max: 75000 },
          { label: "₦75,000 & Above", min: 75000 },
        ],
        conditions: brandNewOnly,
      };

    case "ups":
      return {
        brands: [
          { name: "APC", slug: "apc" },
          { name: "Mercury", slug: "mercury" },
          { name: "Blue Gate", slug: "blue-gate" },
          { name: "Eaton", slug: "eaton" },
          { name: "CyberPower", slug: "cyberpower" },
        ],
        budgetRanges: [
          { label: "Under ₦100,000", max: 100000 },
          { label: "₦100,000 – ₦250,000", min: 100000, max: 250000 },
          { label: "₦250,000 – ₦600,000", min: 250000, max: 600000 },
          { label: "₦600,000 & Above", min: 600000 },
        ],
        conditions: brandNewTestedConditions,
      };

    case "pos-systems":
      return {
        brands: [
          { name: "Sunmi", slug: "sunmi" },
          { name: "Posiflex", slug: "posiflex" },
          { name: "Zebra", slug: "zebra" },
          { name: "Epson", slug: "epson" },
          { name: "Honeywell", slug: "honeywell" },
          { name: "Xprinter", slug: "xprinter" },
        ],
        budgetRanges: [
          { label: "Under ₦120,000", max: 120000 },
          { label: "₦120,000 – ₦300,000", min: 120000, max: 300000 },
          { label: "₦300,000 – ₦750,000", min: 300000, max: 750000 },
          { label: "₦750,000 & Above", min: 750000 },
        ],
        conditions: standardConditions,
      };

    case "other-accessories":
    default:
      return {
        brands: [
          { name: "Logitech", slug: "logitech" },
          { name: "Anker", slug: "anker" },
          { name: "Samsung", slug: "samsung" },
          { name: "Apple", slug: "apple" },
          { name: "HP", slug: "hp" },
          { name: "Dell", slug: "dell" },
          { name: "Lenovo", slug: "lenovo" },
          { name: "APC", slug: "apc" },
          { name: "ASUS", slug: "asus" },
          { name: "Canon", slug: "canon" },
        ],
        budgetRanges: [
          { label: "Under ₦50,000", max: 50000 },
          { label: "₦50,000 – ₦250,000", min: 50000, max: 250000 },
          { label: "₦250,000 – ₦750,000", min: 250000, max: 750000 },
          { label: "₦750,000 & Above", min: 750000 },
        ],
        conditions: standardConditions,
      };
  }
}
