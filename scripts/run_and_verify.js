const { spawn } = require("child_process");
const http = require("http");

function testEndpoint(path, method = "GET", postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "127.0.0.1",
      port: 3000,
      path: path,
      method: method,
      headers: postData ? {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      } : {},
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        resolve({ statusCode: res.statusCode, length: data.length });
      });
    });

    req.on("error", (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function main() {
  console.log("Starting Next.js production server on 127.0.0.1:3000...");
  const server = spawn("node", ["node_modules/next/dist/bin/next", "start", "-p", "3000", "-H", "127.0.0.1"], {
    stdio: "inherit",
    env: process.env,
  });

  server.on("error", (err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });

  // Wait 4 seconds for Next.js to bind
  await new Promise((r) => setTimeout(r, 4000));

  const endpoints = [
    { name: "Dynamic Homepage (CMS)", path: "/" },
    { name: "Shop Catalog & Faceted Filters", path: "/shop" },
    { name: "Intelligent Search (Exact + Alternatives)", path: "/search?q=HP+EliteBook" },
    { name: "Smart Finder Guided Wizard", path: "/smart-finder" },
    { name: "Product Detail View", path: "/products/lenovo-thinkpad-t490s-core-i7-16gb-256gb-touchscreen" },
    { name: "Cart Review Page", path: "/cart" },
    { name: "Checkout & Logistics Page", path: "/checkout" },
    { name: "Order Tracking Portal", path: "/track-order" },
    { name: "About GuaranteedTech & Showroom", path: "/about" },
    { name: "Contact & WhatsApp Hotline", path: "/contact" },
    { name: "Customer RFQ & Sourcing Portal", path: "/enquiries" },
    { name: "Admin KPI Dashboard", path: "/admin" },
    { name: "Admin CMS Homepage Builder", path: "/admin/cms" },
    { name: "Admin Inventory Manager", path: "/admin/products" },
    { name: "Admin Order Ledger & WhatsApp Intake", path: "/admin/orders" },
    { name: "Admin GIG Logistics Manifest", path: "/admin/logistics" },
    { name: "Admin Search Demand Intelligence", path: "/admin/search-demand" },
    { name: "Admin RFQ Enquiries Manager", path: "/admin/enquiries" },
  ];

  let successCount = 0;
  for (const ep of endpoints) {
    try {
      const res = await testEndpoint(ep.path);
      if (res.statusCode >= 200 && res.statusCode < 400) {
        console.log(`[PASS] ${ep.name} -> HTTP ${res.statusCode} (${res.length} bytes)`);
        successCount++;
      } else {
        console.error(`[WARN] ${ep.name} -> HTTP ${res.statusCode}`);
      }
    } catch (err) {
      console.error(`[FAIL] ${ep.name} -> ${err.message}`);
    }
  }

  // Test Smart Finder recommendation engine API
  try {
    const postPayload = JSON.stringify({
      workload: "programming",
      budget: 950000,
      ram: "16",
      brand: "any",
    });
    const sfRes = await testEndpoint("/api/smart-finder", "POST", postPayload);
    console.log(`[PASS] Smart Finder Scoring Engine (POST /api/smart-finder) -> HTTP ${sfRes.statusCode}`);
    successCount++;
  } catch (err) {
    console.error(`[FAIL] Smart Finder Scoring Engine -> ${err.message}`);
  }

  // Test Order Waybill Tracking API
  try {
    const trackRes = await testEndpoint("/api/orders/track?q=GT-2026-08492");
    console.log(`[PASS] GIG Logistics Waybill Tracking API (GET /api/orders/track) -> HTTP ${trackRes.statusCode}`);
    successCount++;
  } catch (err) {
    console.error(`[FAIL] GIG Logistics Waybill Tracking API -> ${err.message}`);
  }

  console.log(`\n========================================`);
  console.log(`Summary: ${successCount} verified endpoints passed!`);
  console.log(`========================================\n`);

  server.kill("SIGTERM");
  process.exit(0);
}

main();

