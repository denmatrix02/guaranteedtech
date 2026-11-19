const { PrismaClient } = require("@prisma/client");
const { execSync } = require("child_process");

async function main() {
  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf8" }
  );

  const prisma = new PrismaClient();

  const statements = sql
    .split(";")
    .map((s) => s.replace(/--[^\n]*/g, "").trim())
    .filter((s) => s.length > 0);

  console.log(`Found ${statements.length} SQL statements to execute.`);

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    try {
      await prisma.$executeRawUnsafe(stmt);
      const firstLine = stmt.replace(/\s+/g, " ").substring(0, 50);
      console.log(`[${i + 1}/${statements.length}] OK: ${firstLine}`);
    } catch (err) {
      console.error(`[${i + 1}/${statements.length}] ERROR: ${err.message}`);
    }
  }

  const tables = await prisma.$queryRawUnsafe(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log("\nALL TABLES IN PUBLIC SCHEMA ON SUPABASE:");
  console.table(tables);

  await prisma.$disconnect();
}

main();
