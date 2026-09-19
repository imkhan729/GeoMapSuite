const fs = require('fs');

const nav = fs.readFileSync('src/data/navigation.ts', 'utf8');
const footer = fs.readFileSync('src/components/layout/Footer.tsx', 'utf8');
const header = fs.readFileSync('src/components/layout/Header.tsx', 'utf8');

const regex = /href=['"]([^'"]+)['"]/g;
const links = new Set();
let m;
while ((m = regex.exec(nav + '\n' + footer + '\n' + header)) !== null) {
  if (m[1].startsWith('/') && !m[1].startsWith('//')) links.add(m[1]);
}

const log = fs.readFileSync('C:/Users/Roy/.gemini/antigravity/brain/d1ea422c-3f70-498a-ade8-e30a80b5399e/.system_generated/tasks/task-746.log', 'utf8');
const tested = new Set();
for (const line of log.split('\n')) {
  const match = line.match(/(?:✓|❌)\s+\[\d+\]\s+(\S+)/);
  if (match) tested.add(match[1]);
}

const untested = Array.from(links).filter(l => !tested.has(l));
console.log('Total links:', links.size);
console.log('Tested in task-746:', tested.size);
console.log('Untested:', JSON.stringify(untested, null, 2));
