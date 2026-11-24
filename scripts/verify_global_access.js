async function testUrls() {
  const urls = [
    'http://guaranteedtech.org',
    'https://guaranteedtech.org',
    'http://www.guaranteedtech.org',
    'https://www.guaranteedtech.org',
    'https://www.guaranteedtech.org/shop',
    'https://www.guaranteedtech.org/about',
    'https://www.guaranteedtech.org/warranty',
    'https://www.guaranteedtech.org/track-order',
    'https://www.guaranteedtech.org/account',
    'https://www.guaranteedtech.org/admin'
  ];

  console.log("--- TESTING LIVE GLOBAL HTTP/HTTPS ACCESS ---");
  for (const url of urls) {
    try {
      const res = await fetch(url, { redirect: 'manual' });
      const loc = res.headers.get('location') || 'NONE';
      const server = res.headers.get('server') || 'unknown';
      console.log(`STATUS ${res.status}: ${url} -> Location: ${loc} (${server})`);
    } catch (err) {
      console.log(`ERROR ${url}: ${err.message}`);
    }
  }
}

testUrls();

async function checkHtmlAndHeaders() {
  console.log("\n--- CHECKING HEADERS & DEVICE TAGS ---");
  const res = await fetch('https://www.guaranteedtech.org');
  const headers = res.headers;
  console.log("content-type:", headers.get('content-type'));
  console.log("content-encoding:", headers.get('content-encoding'));
  console.log("x-vercel-cache:", headers.get('x-vercel-cache'));
  console.log("strict-transport-security:", headers.get('strict-transport-security'));

  const html = await res.text();
  console.log("Has viewport meta:", html.includes('viewport'));
  console.log("Has utf-8 charset:", html.includes('charset'));
  console.log("Has OpenGraph title:", html.includes('og:title'));
  console.log("Has og:image:", html.includes('og:image'));
  console.log("Has twitter:card:", html.includes('twitter:card'));
}

checkHtmlAndHeaders();
