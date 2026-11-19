# GuaranteedTech — Production E-Commerce Platform & Admin Portal

A complete, production-ready e-commerce ecosystem built for **GuaranteedTech**, a Nigerian enterprise computer, electronics, and accessories retail brand based in Computer Village, Ikeja, Lagos.

---

## 🚀 Key Platform Features

1. **Clean Premium Storefront (UI Spec Match):**
   - Developed strictly following UI design directions (`01 Home.jpg`, `02 Shop.jpg`, `04_Product-Page.jpg`).
   - Clean white palette with subtle slate sections (`#F8F9FA`), gold/amber primary accents (`#FFB200`), professional typography, and crisp product cards.
   - All prices rendered in Nigerian Naira (`₦`) using formatted currency helpers.
   - Nationwide GIG Logistics delivery badges, 6-Month GTC Certified Warranty, and physical Ikeja showroom trust signals.

2. **Intelligent Alternative Search Engine:**
   - Multi-tier fallback hierarchy preventing search dead-ends. When an exact model is out of stock (e.g. *HP EliteBook 840 G8*), the engine automatically scores and recommends comparable alternatives across series, processor generation, RAM, and price bracket.
   - Explanatory recommendation badges detailing *why* an alternative matches the customer's intent.
   - Zero-result searches automatically feed the **Search Demand Intelligence** database so inventory managers know exactly what to restock.
   - Custom Hardware Sourcing Request modal and direct WhatsApp hotline inquiry.

3. **Interactive Smart Finder:**
   - 4-step guided recommendation wizard for customers unsure about system specifications.
   - Filters by primary workload (Programming, Graphic Design, Engineering/CAD, Video Editing, Business/Office, Gaming), budget in ₦, RAM, and brand preference.
   - Real-time scoring engine (`/api/smart-finder`) with trade-off rationales.

4. **Product Detail & Dynamic Variants:**
   - Interactive variant selector for SSD and RAM configurations with real-time price updates.
   - Technical specifications matrix table.
   - Customer review submission and verified rating display.
   - Frequently Bought Together accessory cross-sells.
   - One-click WhatsApp product inquiry prefilling the model name, SKU, and price.

5. **Local Logistics & Checkout:**
   - State-by-state GIG Logistics delivery fee calculator for all 36 Nigerian states and the FCT.
   - Server-side stock reservation and price verification (`/api/checkout`).
   - Gateway adapters for Paystack, Flutterwave, Direct Corporate Bank Transfer (Zenith Bank), and Cash on Delivery.

6. **Comprehensive Admin Portal (`/admin`):**
   - **Executive Dashboard:** Live KPIs for Gross Revenue (₦), Total Orders, Active SKUs, and Low Stock alerts.
   - **Product Manager (`/admin/products`):** Full CRUD for products, technical specifications, variants, and stock management.
   - **Dynamic CMS Builder (`/admin/cms`):** Reorder homepage sections, toggle visibility, upload hero banners, edit campaign titles and CTA buttons.
   - **Order Processing (`/admin/orders`):** Order status workflow + dedicated **Manual WhatsApp Order Intake Modal** that generates GIG waybills for offline customer chats.
   - **Logistics Manifest (`/admin/logistics`):** GIG Logistics tracking table with status updates, delivery stations, and COD settlement.
   - **Search Demand Intelligence (`/admin/search-demand`):** Unmet search queries log helping procurement discover customer demand.
   - **Corporate RFQ Manager (`/admin/enquiries`):** Sourcing inquiries with direct WhatsApp reply buttons.

---

## 🛠️ Technology Stack

- **Framework:** Next.js 15.5 (App Router, Server Components & Route Handlers)
- **Language:** TypeScript 5.7 (Strict Type Checking)
- **Styling:** Tailwind CSS 3.4 & Lucide React Icons
- **Database ORM:** Prisma 6.19 with SQLite (`dev.db`)
- **Authentication:** Role-Based Access Control (`SUPER_ADMIN`, `STORE_MANAGER`, `CUSTOMER`) with bcrypt and JWT
- **Logistics Integration:** GIG Logistics API tracking & waybill manifest adapter
- **State Management:** React Context (`CartContext` with localStorage persistence)

---

## 🔐 Default Credentials

| Portal | Role | Email | Password |
| :--- | :--- | :--- | :--- |
| `/admin` | Super Admin | `admin@guaranteedtech.ng` | `Admin@GT2026!` |
| `/admin` | Store Manager | `manager@guaranteedtech.ng` | `Manager@GT2026!` |
| `/account` | Customer | `customer@guaranteedtech.ng` | `Customer@GT2026!` |

---

## 🚦 Getting Started

### 1. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Production Build & Server
```bash
npm run build
npm run start
```

### 3. Database Management & Seeding
```bash
# Push schema changes
npx prisma db push

# Seed products, CMS sections, brands, categories, reviews, and search demand logs
node scripts/seed.js

# Seed sample Nigerian orders and GIG shipments
node scripts/seed_orders.js
```

### 4. Automated Verification Suite
Run the automated end-to-end endpoint verification suite:
```bash
node scripts/run_and_verify.js
node scripts/test_search_http.js
```

---

## 📍 Commercial Centers & Contact

- **Company:** GuaranteedTech Enterprise Systems & Retail
- **Branch 1 (Flagship Retail & Experience Showroom):** 111/113 Azikiwe Road, Aba, Abia State, Nigeria
- **Branch 2 (Executive Showroom & Enterprise Hub):** No. 2 Asa Road (Beside Aba Town Hall), Aba, Abia State, Nigeria
- **WhatsApp Support:** [+234 806 715 0130](https://wa.me/2348067150130)
- **Official Email:** [guarateedtech17@gmail.com](mailto:guarateedtech17@gmail.com)

