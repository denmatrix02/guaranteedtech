const { Client } = require("pg");

async function test(url, name) {
  console.log(`Testing ${name}...`);
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    const res = await client.query("SELECT 1 as result");
    console.log(`SUCCESS for ${name}:`, res.rows[0]);
    await client.end();
  } catch (err) {
    console.error(`FAILED for ${name}:`, err.message);
  }
}

async function run() {
  const p1 = "postgresql://postgres.etprvyyrsgxdsikghfhk:Victor2022**1999@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";
  const p2 = "postgresql://postgres.etprvyyrsgxdsikghfhk:Victor2022%2A%2A1999@aws-1-eu-west-1.pooler.supabase.com:6543/postgres";
  const p3 = "postgresql://postgres.etprvyyrsgxdsikghfhk:Victor2022**1999@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
  const p4 = "postgresql://postgres.etprvyyrsgxdsikghfhk:Victor2022%2A%2A1999@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";
  
  await test(p1, "p1 (6543 plain)");
  await test(p2, "p2 (6543 encoded)");
  await test(p3, "p3 (5432 plain)");
  await test(p4, "p4 (5432 encoded)");
}

run();
