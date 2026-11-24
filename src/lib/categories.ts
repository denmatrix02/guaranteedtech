import prisma from "@/lib/prisma";

export interface CategoryMetadata {
  canonicalSlug: string;
  name: string;
  description: string;
  relatedSlugs: string[];
}

/**
 * Robust category alias dictionary mapping user inputs, legacy URLs,
 * and UI variations to exact database categories.
 */
export const CATEGORY_ALIAS_MAP: Record<string, string> = {
  // Printers & Supplies
  "printers": "printers-supplies",
  "printer": "printers-supplies",
  "printers-supplies": "printers-supplies",
  "printing-supplies": "printers-supplies",
  "inks-toner": "printers-supplies",
  "ink-toner": "printers-supplies",
  "toner": "printers-supplies",

  // Monitors & Displays (including Projectors)
  "projectors": "monitors-displays",
  "projector": "monitors-displays",
  "monitors": "monitors-displays",
  "monitor": "monitors-displays",
  "displays": "monitors-displays",
  "monitors-displays": "monitors-displays",
  "screens": "monitors-displays",

  // Desktop Computers
  "desktops": "desktop-computers",
  "desktop": "desktop-computers",
  "desktop-computers": "desktop-computers",
  "workstations": "desktop-computers",
  "towers": "desktop-computers",
  "all-in-one": "desktop-computers",

  // Laptops (includes business & gaming laptops)
  "laptops": "laptops",
  "laptop": "laptops",
  "notebooks": "laptops",
  "business-laptops": "business-laptops",
  "business-laptop": "business-laptops",
  "gaming-laptops": "gaming-laptops",
  "gaming-laptop": "gaming-laptops",

  // Computer Accessories & Equipment
  "equipment": "computer-accessories",
  "accessories": "computer-accessories",
  "computer-accessories": "computer-accessories",
  "networking": "computer-accessories",
  "networking-equipment": "computer-accessories",
  "peripherals": "computer-accessories",

  // UPS & Power Solutions
  "ups": "ups-power-solutions",
  "power": "ups-power-solutions",
  "ups-power-solutions": "ups-power-solutions",
  "inverters": "ups-power-solutions",
  "surge-protectors": "ups-power-solutions",

  // Storage & Components
  "storage": "storage-components",
  "storage-components": "storage-components",
  "ssd": "storage-components",
  "ssds": "storage-components",
  "ram": "storage-components",
  "hard-drives": "storage-components",
};

/**
 * Canonical Category Information Registry
 */
export const CANONICAL_CATEGORIES: Record<string, { name: string; description: string }> = {
  "printers-supplies": {
    name: "Printers & Supplies",
    description: "Certified enterprise LaserJet printers, high-capacity MegaTank multifunction inkjets, and authentic toner cartridges.",
  },
  "monitors-displays": {
    name: "Monitors, Projectors & Displays",
    description: "High-resolution 4K designer monitors, business presentation projectors, and ergonomic display solutions.",
  },
  "desktop-computers": {
    name: "Desktop Workstations & Computers",
    description: "Enterprise tower workstations, micro form factor PCs, and high-performance CAD/engineering desktop systems.",
  },
  "laptops": {
    name: "Laptops & Ultrabooks",
    description: "Certified business laptops, executive ultrabooks, and high-performance gaming laptops with comprehensive warranty.",
  },
  "business-laptops": {
    name: "Business Laptops",
    description: "Enterprise-grade Lenovo ThinkPad, HP EliteBook, and Dell Latitude workhorses built for extreme daily reliability.",
  },
  "gaming-laptops": {
    name: "Gaming Laptops",
    description: "High-refresh-rate RTX graphics systems engineered for intense 3D rendering, machine learning, and AAA gaming.",
  },
  "computer-accessories": {
    name: "Computer Accessories & Equipment",
    description: "High-grade mechanical peripherals, Logitech MX productivity mice, multi-port USB-C hubs, and enterprise networking hardware.",
  },
  "ups-power-solutions": {
    name: "UPS & Clean Power Solutions",
    description: "Pure sine wave uninterruptible power supply systems and voltage protectors safeguarding critical infrastructure.",
  },
  "storage-components": {
    name: "Storage & Core Components",
    description: "Gen4 NVMe M.2 high-speed solid state drives, high-frequency DDR4/DDR5 memory modules, and internal components.",
  },
};

/**
 * Normalizes any category slug, alias, or search token into its canonical database slug.
 */
export function normalizeCategorySlug(rawSlug?: string | null): string | null {
  if (!rawSlug) return null;
  const cleaned = rawSlug.trim().toLowerCase();
  return CATEGORY_ALIAS_MAP[cleaned] || cleaned;
}

/**
 * Retrieves human-readable category name and description
 */
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
