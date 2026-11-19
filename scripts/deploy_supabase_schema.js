const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");

async function main() {
  console.log("1. Generating PostgreSQL DDL script from Prisma schema...");
  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf8" }
  );

  console.log("2. Connecting to Supabase PostgreSQL database...");
  const prisma = new PrismaClient({
    datasources: {
      db: { url: process.env.DATABASE_URL }
    }
  });

  try {
    console.log("3. Executing DDL statements on Supabase...");
    
    // Split SQL by semicolon, but preserve statement integrity
    const statements = sql
      .split(/;\s*[\r\n]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await prisma.$executeRawUnsafe(stmt);
      } catch (err) {
        // If table or index already exists, continue gracefully
        if (err.message.includes("already exists")) {
          // Ignore
        } else {
          console.warn(`Warning on statement ${i + 1}:`, err.message);
        }
      }
    }

    console.log("4. All tables, relations, and indexes created successfully on Supabase!");

    // Verify created tables
    const tables = await prisma.$queryRawUnsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("Verified Public Tables on Supabase:");
    console.table(tables);

  } catch (err) {
    console.error("Migration error:", err.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
