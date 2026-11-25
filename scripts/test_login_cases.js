const bcrypt = require("bcryptjs");

// Emulate route logic
function verifyLogin(email, password) {
  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  const isMasterAdminEmail =
    cleanEmail === "admin@guaranteedtech.ng" ||
    cleanEmail === "admin@guaranteedtech.org" ||
    cleanEmail === "guaranteedtech17@gmail.com" ||
    cleanEmail === "guarateedtech17@gmail.com" ||
    cleanEmail === "admin" ||
    cleanEmail === "executive@guaranteedtech.org" ||
    cleanEmail === "executive@guaranteedtech.ng" ||
    cleanEmail === "executive";

  const isMasterPassword =
    cleanPassword === "Admin@GT2026!" ||
    cleanPassword === "admin@gt2026!" ||
    cleanPassword === "Admin@gt2026!" ||
    cleanPassword === "admin@GT2026!" ||
    cleanPassword === "Admin@GT2026" ||
    cleanPassword === "admin@gt2026";

  return isMasterAdminEmail && isMasterPassword;
}

const testCases = [
  { email: "admin@guaranteedtech.org", pass: "Admin@GT2026!" },
  { email: "admin@guaranteedtech.ng", pass: "Admin@GT2026!" },
  { email: "ADMIN@GUARANTEEDTECH.ORG", pass: "Admin@GT2026! " },
  { email: "guaranteedtech17@gmail.com", pass: "admin@gt2026!" },
  { email: "admin", pass: "Admin@GT2026" },
  { email: "wrong@email.com", pass: "Admin@GT2026!" },
  { email: "admin@guaranteedtech.org", pass: "wrongpassword" }
];

testCases.forEach((t) => {
  console.log(`Test [${t.email}] / [${t.pass}] => ${verifyLogin(t.email, t.pass) ? "PASS" : "FAIL"}`);
});
