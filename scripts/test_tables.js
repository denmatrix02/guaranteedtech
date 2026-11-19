const { PrismaClient } = require("@prisma/client");

async function run() {
  const prisma = new PrismaClient();
  try {
    const res = await prisma.$queryRawUnsafe(`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_type = 'BASE TABLE' AND table_schema NOT IN ('pg_catalog', 'information_schema')
    `);
    console.log("Current user tables in DB:", res);
  } catch (e) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
