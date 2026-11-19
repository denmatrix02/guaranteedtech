const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const target = process.argv[2] ? process.argv[2].toLowerCase() : "postgresql";
const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");

let schema = fs.readFileSync(schemaPath, "utf8");

const postgresDatasource = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

const sqliteDatasource = `datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}`;

if (target === "postgresql" || target === "supabase") {
  schema = schema.replace(/datasource db \{[\s\S]*?\}/, postgresDatasource);
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log("Successfully switched Prisma schema to PostgreSQL (Supabase).");
  console.log("Next steps:");
  console.log("1. Ensure your .env has DATABASE_URL (pooler) and DIRECT_URL (direct port 5432).");
  console.log("2. Run: npx prisma db push (to create tables on Supabase)");
  console.log("3. Run: npm run prisma:seed (to seed categories and products into Supabase)");
} else if (target === "sqlite") {
  schema = schema.replace(/datasource db \{[\s\S]*?\}/, sqliteDatasource);
  fs.writeFileSync(schemaPath, schema, "utf8");
  console.log("Successfully switched Prisma schema to SQLite (Local dev).");
} else {
  console.error("Unknown target. Use 'postgresql' or 'sqlite'.");
  process.exit(1);
}

try {
  console.log("Regenerating Prisma client...");
  execSync("npx prisma generate", { stdio: "inherit" });
  console.log("Prisma client regenerated successfully.");
} catch (e) {
  console.error("Failed to generate Prisma client:", e.message);
}
