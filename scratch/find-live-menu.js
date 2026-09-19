const fs = require('fs');
const https = require('https');

const toolsHtmlPath = 'C:/Users/Roy/.gemini/antigravity/brain/d1ea422c-3f70-498a-ade8-e30a80b5399e/.system_generated/steps/3/content.md';
const content = fs.readFileSync(toolsHtmlPath, 'utf8');

const scripts = [...content.matchAll(/src="(\/_next\/static\/chunks\/[^"]+)"/g)].map(m => m[1]);

async function run() {
  for (const s of scripts) {
    try {
      const res = await fetch('https://www.simplemaplab.com' + s);
      const text = await res.text();
      if (text.includes('desktop-nav') || text.includes('what-county-am-i-in') || text.includes('Tools') && text.includes('dropdown')) {
        console.log('Script matches:', s);
        // Find occurrences of menu or dropdown
        const re = /(?:dropdown|menu|Tools)[\s\S]{0,200}(?:what-county|drive-time|distance|categories)/gi;
        const matches = text.match(re);
        if (matches) {
          console.log('Sample match:', matches.slice(0, 3));
        }
      }
    } catch (e) {
      console.error(e.message);
    }
  }
}
run();
