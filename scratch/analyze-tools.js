const fs = require('fs');
const path = require('path');

// Read the fetched tools page
const toolsHtmlPath = 'C:/Users/Roy/.gemini/antigravity/brain/d1ea422c-3f70-498a-ade8-e30a80b5399e/.system_generated/steps/3/content.md';
const content = fs.readFileSync(toolsHtmlPath, 'utf8');

// Extract all tools from jsonld or html
const jsonLdMatch = content.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/g);
let liveTools = [];
for (const script of jsonLdMatch) {
  if (script.includes('ItemList')) {
    const jsonStr = script.replace(/<script[^>]*>|<\/script>/g, '');
    const data = JSON.parse(jsonStr);
    liveTools = data.mainEntity.itemListElement.map(item => ({
      name: item.name,
      url: item.url,
      slug: item.url.replace(/https?:\/\/[^\/]+\/(tools\/)?/, '').replace(/^\//, '')
    }));
    break;
  }
}

console.log('Total live tools on simplemaplab.com:', liveTools.length);

// Extract categories from sections in content
const sections = [...content.matchAll(/<section[^>]*>[\s\S]*?<h2[^>]*>(.*?)<\/h2>([\s\S]*?)<\/section>/g)];
const categorizedLive = {};
for (const s of sections) {
  const catName = s[1].replace(/&amp;/g, '&').trim();
  const toolMatches = [...s[2].matchAll(/<a[^>]*href=\"([^\"]+)\"[\s\S]*?<span[^>]*>([^<]+)<\/span>[\s\S]*?<span[^>]*>([^<]+)<\/span>[\s\S]*?<p[^>]*>([^<]+)<\/p>/g)];
  categorizedLive[catName] = toolMatches.map(m => ({
    href: m[1],
    title: m[2].replace(/&amp;/g, '&'),
    badge: m[3].trim(),
    desc: m[4].replace(/&amp;/g, '&').replace(/&#x27;/g, "'")
  }));
}

console.log('Categorized sections on live site:');
for (const [cat, tools] of Object.entries(categorizedLive)) {
  console.log(`- ${cat} (${tools.length} tools):`);
  tools.forEach(t => console.log(`   * ${t.title} [${t.badge}] -> ${t.href}`));
}
