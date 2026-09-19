const fs = require('fs');

const navText = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/data/navigation.ts', 'utf8');
const regText = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/lib/tools/registry.ts', 'utf8');

const toolMatches = [...navText.matchAll(/name:\s*\"([^\"]+)\",\s*href:\s*\"([^\"]+)\"/g)];
const allMenuTools = toolMatches.map(m => ({
  name: m[1],
  href: m[2],
  slug: m[2].replace('/tools/', '').replace(/^\//, '')
}));

console.log('Total menu tools:', allMenuTools.length);

const missingInRegistry = allMenuTools.filter(t => !regText.includes(`'${t.slug}':`) && !regText.includes(`"${t.slug}":`));
console.log('Missing in registry.ts:', missingInRegistry.length);
missingInRegistry.forEach(t => console.log(`- ${t.name} (${t.slug}) [${t.href}]`));
