async function test() {
  const cases = [
    { email: "admin@guaranteedtech.org", password: "Admin@GT2026!" },
    { email: "admin@guaranteedtech.org ", password: "admin@gt2026! " },
    { email: "ADMIN@GUARANTEEDTECH.ORG", password: "Admin@GT2026!" },
    { email: "guaranteedtech17@gmail.com", password: "admin@gt2026!" },
    { email: "admin", password: "Admin@GT2026" }
  ];

  for (const c of cases) {
    const res = await fetch("https://www.guaranteedtech.org/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(c)
    });
    const data = await res.json();
    console.log(`[${c.email}] / [${c.password}] => success: ${data.success}, user: ${data.user?.name} (${data.user?.email})`);
  }
}

test();
