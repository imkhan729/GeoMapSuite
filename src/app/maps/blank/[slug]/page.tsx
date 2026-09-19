import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { getAllBlankMaps, getBlankMapBySlug } from '@/data/maps/blank-maps-registry';
import { BlankMapViewer } from '@/features/maps/BlankMapViewer';
import { MapFaqAccordion } from '@/components/maps/MapFaqAccordion';
import { buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';

export async function generateStaticParams() {
  return getAllBlankMaps().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const mapItem = getBlankMapBySlug(slug);
  if (!mapItem) return {};

  const title = `Blank Map of ${mapItem.name}: ${mapItem.adminUnitsCount} ${mapItem.adminUnitsName} (SVG, PNG, PDF) | ${SITE_CONFIG.name}`;
  const canonical = buildCanonicalUrl(`/maps/blank/${mapItem.slug}`);

  return {
    title,
    description: `Free printable blank map of ${mapItem.name} — all ${mapItem.adminUnitsCount} ${mapItem.adminUnitsName.toLowerCase()}. Four variants: blank, labeled, colored, and with cities. SVG, PNG, and PDF downloads. Public domain.`,
    keywords: [
      `blank ${mapItem.name.toLowerCase()} map`,
      `printable ${mapItem.name.toLowerCase()} map`,
      `${mapItem.name.toLowerCase()} map outline`,
      `${mapItem.name.toLowerCase()} blank map pdf`,
      `${mapItem.name.toLowerCase()} svg map`,
      ...mapItem.keywords,
    ],
    alternates: { canonical },
    openGraph: {
      title,
      description: `Free printable blank map of ${mapItem.name} — all ${mapItem.adminUnitsCount} ${mapItem.adminUnitsName.toLowerCase()}. SVG, PNG, and PDF downloads. Public domain.`,
      url: canonical,
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}.svg`,
          width: 1200,
          height: 750,
          alt: `Blank Map of ${mapItem.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `Free printable blank map of ${mapItem.name} — all ${mapItem.adminUnitsCount} ${mapItem.adminUnitsName.toLowerCase()}. SVG, PNG, and PDF downloads.`,
    },
  };
}

export default async function BlankMapPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const mapItem = getBlankMapBySlug(slug);

  if (!mapItem) {
    notFound();
  }

  // Canonicalize URL: if accessed via an alias or alternate slug, permanently redirect
  if (slug !== mapItem.slug) {
    permanentRedirect(`/maps/blank/${mapItem.slug}/`);
  }

  const relatedMaps = getAllBlankMaps()
    .filter((m) => m.slug !== mapItem.slug && (m.category === mapItem.category || m.region === mapItem.region))
    .slice(0, 8);

  const subType = mapItem.adminUnitsName.split(' ')[0] || 'Subdivisions';
  const density = (mapItem.areaSqKm > 0 ? (parseFloat(mapItem.population) * (mapItem.population.includes('Million') ? 1000000 : mapItem.population.includes('Billion') ? 1000000000 : 1)) / mapItem.areaSqKm : 0);
  const densityFormatted = density > 0 ? `${Math.round(density)} / km²` : '—';

  // Specific FAQs for this territory/state/country
  const specificFaqs = (mapItem.faqs || []).map((f) => ({
    q: f.q,
    a: f.a,
  }));

  // Comprehensive People Also Ask style FAQ list
  const generalFaqs = [
    {
      q: `Is the blank map of ${mapItem.name} really free?`,
      a: `Yes. Every variant — blank, labeled, colored, and with cities — is 100% free to download in SVG, PNG, and PDF. No signup, no watermark, and no attribution required. The map is released into the public domain under CC0.`,
    },
    {
      q: `Can I use the ${mapItem.name} map for commercial projects?`,
      a: `Yes. You can use it in textbooks, YouTube videos, slide presentations, blog posts, commercial merchandise, and client reports. Because the underlying boundary data comes from public-domain government sources (US Census Bureau and Natural Earth), you owe nothing to anyone.`,
    },
    {
      q: `What is the difference between SVG, PNG, and PDF?`,
      a: `SVG is vector format — it scales to any dimension with zero pixelation, and you can ungroup and recolor each boundary in Illustrator, Inkscape, or Figma. PNG is a high-resolution raster image (available up to 7,200 px wide) ideal for Word, Google Docs, or Keynote. PDF is optimized for laser printing — it preserves crisp vector paths at standard US Letter, A4, or large poster sizes.`,
    },
    {
      q: `What size will it print at?`,
      a: `The SVG and PDF versions print cleanly at any size with zero quality loss. The PNG renders at 2,400 to 7,200 pixels on the long edge, printing with continuous-tone sharpness up to 48″ × 30″ at 150 DPI or 24″ × 15″ at 300 DPI.`,
    },
    {
      q: `Which variant should I use for a geography quiz?`,
      a: `Use the "Blank Outlines" variant for quizzes where students fill in the names themselves, and the "Labeled Centroids" variant as the teacher answer key. The "Colored Palette" variant is ideal for visual study guides.`,
    },
    {
      q: `Can I edit the map and add my own custom labels or colors?`,
      a: `Yes. Open the downloaded SVG file in Figma, Adobe Illustrator, or free Inkscape. Every ${subType.toLowerCase().replace(/s$/, '')} is a separate, named SVG path element that you can independently select, recolor, label, or modify.`,
    },
    {
      q: `What subdivisions are shown on this map?`,
      a: `All ${mapItem.adminUnitsCount} official primary administrative units (${mapItem.adminUnitsName}) of ${mapItem.name} are included as distinct vector paths. Boundaries follow authoritative USGS, US Census Bureau, and Natural Earth datasets.`,
    },
    {
      q: `What cartographic projection is the map drawn in?`,
      a: `${mapItem.recommendedProjection}. This projection minimizes angular and area distortions across ${mapItem.name}'s geographic bounds.`,
    },
    {
      q: `Where does the boundary data come from?`,
      a: `Data is compiled from official open public-domain sources: the US Census Bureau (TIGER/Line and us-atlas) for US geography and Natural Earth (1:50 million scale) for international borders, projected and converted via d3-geo.`,
    },
    {
      q: `How do I print this map at full page size?`,
      a: `Download the PDF, open it in your browser or Acrobat/Preview, select Print, and choose "Scale to fit" or "100%". The aspect ratio is calibrated to fill the printable area of standard US Letter or A4 sheets with comfortable margins.`,
    },
    {
      q: `Does the colored variant follow political party or demographic data?`,
      a: `No. The colors are an arbitrary 12-color pastel harmonic palette chosen purely so that adjacent borders contrast cleanly without heavy ink consumption.`,
    },
    {
      q: `Can I use this map offline?`,
      a: `Yes. Once downloaded to your computer, the SVG, PNG, or PDF file lives locally on your hard drive — no internet connection or server access is required.`,
    },
  ];

  // Specific FAQs take priority at the top, filtered to avoid duplicate topics
  const allFaqs = [
    ...specificFaqs,
    ...generalFaqs.filter(
      (g) => !specificFaqs.some((s) => s.q.toLowerCase().includes(g.q.slice(0, 18).toLowerCase()))
    ),
  ];

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': SITE_CONFIG.domain,
          },
          {
            '@type': 'ListItem',
            'position': 2,
            'name': 'Blank Maps',
            'item': `${SITE_CONFIG.domain}/maps/blank/`,
          },
          {
            '@type': 'ListItem',
            'position': 3,
            'name': mapItem.name,
            'item': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}/`,
          },
        ],
      },
      {
        '@type': 'ImageObject',
        'name': `Blank Map of ${mapItem.name}`,
        'description': `Free printable blank map of ${mapItem.name} — all ${mapItem.adminUnitsCount} ${mapItem.adminUnitsName.toLowerCase()}. SVG, PNG, and PDF downloads. Public domain.`,
        'contentUrl': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}.svg`,
        'encodingFormat': 'image/svg+xml',
        'license': 'https://creativecommons.org/publicdomain/zero/1.0/',
        'acquireLicensePage': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}/`,
        'creditText': SITE_CONFIG.name,
      },
      {
        '@type': 'Dataset',
        'name': `${mapItem.name} boundary geometry`,
        'description': `Boundary geometry for ${mapItem.name} and its ${mapItem.adminUnitsCount} ${mapItem.adminUnitsName.toLowerCase()}, derived from public-domain sources.`,
        'license': 'https://creativecommons.org/publicdomain/zero/1.0/',
        'isAccessibleForFree': true,
        'distribution': [
          {
            '@type': 'DataDownload',
            'encodingFormat': 'image/svg+xml',
            'contentUrl': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}.svg`,
          },
          {
            '@type': 'DataDownload',
            'encodingFormat': 'image/svg+xml',
            'contentUrl': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}-labeled.svg`,
          },
          {
            '@type': 'DataDownload',
            'encodingFormat': 'image/svg+xml',
            'contentUrl': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}-colored.svg`,
          },
          {
            '@type': 'DataDownload',
            'encodingFormat': 'image/svg+xml',
            'contentUrl': `${SITE_CONFIG.domain}/maps/blank/${mapItem.slug}-cities.svg`,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        'mainEntity': allFaqs.map((f) => ({
          '@type': 'Question',
          'name': f.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a,
          },
        })),
      },
    ],
  };

  return (
    <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-6 pb-20 space-y-7">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-[13px] text-[#8a8880] flex items-center gap-1.5">
        <Link href="/" className="hover:text-[#1a1a18] transition-colors">
          Home
        </Link>
        <span className="text-[#c5c2ba]">/</span>
        <Link href="/maps/blank" className="hover:text-[#1a1a18] transition-colors">
          Blank Maps
        </Link>
        <span className="text-[#c5c2ba]">/</span>
        <span className="text-[#1a1a18] font-medium">{mapItem.name}</span>
      </nav>

      {/* Header Block */}
      <header className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#1a1a18] leading-tight">
          Blank Map of {mapItem.name}
        </h1>
        <p className="text-[#6b6860] text-sm sm:text-base leading-relaxed max-w-3xl">
          Free printable {mapItem.name} map with {mapItem.adminUnitsCount} {mapItem.adminUnitsName.toLowerCase()}. Four variants — blank, labeled, colored, and with cities. Download as SVG, PNG, or PDF. Public domain.
        </p>
      </header>

      {/* Quick Answer Banner (4 Columns) */}
      <div className="bg-[#f5f8f6] border border-[#cfe3d8] rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div>
          <div className="text-[11px] font-semibold text-[#6b6860] tracking-wider uppercase mb-1">
            Free downloads
          </div>
          <div className="font-serif text-lg font-semibold text-[#1a1a18]">
            SVG · PNG · PDF
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[#6b6860] tracking-wider uppercase mb-1">
            Variants
          </div>
          <div className="font-serif text-lg font-semibold text-[#1a1a18]">
            4 versions
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[#6b6860] tracking-wider uppercase mb-1">
            {subType.toLowerCase()}
          </div>
          <div className="font-serif text-lg font-semibold text-[#1a1a18]">
            {mapItem.adminUnitsCount}
          </div>
        </div>

        <div>
          <div className="text-[11px] font-semibold text-[#6b6860] tracking-wider uppercase mb-1">
            License
          </div>
          <div className="font-serif text-lg font-semibold text-[#1a1a18]">
            Public domain
          </div>
        </div>
      </div>

      {/* Interactive Map Visualizer & Controls Panel */}
      <section className="space-y-4">
        <BlankMapViewer mapItem={mapItem} />
      </section>

      {/* "On this page" Jump Nav */}
      <nav className="bg-[#f5f3ee] rounded-xl p-4 text-sm">
        <div className="font-semibold text-[#1a1a18] mb-2">On this page</div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-xs sm:text-sm text-[#2a6e4e]">
          <a href="#about" className="hover:underline">About this map</a>
          <a href="#factsheet" className="hover:underline">{mapItem.name} factsheet</a>
          <a href="#variants" className="hover:underline">The 4 variants explained</a>
          <a href="#uses" className="hover:underline">Common uses</a>
          <a href="#education" className="hover:underline">Classroom ideas</a>
          <a href="#print" className="hover:underline">How to print</a>
          <a href="#regions" className="hover:underline">{subType.toLowerCase()} list</a>
          <a href="#license" className="hover:underline">License</a>
          <a href="#glossary" className="hover:underline">Glossary</a>
          <a href="#faq" className="hover:underline">FAQ</a>
        </div>
      </nav>

      {/* Main Content Sections */}
      <div className="space-y-12 pt-4">
        
        {/* 1. About */}
        <section id="about" className="space-y-3.5 max-w-[760px]">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            About this blank map of {mapItem.name}
          </h2>
          <p className="text-sm sm:text-base text-[#5c5a55] leading-relaxed">
            This is a free, high-resolution blank outline map of {mapItem.name}, showing all {mapItem.adminUnitsCount} {mapItem.adminUnitsName.toLowerCase()}. It is rendered fresh from public-domain boundary data (US Census Bureau via us-atlas or Natural Earth 1:50m) and exported as clean vector paths — no watermark, no signup, and no attribution required.
          </p>
          <p className="text-sm sm:text-base text-[#5c5a55] leading-relaxed">
            {mapItem.name} is home to approximately {mapItem.population} and covers {mapItem.areaSqKm.toLocaleString()} km² ({(mapItem.areaSqKm * 0.386102).toLocaleString(undefined, { maximumFractionDigits: 0 })} mi²). {mapItem.capital && `The capital is ${mapItem.capital}.`}
          </p>
          <p className="text-sm sm:text-base text-[#5c5a55] leading-relaxed">
            All four variants are generated from the exact same source geometry, so the borders align with sub-millimeter precision between them. You can download the blank version for student worksheets, then print the labeled version as the grading answer key — knowing each polygon will sit in the identical position on paper.
          </p>
        </section>

        {/* 2. Factsheet */}
        <section id="factsheet" className="space-y-3.5">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            {mapItem.name} factsheet
          </h2>
          <div className="bg-white border border-[#e0ddd6] rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <tbody className="divide-y divide-[#f0eee8]">
                <tr>
                  <td className="py-3 px-4 text-[#6b6860] w-1/3">Type</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.category === 'us-state' ? 'US State' : mapItem.category === 'country' ? 'Sovereign Country' : 'Continent / Global'}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6b6860]">Continent / Region</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.region}</td>
                </tr>
                {mapItem.capital && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">Capital</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.capital}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-3 px-4 text-[#6b6860]">Population</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.population}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6b6860]">Surface Area</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.areaSqKm.toLocaleString()} km² ({(mapItem.areaSqKm * 0.386102).toLocaleString(undefined, { maximumFractionDigits: 0 })} mi²)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6b6860]">Population Density</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{densityFormatted}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6b6860]">{subType}</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.adminUnitsCount}</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-[#6b6860]">Recommended Projection</td>
                  <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.recommendedProjection}</td>
                </tr>
                {mapItem.facts.highestPoint && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">Highest Elevation</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.facts.highestPoint}</td>
                  </tr>
                )}
                {mapItem.facts.lowestPoint && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">Lowest Elevation</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.facts.lowestPoint}</td>
                  </tr>
                )}
                {mapItem.facts.primaryRiverOrWater && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">Primary Waterway</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.facts.primaryRiverOrWater}</td>
                  </tr>
                )}
                {mapItem.facts.standardTimeZones && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">Time Zones</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18]">{mapItem.facts.standardTimeZones}</td>
                  </tr>
                )}
                {mapItem.facts.isoCode && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">ISO Code</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18] font-mono">{mapItem.facts.isoCode}</td>
                  </tr>
                )}
                {mapItem.facts.postalCode && (
                  <tr>
                    <td className="py-3 px-4 text-[#6b6860]">Postal Code</td>
                    <td className="py-3 px-4 font-medium text-[#1a1a18] font-mono">{mapItem.facts.postalCode}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. The 4 Variants Explained */}
        <section id="variants" className="space-y-4 max-w-[760px]">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            The 4 variants explained
          </h2>
          <p className="text-sm sm:text-base text-[#5c5a55] leading-relaxed">
            We generate four versions of every map from the same source geometry. Pick the one that fits your project — and remember, every variant is downloadable as SVG, PNG, or PDF.
          </p>

          <div className="space-y-4 pt-1">
            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1a1a18] mb-1">
                1. Blank outline
              </h3>
              <p className="text-sm text-[#5c5a55] leading-relaxed">
                The basic outline. Every {subType.toLowerCase().replace(/s$/, '')} is shown as a separate vector path with no fill, just a thin border. This is the version you want for tests, fill-in-the-blank homework, or as a starting point for your own custom GIS overlay.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1a1a18] mb-1">
                2. Labeled
              </h3>
              <p className="text-sm text-[#5c5a55] leading-relaxed">
                Same outline, but with the {subType.toLowerCase().replace(/s$/, '')} names placed cleanly at each geographic centroid. Use this version as the classroom answer key or for fast visual reference when you don&apos;t have time to add labels yourself.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1a1a18] mb-1">
                3. Colored
              </h3>
              <p className="text-sm text-[#5c5a55] leading-relaxed">
                Each jurisdiction is filled from an ink-saving 12-color pastel palette so that adjacent territories contrast clearly. The colors are arbitrary and non-political — use this when you want an immediate, vibrant layout without manual coloring.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-lg font-semibold text-[#1a1a18] mb-1">
                4. With cities
              </h3>
              <p className="text-sm text-[#5c5a55] leading-relaxed">
                The outline plus anchor dots and typographic labels for top major metropolitan centers and the capital. Ideal for travel projects, economic corridors, or wherever readers require urban navigational anchors.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Common Uses */}
        <section id="uses" className="space-y-4 max-w-[760px]">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            What people use blank maps of {mapItem.name} for
          </h2>

          <div className="space-y-4 text-sm text-[#5c5a55] leading-relaxed">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                K-12 and university teaching
              </h3>
              <p>
                Geography, history, and social studies instructors use blank maps of {mapItem.name} for quizzes (&ldquo;label the {subType.toLowerCase()}&rdquo;), homework worksheets, and unit-assessment answer keys. The blank/labeled pair ensures the questions and solutions line up identically.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                YouTube and content creation
              </h3>
              <p>
                Video essayists and documentarians use the colored or cities variant as vector base layers in After Effects, DaVinci Resolve, or Premiere. Because SVG is purely mathematical, you can scale into regional close-ups in 4K resolution with zero pixelation.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                Sales and marketing territory mapping
              </h3>
              <p>
                Businesses use blank maps to plan distributor territories, franchise coverage, or logistics routes. Open the SVG in Figma or Adobe Illustrator, drop colored fills onto target zones, and generate an executive-ready territory slide in minutes.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                Data visualization and choropleths
              </h3>
              <p>
                Data journalists and GIS analysts use our clean SVG geometry for choropleth maps. Each boundary path contains a stable ID, making it straightforward to shade by population, economic indicators, or climate data using D3.js, Observable, or Python.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                Travel scrapbooks and bucket lists
              </h3>
              <p>
                Travelers print a blank map of {mapItem.name} and shade each region as they visit. By the end of a trip, you have a personalized physical keepsake without third-party tracking or subscriptions.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Classroom Ideas */}
        <section id="education" className="space-y-4 max-w-[760px]">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            Classroom ideas for the {mapItem.name} blank map
          </h2>
          <p className="text-sm text-[#5c5a55]">
            A blank map is a Swiss-army knife for geography education. A few exercises that work across elementary through college curricula:
          </p>

          <ul className="list-disc pl-5 space-y-2 text-sm text-[#5c5a55] leading-relaxed">
            <li><strong>Label race:</strong> Print the blank version, give students 10 minutes to write down as many {subType.toLowerCase()} as they can recall, and grade against the labeled variant.</li>
            <li><strong>Color by region:</strong> Group {subType.toLowerCase()} by climate, economic output, or historical development and have students construct a legend.</li>
            <li><strong>Population dot map:</strong> Have students place dots proportional to regional population density to visualize demographic concentration.</li>
            <li><strong>Current events tracker:</strong> Have students place pins or stickers on regions highlighted in weekly news reports.</li>
            <li><strong>Expedition planner:</strong> Map historical exploration routes or modern interstate freight corridors across the terrain.</li>
          </ul>
        </section>

        {/* 6. How to Print */}
        <section id="print" className="space-y-4 max-w-[760px]">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            How to print the {mapItem.name} map
          </h2>
          <p className="text-sm text-[#5c5a55] leading-relaxed">
            For most home and classroom users, the PDF option is easiest. Download the PDF, open it in your viewer, and hit print with &ldquo;Scale to fit&rdquo; enabled. The file is sized to fill US Letter and A4 pages with balanced margins.
          </p>

          <div className="space-y-3 text-sm text-[#5c5a55] leading-relaxed">
            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                For best print quality
              </h3>
              <p>
                Use the vector SVG or PDF files — both preserve continuous curves at any scale. If using PNG, choose the 2,400 px Print or 4,800 px Poster resolution to prevent pixel blurriness on paper.
              </p>
            </div>

            <div>
              <h3 className="font-serif text-base font-semibold text-[#1a1a18] mb-1">
                For poster and large-format printing
              </h3>
              <p>
                Take the vector SVG or PDF to any print shop. Because vectors have no resolution ceiling, a single file prints with identical razor sharpness at 8.5″ × 11″ or 36″ × 48″ wall-poster dimensions.
              </p>
            </div>
          </div>
        </section>

        {/* 7. Subdivisions Directory */}
        {mapItem.subdivisions && mapItem.subdivisions.length > 0 && (
          <section id="regions" className="space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
              {mapItem.name} {subType.toLowerCase()} list
            </h2>
            <div className="bg-white border border-[#e0ddd6] rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-[#f5f3ee] border-b border-[#e0ddd6]">
                      <th className="py-3 px-4 font-semibold text-[#1a1a18]">Subdivision</th>
                      <th className="py-3 px-4 font-semibold text-[#1a1a18]">Code</th>
                      <th className="py-3 px-4 font-semibold text-[#1a1a18]">Capital / Seat</th>
                      <th className="py-3 px-4 font-semibold text-[#1a1a18]">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0eee8]">
                    {mapItem.subdivisions.map((sub, idx) => (
                      <tr key={idx} className="hover:bg-[#faf9f6] transition-colors">
                        <td className="py-3 px-4 font-medium text-[#1a1a18]">{sub.name}</td>
                        <td className="py-3 px-4 font-mono text-[#6b6860]">{sub.code || '—'}</td>
                        <td className="py-3 px-4 text-[#5c5a55]">{sub.capital || '—'}</td>
                        <td className="py-3 px-4 text-[#5c5a55]">{sub.population || sub.type || 'Administrative Unit'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* 8. License */}
        <section id="license" className="space-y-3 max-w-[760px] bg-[#f5f8f6] border border-[#cfe3d8] rounded-xl p-5 sm:p-6">
          <h2 className="font-serif text-xl font-semibold text-[#1a1a18]">
            Creative Commons CC0 1.0 Universal License
          </h2>
          <p className="text-sm text-[#2d5a3f] leading-relaxed">
            This map and its vector boundary coordinates are dedicated to the public domain worldwide under CC0. You can copy, modify, distribute, publish, and commercialize the work without asking permission and without any requirement for attribution.
          </p>
        </section>

        {/* 9. Cartographic Glossary */}
        <section id="glossary" className="space-y-4 max-w-[760px]">
          <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
            Cartographic glossary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="border border-[#e0ddd6] rounded-xl p-4 bg-white">
              <strong className="block font-semibold text-[#1a1a18] mb-1">Vector vs. Raster</strong>
              <p className="text-[#5c5a55]">
                Vector files (SVG/PDF) use geometric coordinates that never lose quality when scaled. Raster files (PNG/JPEG) store fixed grids of pixels that blur when enlarged.
              </p>
            </div>

            <div className="border border-[#e0ddd6] rounded-xl p-4 bg-white">
              <strong className="block font-semibold text-[#1a1a18] mb-1">Map Projection</strong>
              <p className="text-[#5c5a55]">
                A mathematical formula that translates Earth&apos;s curved 3D surface onto flat 2D paper while managing distortions in area, distance, and direction.
              </p>
            </div>

            <div className="border border-[#e0ddd6] rounded-xl p-4 bg-white">
              <strong className="block font-semibold text-[#1a1a18] mb-1">Centroid</strong>
              <p className="text-[#5c5a55]">
                The calculated geographic center of mass of a polygon, used by cartographers to place region labels with optimal visual balance.
              </p>
            </div>

            <div className="border border-[#e0ddd6] rounded-xl p-4 bg-white">
              <strong className="block font-semibold text-[#1a1a18] mb-1">DPI (Dots Per Inch)</strong>
              <p className="text-[#5c5a55]">
                Measure of print resolution. 150 DPI is standard for student handouts; 300 DPI delivers continuous photo-quality sharpness for publications.
              </p>
            </div>
          </div>
        </section>

        {/* 10. FAQ Accordion */}
        <MapFaqAccordion
          faqs={allFaqs}
          mapName={mapItem.name}
          title={`Frequently Asked Questions: ${mapItem.name} Blank Map`}
        />

        {/* 11. Related Maps */}
        {relatedMaps.length > 0 && (
          <section id="related" className="space-y-4 pt-4 border-t border-[#e0ddd6]">
            <h2 className="font-serif text-2xl font-semibold text-[#1a1a18] tracking-tight">
              Related blank maps
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {relatedMaps.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/maps/blank/${rel.slug}`}
                  className="p-3 bg-white border border-[#e0ddd6] hover:border-[#2a6e4e] rounded-xl transition-all flex flex-col justify-between shadow-2xs group"
                >
                  <div className="aspect-[1.6] bg-[#f0ede6] rounded-lg p-1.5 flex items-center justify-center overflow-hidden mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/maps/blank/${rel.slug}.svg`}
                      alt=""
                      className="w-full h-full object-contain block opacity-85 group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#6b6860] uppercase block">
                      {rel.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors line-clamp-1">
                      {rel.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
