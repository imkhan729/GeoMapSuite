const fs = require('fs');
const http = require('http');

const homeContent = fs.readFileSync('src/app/page.tsx', 'utf8');
const regex = /href=['"]([^'"]+)['"]/g;
const links = new Set();
let m;
while ((m = regex.exec(homeContent)) !== null) {
  if (m[1].startsWith('/') && !m[1].startsWith('//')) links.add(m[1]);
}

console.log('Homepage internal links count:', links.size);
console.log(Array.from(links));

async function check(url) {
  return new Promise((resolve) => {
    http.get('http://localhost:3000' + url, (res) => {
      res.resume();
      resolve({ url, status: res.statusCode });
    }).on('error', (err) => resolve({ url, status: 'ERR', error: err.message }));
  });
}

async function run() {
  const broken = [];
  for (const l of links) {
    const r = await check(l);
    if (r.status !== 200 && r.status !== 307 && r.status !== 308) {
      broken.push(r);
      console.log(`❌ [${r.status}] ${r.url}`);
    } else {
      console.log(`✓ [${r.status}] ${r.url}`);
    }
  }
  console.log('Broken count:', broken.length);
  if (broken.length > 0) {
    console.log('Broken links:', broken);
  }
}

run();
