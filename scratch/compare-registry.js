const fs = require('fs');
const path = require('path');

// Load registry from src/lib/tools/registry.ts
const regText = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/lib/tools/registry.ts', 'utf8');
const registeredSlugs = [...regText.matchAll(/'([a-z0-9-]+)':\s*\{/g)].map(m => m[1]);

console.log('Registered slugs in registry.ts:', registeredSlugs.length);
console.log(registeredSlugs);
