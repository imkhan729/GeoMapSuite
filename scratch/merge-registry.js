const fs = require('fs');

const registryPath = 'c:/Users/Roy/Downloads/maplab/src/lib/tools/registry.ts';
let regContent = fs.readFileSync(registryPath, 'utf8');

const newTools = JSON.parse(fs.readFileSync('c:/Users/Roy/Downloads/maplab/scratch/new-tools-data.json', 'utf8'));

// Format each tool as a TypeScript object literal
const entries = [];
for (const [key, tool] of Object.entries(newTools)) {
  // skip if already exists
  if (regContent.includes(`'${key}':`) || regContent.includes(`"${key}":`)) {
    console.log(`Skipping already present key: ${key}`);
    continue;
  }
  
  const entryStr = `  '${key}': {
    slug: '${tool.slug}',
    name: '${tool.name.replace(/'/g, "\\'")}',
    shortName: '${tool.shortName.replace(/'/g, "\\'")}',
    category: '${tool.category}',
    scope: '${tool.scope}',
    status: '${tool.status}',
    description: '${tool.description.replace(/'/g, "\\'")}',
    directAnswer: '${tool.directAnswer.replace(/'/g, "\\'")}',
    primaryKeyword: '${tool.primaryKeyword.replace(/'/g, "\\'")}',
    secondaryKeywords: ${JSON.stringify(tool.secondaryKeywords)},
    relatedTools: ${JSON.stringify(tool.relatedTools)},
    requiresMap: ${tool.requiresMap},
    requiresGeocoding: ${tool.requiresGeocoding},
    requiresRouting: ${tool.requiresRouting},
    requiresElevation: ${tool.requiresElevation},
    clientOnlyCapable: ${tool.clientOnlyCapable},
    ${tool.badge ? `badge: '${tool.badge}',` : ''}
    indexable: ${tool.indexable},
    updatedAt: '${tool.updatedAt}',
  },`;
  entries.push(entryStr);
}

console.log(`Adding ${entries.length} entries to TOOL_REGISTRY`);

const insertTarget = '\n};\n\nexport const TOOL_CATEGORIES';
if (!regContent.includes(insertTarget)) {
  console.error('Could not find insertion target in registry.ts');
  process.exit(1);
}

const replacement = ',\n\n  // --- Additional SimpleMapLab Directory Tools ---\n' + entries.join('\n\n') + '\n};\n\nexport const TOOL_CATEGORIES';
regContent = regContent.replace(insertTarget, replacement);

fs.writeFileSync(registryPath, regContent, 'utf8');
console.log('Successfully updated src/lib/tools/registry.ts!');
