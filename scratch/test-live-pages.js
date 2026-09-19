const fs = require('fs');

async function testPages() {
  const testUrls = [
    'https://www.simplemaplab.com/tools/embed-map',
    'https://www.simplemaplab.com/tools/country-size-comparison',
    'https://www.simplemaplab.com/tools/color-a-map',
    'https://www.simplemaplab.com/tools/find-nearest-national-park',
    'https://www.simplemaplab.com/tools/distance-matrix-calculator',
    'https://www.simplemaplab.com/tools/horizon-distance-calculator',
    'https://www.simplemaplab.com/tools/map-tunnel',
    'https://www.simplemaplab.com/tools/equator'
  ];

  for (const url of testUrls) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] || 'no title';
      console.log(`${url} -> ${res.status}: ${title}`);
    } catch (e) {
      console.log(`${url} error: ${e.message}`);
    }
  }
}
testPages();
