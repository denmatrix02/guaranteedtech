require("dotenv").config();
const { Client } = require("pg");

async function testConnection(name, connectionString) {
  const client = new Client({ connectionString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log(`[${name}] SUCCESS:`, res.rows[0]);
    await client.end();
    return true;
  } catch (err) {
    console.log(`[${name}] FAILED:`, err.message);
    try { await client.end(); } catch {}
    return false;
  }
}

async function main() {
  const p6543 = process.env.DATABASE_URL;
  const p5432 = process.env.DATABASE_URL.replace(":6543", ":5432").replace("?pgbouncer=true", "");
  const directDb = "postgresql://postgres.etprvyyrsgxdsikghfhk:Victor2022**1999@db.etprvyyrsgxdsikghfhk.supabase.co:5432/postgres";

  console.log("Testing connections...");
  await testConnection("Pooler 6543", p6543);
  await testConnection("Pooler 5432", p5432);
  await testConnection("Direct DB 5432", directDb);
}

main();
