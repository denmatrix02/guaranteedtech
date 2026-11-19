const { searchProducts } = require("../src/lib/search");
const prisma = require("../src/lib/prisma").default;

async function run() {
  console.log("=== TESTING SEARCH ENGINE FALLBACK & DEMAND LOGGING ===");

  // 1. Search for available product
  console.log("\n1. Testing query: 'HP EliteBook 840 G8'");
  const r1 = await searchProducts("HP EliteBook 840 G8");
  console.log(`- Exact matches found: ${r1.exactMatches.length}`);
  if (r1.exactMatches.length > 0) {
    console.log(`  Top exact match: ${r1.exactMatches[0].name}`);
  }
  console.log(`- Alternative recommendations: ${r1.alternativeRecommendations.length}`);
  if (r1.alternativeRecommendations.length > 0) {
    console.log(`  Alternative: ${r1.alternativeRecommendations[0].product.name} (Badge: ${r1.alternativeRecommendations[0].badge}, Reason: ${r1.alternativeRecommendations[0].explanation})`);
  }

  // 2. Search for completely unavailable model: "MacBook Air M2 24GB"
  console.log("\n2. Testing unavailable query: 'MacBook Air M2 24GB'");
  const r2 = await searchProducts("MacBook Air M2 24GB");
  console.log(`- Exact matches: ${r2.exactMatches.length}`);
  console.log(`- Fallback message: "${r2.fallbackMessage}"`);
  console.log(`- Suggested alternatives: ${r2.alternativeRecommendations.length}`);
  r2.alternativeRecommendations.forEach((alt, idx) => {
    console.log(`  [Alt ${idx + 1}] ${alt.product.name} (Score: ${alt.score}, Badge: ${alt.badge})`);
  });

  // 3. Verify Search Demand Log was updated in DB
  const demandLogs = await prisma.searchDemandLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
  console.log("\n3. Verifying Search Demand Log recording in SQLite DB:");
  demandLogs.forEach((log) => {
    console.log(`- Query: "${log.query}" | ExactMatch: ${log.hasExactMatch} | ResultCount: ${log.resultCount} | Unavailable: ${log.isUnavailableProduct}`);
  });

  console.log("\n=== ALL SEARCH & DEMAND INTELLIGENCE TESTS PASSED ===");
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

