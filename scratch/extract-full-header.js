const fs = require('fs');

async function extractFullHeader() {
  const res = await fetch('https://www.simplemaplab.com/_next/static/chunks/0dy6xxdrta9ql.js?dpl=dpl_ABR3UBKH1sQZexXTwprAzbbchbFj');
  const text = await res.text();
  
  const idx = text.indexOf('let o=[{label:"Location"');
  console.log(text.slice(idx, idx + 14000));
}
extractFullHeader();
