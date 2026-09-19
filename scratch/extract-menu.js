const fs = require('fs');

async function extractMenu() {
  const res = await fetch('https://www.simplemaplab.com/_next/static/chunks/0dy6xxdrta9ql.js?dpl=dpl_ABR3UBKH1sQZexXTwprAzbbchbFj');
  const text = await res.text();
  
  const idx = text.indexOf('What County Am I In?');
  const start = text.lastIndexOf('let o=[{label:"Location"', idx);
  // print from start to 8000 chars
  console.log('Full menu definition:');
  console.log(text.slice(start, start + 7000));
}
extractMenu();
