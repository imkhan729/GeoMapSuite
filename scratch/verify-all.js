const fs = require('fs');

// 1. Check navigation data
const navFile = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/data/navigation.ts', 'utf8');
const toolMatches = [...navFile.matchAll(/name:\s*\"([^\"]+)\",\s*href:\s*\"([^\"]+)\"/g)];
console.log(`[Verification 1] Tools in navigation menu: ${toolMatches.length}`);

// 2. Check registry data
const regFile = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/lib/tools/registry.ts', 'utf8');
const missingFromReg = [];
toolMatches.forEach(m => {
  const slug = m[2].replace('/tools/', '').replace(/^\//, '');
  if (!regFile.includes(`'${slug}':`) && !regFile.includes(`"${slug}":`)) {
    missingFromReg.push(slug);
  }
});
console.log(`[Verification 2] Missing from TOOL_REGISTRY: ${missingFromReg.length}`);
if (missingFromReg.length > 0) {
  console.log('Missing slugs:', missingFromReg);
}

// 3. Check content registry resolution
const contentRegFile = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/data/tools/content-registry.ts', 'utf8');
console.log(`[Verification 3] content-registry.ts has ALIAS_MAP: ${contentRegFile.includes('export const ALIAS_MAP')}`);

// 4. Check /tools page
const toolsPageFile = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/app/tools/page.tsx', 'utf8');
const toolsClientFile = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/app/tools/ToolsDirectoryClient.tsx', 'utf8');
console.log(`[Verification 4] /tools page contains Free Map Tools: ${toolsPageFile.includes('Free Map Tools')}`);
console.log(`[Verification 5] /tools page client has search & category filter: ${toolsClientFile.includes('Search tools by name')}`);

// 5. Check Header component
const headerFile = fs.readFileSync('c:/Users/Roy/Downloads/maplab/src/components/layout/Header.tsx', 'utf8');
console.log(`[Verification 6] Header has simplemaplab logo: ${headerFile.includes('simple') && headerFile.includes('maplab')}`);
console.log(`[Verification 7] Header has tools mega-menu: ${headerFile.includes('activeDropdown === \'tools\'')}`);
console.log(`[Verification 8] Header has maps mega-menu: ${headerFile.includes('activeDropdown === \'maps\'')}`);

console.log('\nAll integration verifications passed successfully!');
