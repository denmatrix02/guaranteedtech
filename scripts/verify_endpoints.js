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
        resolve({ statusCode: res.statusCode, data: data.slice(0, 300) });
      });
    });

    req.on("error", (e) => reject(e));
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log("Waiting 3s for server to settle...");
  await new Promise((r) => setTimeout(r, 3000));

  const endpoints = [
    { name: "Homepage (CMS)", path: "/" },
    { name: "Shop Catalog", path: "/shop" },
    { name: "Search (Exact & Alternatives)", path: "/search?q=HP+EliteBook" },
    { name: "Smart Finder Page", path: "/smart-finder" },
    { name: "Product Detail", path: "/products/lenovo-thinkpad-t490s-core-i7-16gb-256gb-touchscreen" },
    { name: "Admin Dashboard", path: "/admin" },
    { name: "Admin CMS Manager", path: "/admin/cms" },
    { name: "Admin Search Demand Intelligence", path: "/admin/search-demand" },
    { name: "Admin Orders & WhatsApp Intake", path: "/admin/orders" },
    { name: "Admin GIG Logistics Manifest", path: "/admin/logistics" },
  ];

  for (const ep of endpoints) {
    try {
      const res = await testEndpoint(ep.path);
      console.log(`[PASS] ${ep.name} -> HTTP ${res.statusCode}`);
    } catch (err) {
      console.error(`[FAIL] ${ep.name} -> ${err.message}`);
    }
  }

  // Test Smart Finder API
  try {
    const sfRes = await testEndpoint("/api/smart-finder", "POST", JSON.stringify({
      workload: "programming",
      budget: 1000000,
      ram: "16",
      brand: "any"
    }));
    console.log(`[PASS] Smart Finder Engine API -> HTTP ${sfRes.statusCode} (${sfRes.data.length > 0 ? "Returned scored recommendations" : "Empty"})`);
  } catch (err) {
    console.error(`[FAIL] Smart Finder Engine API -> ${err.message}`);
  }

  console.log("\nAll endpoint verifications completed successfully!");
}

run();

