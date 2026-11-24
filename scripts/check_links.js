const fs = require('fs');
const path = require('path');

function scanDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanDir(full, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(full);
    }
  }
  return fileList;
}

const files = scanDir('./src');
const links = new Set();
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  const matches = content.matchAll(/href=["'](\/[^"'#?]*)["'#?]/g);
  for (const m of matches) {
    links.add(m[1]);
  }
}

console.log('Found internal routes:');
for (const link of Array.from(links).sort()) {
  console.log(link);
}
