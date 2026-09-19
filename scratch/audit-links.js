const fs = require('fs');
const http = require('http');

// Extract links from navigation.ts
const navContent = fs.readFileSync('src/data/navigation.ts', 'utf8');
const hrefRegex = /href:\s*['"]([^'"]+)['"]/g;
const navLinks = [];
let match;
while ((match = hrefRegex.exec(navContent)) !== null) {
  navLinks.push(match[1]);
}

// Extract links from Footer.tsx
const footerContent = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
const footerRegex = /href=['"]([^'"]+)['"]/g;
const footerLinks = [];
while ((match = footerRegex.exec(footerContent)) !== null) {
  footerLinks.push(match[1]);
}

// Extract links from Header.tsx
const headerContent = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');
const headerRegex = /href=['"]([^'"]+)['"]/g;
const headerLinks = [];
while ((match = headerRegex.exec(headerContent)) !== null) {
  headerLinks.push(match[1]);
}

const allLinks = Array.from(new Set([...navLinks, ...footerLinks, ...headerLinks]));

async function check(url) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + url, (res) => {
      res.resume();
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => resolve({ url, status: 'ERR', error: err.message }));
  });
}

async function run() {
  console.log(`Auditing ${allLinks.length} unique navigation links against http://localhost:3000 ...\n`);
  const broken = [];
  const ok = [];

  for (const l of allLinks) {
    if (l.startsWith('http')) continue;
    const r = await check(l);
    if (r.status !== 200 && r.status !== 307 && r.status !== 308) {
      broken.push(r);
      console.log(`❌ [${r.status}] ${r.url}`);
    } else {
      ok.push(r);
      console.log(`✓ [${r.status}] ${r.url}`);
    }
  }

  console.log(`\n================================`);
  console.log(`Audit Summary:`);
  console.log(`Total checked: ${allLinks.length}`);
  console.log(`Working (200/307/308): ${ok.length}`);
  console.log(`Broken (404/ERR): ${broken.length}`);
  if (broken.length > 0) {
    console.log(`Broken links list:`);
    broken.forEach(b => console.log(` - [${b.status}] ${b.url}`));
  }
  console.log(`================================\n`);
}

run();
