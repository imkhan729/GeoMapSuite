const fs = require('fs');

async function extractFullHeaderToFile() {
  const res = await fetch('https://www.simplemaplab.com/_next/static/chunks/0dy6xxdrta9ql.js?dpl=dpl_ABR3UBKH1sQZexXTwprAzbbchbFj');
  const text = await res.text();
  
  const idx = text.indexOf('let o=[{label:"Location"');
  fs.writeFileSync('c:/Users/Roy/Downloads/maplab/scratch/live-header-extracted.js', text.slice(idx, idx + 20000));
  console.log('Saved to live-header-extracted.js');
}
extractFullHeaderToFile();
