const http = require('http');

const routes = [
  '/',
  '/tools',
  '/tools/map-radius-tool',
  '/tools/what-county-am-i-in',
  '/tools/distance-between-two-places',
  '/tools/drive-time-map',
  '/tools/latitude-longitude-finder',
  '/my-elevation',
  '/elevation-profile',
  '/us-time-zone-map',
  '/maps/blank',
  '/maps/blank/united-states',
  '/states',
  '/geography/equator',
  '/studies',
];

async function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        const hasJsonLd = body.includes('application/ld+json');
        const hasHeader = body.includes('GeoMap') && body.includes('Suite');
        const hasFooter = body.includes('GeoMap Suite');
        const hasDomain = body.includes('geomapsuite.com');
        const hasOldBrand = body.includes('simplemaplab.com') || body.includes('SimpleMapLab');

        resolve({
          path,
          status: res.statusCode,
          hasJsonLd,
          hasHeader,
          hasFooter,
          hasDomain,
          hasOldBrand,
        });
      });
    }).on('error', (err) => {
      resolve({ path, error: err.message });
    });
  });
}

async function run() {
  console.log('Testing GeoMap Suite routes on http://localhost:3000 ...\n');
  let failures = 0;

  for (const route of routes) {
    const result = await checkRoute(route);
    if (result.error) {
      console.error(`❌ [ERROR] ${route} -> ${result.error}`);
      failures++;
    } else if (result.status >= 400) {
      console.error(`❌ [${result.status}] ${route}`);
      failures++;
    } else {
      const flags = [];
      if (result.hasJsonLd) flags.push('JSON-LD ✓');
      if (result.hasHeader) flags.push('Header ✓');
      if (result.hasFooter) flags.push('Footer ✓');
      if (result.hasDomain) flags.push('geomapsuite.com ✓');
      if (result.hasOldBrand) {
        flags.push('⚠️ Has simplemaplab');
        failures++;
      }
      console.log(`✅ [${result.status}] ${route} (${flags.join(', ')})`);
    }
  }

  console.log(`\nVerification finished: ${failures === 0 ? 'ALL PASSED 🎉' : `${failures} issues found`}`);
  if (failures > 0) process.exit(1);
}

run();
