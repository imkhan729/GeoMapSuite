const fs = require('fs');
const path = require('path');
const https = require('https');

const outDir = path.join(__dirname, '../public/maps/blank');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    if (fs.existsSync(dest) && fs.statSync(dest).size > 100) {
      // Already downloaded
      return resolve(true);
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(true));
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(false);
    });
  });
}

// Slugs list
const slugs = [
  'world', 'north-america', 'south-america', 'europe', 'asia', 'africa', 'oceania',
  'united-states', 'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware', 'district-of-columbia', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new-hampshire', 'new-jersey', 'new-mexico', 'new-york', 'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania', 'rhode-island', 'south-carolina', 'south-dakota', 'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west-virginia', 'wisconsin', 'wyoming',
  'argentina', 'australia', 'austria', 'belgium', 'brazil', 'canada', 'chile', 'china', 'colombia', 'czech-republic', 'denmark', 'egypt', 'finland', 'france', 'germany', 'greece', 'hungary', 'india', 'indonesia', 'iran', 'iraq', 'ireland', 'israel', 'italy', 'japan', 'malaysia', 'mexico', 'netherlands', 'new-zealand', 'nigeria', 'norway', 'pakistan', 'peru', 'philippines', 'poland', 'portugal', 'romania', 'russia', 'saudi-arabia', 'singapore', 'south-africa', 'south-korea', 'spain', 'sweden', 'switzerland', 'thailand', 'turkey', 'ukraine', 'united-arab-emirates', 'united-kingdom', 'vietnam'
];

const variants = ['', '-labeled', '-colored', '-cities'];

async function downloadAll() {
  console.log(`Starting download of ${slugs.length * variants.length} map SVGs...`);
  let totalDownloaded = 0;
  let skippedOrFailed = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i];
    const tasks = variants.map(async (v) => {
      const filename = `${slug}${v}.svg`;
      const url = `https://www.simplemaplab.com/maps/blank/${filename}`;
      const dest = path.join(outDir, filename);
      const ok = await downloadFile(url, dest);
      if (ok) totalDownloaded++;
      else skippedOrFailed++;
    });
    await Promise.all(tasks);
    if ((i + 1) % 10 === 0 || i === slugs.length - 1) {
      console.log(`Progress: ${i + 1}/${slugs.length} maps processed (Success: ${totalDownloaded}, Failed/Skipped: ${skippedOrFailed})`);
    }
  }
  console.log(`Done! Downloaded ${totalDownloaded} SVGs to ${outDir}`);
}

downloadAll();
