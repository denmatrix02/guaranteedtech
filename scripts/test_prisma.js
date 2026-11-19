const { PrismaClient } = require("@prisma/client");

async function run() {
  const poolerUrl = "postgresql://postgres.etprvyyrsgxdsikghfhk:Victor2022**1999@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true";
  
  const prisma = new PrismaClient({
    datasources: { db: { url: poolerUrl } }
  });

  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS test_table (
        id text PRIMARY KEY,
        name text NOT NULL
      )
    `);
    console.log("TABLE CREATED ON SUPABASE SUCCESSFULLY!");
    
    await prisma.$executeRawUnsafe(`INSERT INTO test_table (id, name) VALUES ('1', 'GuaranteedTech Test') ON CONFLICT DO NOTHING`);
    const rows = await prisma.$queryRawUnsafe(`SELECT * FROM test_table`);
    console.log("INSERT & QUERY SUCCESSFUL:", rows);

    await prisma.$executeRawUnsafe(`DROP TABLE test_table`);
    console.log("CLEANUP SUCCESSFUL!");
  } catch (e) {
    console.error("Error executing DDL:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();
