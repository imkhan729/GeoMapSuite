const fs = require('fs');
const http = require('http');

// Extract links from navigation.ts
const navContent = fs.readFileSync('src/data/navigation.ts', 'utf8');
const navRegex = /href:\s*['"]([^'"]+)['"]/g;
const linksSet = new Set();
let match;
while ((match = navRegex.exec(navContent)) !== null) {
  if (match[1].startsWith('/') && !match[1].startsWith('//')) linksSet.add(match[1]);
}

// Extract links from Footer.tsx
const footerContent = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
const footerRegex = /href=['"]([^'"]+)['"]/g;
while ((match = footerRegex.exec(footerContent)) !== null) {
  if (match[1].startsWith('/') && !match[1].startsWith('//')) linksSet.add(match[1]);
}

// Extract links from Header.tsx
const headerContent = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');
const headerRegex = /href=['"]([^'"]+)['"]/g;
while ((match = headerRegex.exec(headerContent)) !== null) {
  if (match[1].startsWith('/') && !match[1].startsWith('//')) linksSet.add(match[1]);
}

const allLinks = Array.from(linksSet);

async function checkUrl(url) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + url, (res) => {
      res.resume();
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => {
      resolve({ url, status: 'ERR', error: err.message });
    });
  });
}

async function runPool(links, concurrency = 6) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < links.length) {
      const current = links[index++];
      const res = await checkUrl(current);
      results.push(res);
      const icon = (res.status === 200 || res.status === 307 || res.status === 308) ? '✓' : '❌';
      console.log(`${icon} [${res.status}] ${res.url}`);
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`Starting comprehensive audit of ${allLinks.length} site links against http://localhost:3000 ...\n`);
  const results = await runPool(allLinks, 6);

  const broken = results.filter(r => r.status !== 200 && r.status !== 307 && r.status !== 308);
  const ok = results.filter(r => r.status === 200 || r.status === 307 || r.status === 308);

  console.log('\n========================================');
  console.log('FINAL SITE AUDIT SUMMARY:');
  console.log(`Total URLs Audited: ${results.length}`);
  console.log(`Working (200/307/308): ${ok.length}`);
  console.log(`Broken (404/ERR): ${broken.length}`);
  if (broken.length > 0) {
    console.log('\nBroken URLs list:');
    broken.forEach(b => console.log(` - [${b.status}] ${b.url}`));
  } else {
    console.log('\n🎉 ZERO BROKEN LINKS! 100% of all site links are functional!');
  }
  console.log('========================================\n');
}

main();
