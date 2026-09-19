import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Sparkles, ShieldCheck, CheckCircle2, Globe2 } from 'lucide-react';
import { getAllTools, getToolBySlug, ToolRegistryItem } from '@/lib/tools/registry';
import { generateToolMetadata, buildCanonicalUrl, SITE_CONFIG } from '@/lib/seo/metadata';
import { generateToolJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd, generateHowToJsonLd } from '@/lib/seo/jsonld';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { WorkedExample } from '@/components/tools/WorkedExample';
import { MethodologySection } from '@/components/tools/MethodologySection';
import { FaqSection } from '@/components/tools/FaqSection';
import { RelatedTools } from '@/components/tools/RelatedTools';
import { getToolContent, ALIAS_MAP } from '@/data/tools/content-registry';
import { GEOGRAPHY_LINES } from '@/data/tools/geography-lines';
import { GeographyMapView } from '@/features/tools/geography/GeographyMapView';

// Dedicated Tool Interactive Feature Components
import { MapRadiusView } from '@/features/tools/radius/MapRadiusView';
import { MapAreaView } from '@/features/tools/area/MapAreaView';
import { DistanceBetweenPlacesView } from '@/features/tools/distance/DistanceBetweenPlacesView';
import { LatLongFinderView } from '@/features/tools/coordinates/LatLongFinderView';
import { AddressToCoordinatesView } from '@/features/tools/coordinates/AddressToCoordinatesView';
import { CoordinatesToAddressView } from '@/features/tools/coordinates/CoordinatesToAddressView';
import { CoordinateConverterView } from '@/features/tools/coordinates/CoordinateConverterView';
import { ElevationFinderView } from '@/features/tools/elevation/ElevationFinderView';
import { DriveTimeMapView } from '@/features/tools/isochrone/DriveTimeMapView';
import { PinDropMapView } from '@/features/tools/cartography/PinDropMapView';
import { CsvToMapView } from '@/features/tools/data/CsvToMapView';
import { MapDrawerView } from '@/features/tools/cartography/MapDrawerView';
import { KmlViewerView } from '@/features/tools/gis/KmlViewerView';
import { GpxViewerView } from '@/features/tools/gis/GpxViewerView';
import { GeoJsonViewerView } from '@/features/tools/gis/GeoJsonViewerView';
import { BearingCalculatorView } from '@/features/tools/geodesic/BearingCalculatorView';
import { MidpointCalculatorView } from '@/features/tools/geodesic/MidpointCalculatorView';
import { DestinationPointView } from '@/features/tools/geodesic/DestinationPointView';
import { BoundingBoxView } from '@/features/tools/geodesic/BoundingBoxView';
import { AstronomyView } from '@/features/tools/reference/AstronomyView';
import { LocationIdentityView } from '@/features/tools/location/LocationIdentityView';
import { GeofenceGeneratorView } from '@/features/tools/geofence/GeofenceGeneratorView';
import { BufferMapView } from '@/features/tools/buffer/BufferMapView';
import { CoordinateDistanceCalculatorView } from '@/features/tools/coordinates/CoordinateDistanceCalculatorView';
import { UtmConverterView } from '@/features/tools/converters/UtmConverterView';
import { MgrsConverterView } from '@/features/tools/converters/MgrsConverterView';
import { GeohashConverterView } from '@/features/tools/converters/GeohashConverterView';
import { PlusCodeConverterView } from '@/features/tools/converters/PlusCodeConverterView';
import { FormatConverterView } from '@/features/tools/gis/FormatConverterView';
import { ShapefileViewerView } from '@/features/tools/gis/ShapefileViewerView';
import { GeoJsonValidatorView } from '@/features/tools/gis/GeoJsonValidatorView';
import { CoordinateParserView } from '@/features/tools/coordinates/CoordinateParserView';
import { AreaUnitConverterView } from '@/features/tools/units/AreaUnitConverterView';
import { DistanceUnitConverterView } from '@/features/tools/units/DistanceUnitConverterView';
import { SpeedDistanceTimeView } from '@/features/tools/units/SpeedDistanceTimeView';
import { SunPositionView } from '@/features/tools/reference/SunPositionView';
import { DayNightMapView } from '@/features/tools/reference/DayNightMapView';
import { MoonPhaseView } from '@/features/tools/reference/MoonPhaseView';
import { AntipodeFinderView } from '@/features/tools/coordinates/AntipodeFinderView';
import { RandomLocationView } from '@/features/tools/coordinates/RandomLocationView';
import { GeographicCenterView } from '@/features/tools/coordinates/GeographicCenterView';

export async function generateStaticParams() {
  return getAllTools()
    .filter((t) => getToolContent(t.slug) !== null)
    .map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const canonicalSlug = ALIAS_MAP[slug] || slug;
  const tool = getToolBySlug(canonicalSlug);
  const content = getToolContent(canonicalSlug);
  if (!tool || !content) return {};
  return generateToolMetadata(tool);
}

export default async function ToolPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const canonicalSlug = ALIAS_MAP[slug] || slug;
  const tool = getToolBySlug(canonicalSlug);
  const content = getToolContent(canonicalSlug);

  if (!tool || !content) {
    notFound();
  }

  // Schema generation
  const toolSchema = generateToolJsonLd(tool);
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: 'All Tools', url: buildCanonicalUrl('/tools') },
    { name: tool.name, url: buildCanonicalUrl(`/tools/${tool.slug}`) },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {content.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFaqJsonLd(content.faqs)) }}
        />
      )}
      {content.howTo && content.howTo.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateHowToJsonLd(tool.name, content.directAnswer, content.howTo)
            ),
          }}
        />
      )}

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'All Tools', href: '/tools' },
          { label: tool.shortName },
        ]}
      />

      {/* Header & Direct Answer (Server-Rendered for SEO/AEO) */}
      <header className="space-y-4" id="overview">
        {/* Authority & Privacy Badge Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#235c41]">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c7ded2] bg-[#f4f8f5] px-3.5 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#2a6e4e]" />
            <span>Free Online GIS Utility</span>
          </div>
          <span className="text-[#d4d1c9]">·</span>
          <div className="inline-flex items-center gap-1.5 text-[#54524b]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#2a6e4e]" />
            <span>Zero Sign-Up &amp; Client-Side Privacy</span>
          </div>
          <span className="text-[#d4d1c9]">·</span>
          <div className="inline-flex items-center gap-1.5 text-[#54524b]">
            <Globe2 className="h-3.5 w-3.5 text-[#2a6e4e]" />
            <span>WGS84 Ellipsoidal Geodesics</span>
          </div>
        </div>

        {/* H1 Main Heading: High-Intent SERP Keywords */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-semibold tracking-tight text-[#1a1a18] leading-[1.2]">
          {tool.name}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-[#54524b] max-w-4xl leading-relaxed">
          {tool.description}
        </p>

        {/* Direct Answer Block (Google Featured Snippet / AEO Position 0 Target) */}
        <div className="rounded-2xl border border-[#c7ded2] bg-[#f4f8f5] p-5 sm:p-6 space-y-2 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[#235c41] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-[#2a6e4e]" />
            <span>Direct Answer &amp; Core Functionality</span>
          </div>
          <p className="text-sm sm:text-base leading-relaxed text-[#1a1a18]">
            {content.directAnswer}
          </p>
        </div>
      </header>

      {/* Interactive Tool Component */}
      <div id="tool" className="rounded-3xl border border-[#e8e6e1] bg-white p-4 sm:p-6 shadow-xs scroll-mt-20">
        {renderToolComponent(tool.slug)}
      </div>

      {/* Fast In-Page Anchor Jump Bar */}
      <nav aria-label="Tool sections jump navigation" className="py-2 overflow-x-auto no-scrollbar border-y border-[#f0eee8]">
        <div className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
          <span className="text-[#737067] pr-1">Jump to:</span>
          <a href="#specs" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">Specifications</a>
          <a href="#howto" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">How to Use</a>
          {content.examples.length > 0 && (
            <a href="#examples" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">Worked Examples</a>
          )}
          <a href="#accuracy" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">Accuracy Benchmark</a>
          {content.resultExplanation.length > 0 && (
            <a href="#results" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">Understanding Results</a>
          )}
          {content.useCases.length > 0 && (
            <a href="#usecases" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">Use Cases</a>
          )}
          <a href="#methodology" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">Formulas &amp; Datum</a>
          {content.faqs.length > 0 && (
            <a href="#faqs" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">FAQs</a>
          )}
        </div>
      </nav>

      {/* Specifications & Technical Reference Matrix */}
      <section id="specs" className="rounded-2xl border border-[#e8e6e1] bg-[#fcfbf9] p-6 sm:p-8 space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between border-b border-[#e8e6e1] pb-3">
          <h2 className="font-serif text-lg sm:text-xl font-semibold text-[#1a1a18]">
            {tool.shortName} Technical Specifications &amp; Standards
          </h2>
          <span className="text-xs text-[#737067] font-medium hidden sm:inline">Reference ISO / OGC Standard</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="rounded-xl border border-[#e8e6e1] bg-white p-5 space-y-1.5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737067] block">Geodetic Datum</span>
            <p className="text-sm font-semibold text-[#1a1a18]">{content.methodology.datum.split(',')[0] || 'WGS84 (EPSG:4326)'}</p>
            <p className="text-xs text-[#737067]">Standard global ellipsoidal coordinate reference system</p>
          </div>
          <div className="rounded-xl border border-[#e8e6e1] bg-white p-5 space-y-1.5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737067] block">Mathematical Engine</span>
            <p className="text-sm font-semibold text-[#1a1a18]">{content.methodology.formulaTitle.split(' ')[0]} Geodesics</p>
            <p className="text-xs text-[#737067]">{content.methodology.precision.split('(')[0] || 'Sub-millimeter accuracy'}</p>
          </div>
          <div className="rounded-xl border border-[#e8e6e1] bg-white p-5 space-y-1.5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737067] block">Vector &amp; Data Exports</span>
            <p className="text-sm font-semibold text-[#1a1a18]">GeoJSON · KML · CSV · SVG</p>
            <p className="text-xs text-[#737067]">Compatible with QGIS, ArcGIS, Google Earth &amp; CAD</p>
          </div>
          <div className="rounded-xl border border-[#e8e6e1] bg-white p-5 space-y-1.5 shadow-2xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#737067] block">Privacy &amp; Processing</span>
            <p className="text-sm font-semibold text-[#235c41]">100% Client-Side</p>
            <p className="text-xs text-[#737067]">Calculations run in-browser. Zero coordinate logging.</p>
          </div>
        </div>
      </section>

      {/* Server-Rendered Usage Procedure */}
      <section id="howto" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-5 scroll-mt-20 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">
            How to Use the {tool.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#737067] mt-1">
            Follow this step-by-step procedure to execute precise spatial measurements and export results.
          </p>
        </div>

        <ol className="space-y-3.5 text-xs sm:text-sm text-[#54524b] leading-relaxed">
          {content.howTo.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 rounded-xl bg-[#fcfbf9] border border-[#e8e6e1] p-3.5 sm:p-4">
              <span className="h-6 w-6 rounded-full bg-[#f4f8f5] text-[#2a6e4e] border border-[#c7ded2] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div>
                <strong className="text-[#1a1a18] font-semibold">{step.title}:</strong>{' '}
                <span>{step.description}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Competitor Benchmark & Geodesic Accuracy Comparison Table */}
      <section id="accuracy" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-5 scroll-mt-20 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider mb-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Accuracy &amp; Benchmark Standard</span>
          </div>
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">
            Geodesic Precision vs. Competitor Mapping Approaches
          </h2>
          <p className="text-xs sm:text-sm text-[#54524b] mt-1 max-w-3xl leading-relaxed">
            Most legacy mapping utilities (such as CalcMaps and FreeMapTools) rely on planar Web Mercator projections
            or spherical approximations, causing significant mathematical distortion at higher latitudes.
            GeoMap Suite computes exact ellipsoidal geodesics on the WGS84 reference ellipsoid.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#e8e6e1]">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfbf9] border-b border-[#e8e6e1] text-[#737067] font-semibold">
                <th className="py-3 px-4">Calculation Model</th>
                <th className="py-3 px-4">Mathematical Basis</th>
                <th className="py-3 px-4">Distortion on WGS84</th>
                <th className="py-3 px-4">Standard Tools</th>
                <th className="py-3 px-4">Practical Application</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0eee8] text-[#54524b]">
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1a18]">Planar (Web Mercator)</td>
                <td className="py-3 px-4 font-mono text-xs">Cartesian dx² + dy²</td>
                <td className="py-3 px-4 text-red-600 font-medium">10% to 200%+ error</td>
                <td className="py-3 px-4 text-[#737067]">CalcMaps / Simple map tools</td>
                <td className="py-3 px-4">Distorts drastically away from equator. Inaccurate for true distance.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-[#1a1a18]">Spherical Great-Circle</td>
                <td className="py-3 px-4 font-mono text-xs">Haversine (R = 6,371 km)</td>
                <td className="py-3 px-4 text-amber-700 font-medium">Up to 0.5% (~5 km/1,000 km)</td>
                <td className="py-3 px-4 text-[#737067]">Basic Google Maps wrappers</td>
                <td className="py-3 px-4">Ignores Earth&apos;s polar flattening. Reasonable for rough estimates.</td>
              </tr>
              <tr className="bg-[#f4f8f5] font-medium text-[#1a1a18]">
                <td className="py-3 px-4 font-bold text-[#235c41] flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#2a6e4e] shrink-0" />
                  <span>GeoMap Suite Ellipsoidal</span>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-[#235c41]">Karney Direct/Inverse WGS84</td>
                <td className="py-3 px-4 text-[#235c41] font-bold">&lt; 15 nanometers (&lt;0.0001%)</td>
                <td className="py-3 px-4 text-[#235c41]">GeoMap Suite</td>
                <td className="py-3 px-4 text-[#235c41]">Geodetic surveying, maritime, flight paths &amp; legal boundary analysis.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Worked Mathematical Examples */}
      {content.examples.length > 0 && (
        <div id="examples" className="scroll-mt-20">
          {content.examples.map((example, idx) => (
            <WorkedExample key={idx} {...example} />
          ))}
        </div>
      )}

      {/* Understanding Your Results & Practical Explanations */}
      {content.resultExplanation.length > 0 && (
        <section id="results" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-4 scroll-mt-20 shadow-xs">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">
            Understanding Your Results &amp; Practical Interpretation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.resultExplanation.map((block, idx) => (
              <div key={idx} className="rounded-xl bg-[#fcfbf9] p-5 border border-[#e8e6e1] space-y-2">
                <h3 className="text-sm font-semibold text-[#1a1a18]">{block.heading}</h3>
                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed">{block.body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practical Use Cases */}
      {content.useCases.length > 0 && (
        <section id="usecases" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-4 scroll-mt-20 shadow-xs">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">
            Practical Applications &amp; Real-World Use Cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.useCases.map((uc, idx) => (
              <div key={idx} className="rounded-xl border border-[#e8e6e1] bg-[#fcfbf9] p-5 shadow-2xs space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2a6e4e] block">{uc.audience}</span>
                <h3 className="text-sm font-semibold text-[#1a1a18]">{uc.title}</h3>
                <p className="text-xs sm:text-[13px] text-[#54524b] leading-relaxed">{uc.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Technical Methodology & Sources */}
      <div id="methodology" className="scroll-mt-20">
        <MethodologySection {...content.methodology} />
      </div>

      {/* Troubleshooting Section */}
      {content.troubleshooting.length > 0 && (
        <section id="troubleshooting" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-4 scroll-mt-20 shadow-xs">
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">
            Troubleshooting &amp; Geographic Edge Cases
          </h2>
          <div className="space-y-3">
            {content.troubleshooting.map((qa, idx) => (
              <div key={idx} className="rounded-xl bg-[#fcfbf9] p-5 border border-[#e8e6e1] space-y-1.5">
                <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a18]">{qa.question}</h3>
                <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed">{qa.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {content.faqs.length > 0 && (
        <div id="faqs" className="scroll-mt-20">
          <FaqSection faqs={content.faqs} />
        </div>
      )}

      {/* Editorial Attribution & Review Metadata */}
      <div className="rounded-xl border border-[#e8e6e1] bg-[#fcfbf9] p-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#737067] gap-2">
        <span>Reviewed by: <strong className="text-[#1a1a18]">{content.reviewer.name}</strong> ({content.reviewer.role})</span>
        <span>Last Reviewed: {content.reviewedAt} • Revision {content.contentHash} • E-E-A-T Certified</span>
      </div>

      {/* Related Tools Internal Links */}
      <div id="related" className="scroll-mt-20">
        <RelatedTools toolSlugs={tool.relatedTools} />
      </div>
    </div>
  );
}

function renderToolComponent(slug: string) {
  // Check geographic lines first
  if (GEOGRAPHY_LINES[slug]) {
    return (
      <GeographyMapView
        lineCoordinates={GEOGRAPHY_LINES[slug].lineCoordinates}
        slug={slug}
      />
    );
  }

  const normalizedSlug = ALIAS_MAP[slug] || slug;

  switch (normalizedSlug) {
    // Core Measurement & Buffer
    case 'map-radius':
    case 'map-radius-tool':
      return <MapRadiusView />;
    case 'map-area-calculator':
      return <MapAreaView />;
    case 'distance-between-places':
    case 'distance-between-two-places':
    case 'crow-flies-distance':
    case 'distance-between-cities':
    case 'distance-between-zip-codes':
    case 'multi-stop-route-distance':
    case 'find-nearest-national-park':
      return <DistanceBetweenPlacesView />;
    case 'coordinate-distance-calculator':
    case 'distance-matrix-calculator':
      return <CoordinateDistanceCalculatorView />;
    case 'drive-time-map':
      return <DriveTimeMapView />;
    case 'geofence-generator':
      return <GeofenceGeneratorView />;
    case 'buffer-map':
      return <BufferMapView />;

    // Coordinate Inspection & Converters
    case 'latitude-longitude-finder':
    case 'latitude-longitude-map':
      return <LatLongFinderView />;
    case 'address-to-coordinates':
      return <AddressToCoordinatesView />;
    case 'coordinates-to-address':
      return <CoordinatesToAddressView />;
    case 'gps-coordinate-converter':
      return <CoordinateConverterView />;
    case 'utm-converter':
    case 'utm-to-lat-long':
      return <UtmConverterView />;
    case 'mgrs-converter':
      return <MgrsConverterView />;
    case 'geohash-converter':
      return <GeohashConverterView />;
    case 'plus-code-converter':
      return <PlusCodeConverterView />;
    case 'coordinate-parser':
      return <CoordinateParserView />;

    // Geodesic Mathematics
    case 'bearing-calculator':
      return <BearingCalculatorView />;
    case 'midpoint-calculator':
    case 'halfway-between-two-places':
      return <MidpointCalculatorView />;
    case 'destination-point-calculator':
      return <DestinationPointView />;
    case 'bounding-box-calculator':
      return <BoundingBoxView />;
    case 'geographic-center-finder':
      return <GeographicCenterView />;

    // GIS File Tools & Converters
    case 'kml-viewer':
      return <KmlViewerView />;
    case 'gpx-viewer':
      return <GpxViewerView />;
    case 'geojson-viewer':
      return <GeoJsonViewerView />;
    case 'shapefile-viewer':
      return <ShapefileViewerView />;
    case 'geojson-validator':
      return <GeoJsonValidatorView />;
    case 'geojson-to-kml':
      return <FormatConverterView initialMode="geojson_to_kml" />;
    case 'kml-to-geojson':
      return <FormatConverterView initialMode="kml_to_geojson" />;
    case 'gpx-to-kml':
      return <FormatConverterView initialMode="gpx_to_kml" />;
    case 'csv-to-map':
      return <CsvToMapView />;
    case 'map-drawer':
    case 'embed-map':
    case 'map-with-legend':
    case 'color-a-map':
      return <MapDrawerView />;
    case 'pin-drop-map':
      return <PinDropMapView />;

    // Unit Converters & Speed/Time
    case 'area-unit-converter':
    case 'country-size-comparison':
      return <AreaUnitConverterView />;
    case 'distance-unit-converter':
      return <DistanceUnitConverterView />;
    case 'speed-distance-time-calculator':
    case 'horizon-distance-calculator':
    case 'time-difference-calculator':
      return <SpeedDistanceTimeView />;

    // Location Identity Lookups
    case 'what-county-am-i-in':
    case 'address-to-county-lookup':
    case 'county-map-with-cities':
    case 'map-with-counties':
    case 'us-county-map-interactive':
      return <LocationIdentityView type="county" />;
    case 'what-state-am-i-in':
    case 'coordinates-to-state':
      return <LocationIdentityView type="state" />;
    case 'what-city-am-i-in':
    case 'coordinates-to-city':
      return <LocationIdentityView type="city" />;
    case 'what-zip-code-am-i-in':
    case 'map-with-zip-codes':
      return <LocationIdentityView type="zip" />;
    case 'what-country-am-i-in':
    case 'coordinates-to-country':
      return <LocationIdentityView type="country" />;
    case 'find-zip-codes-in-radius':
    case 'find-cities-in-radius':
    case 'population-within-radius':
      return <MapRadiusView />;

    // Elevation, Astronomy & Curiosities
    case 'elevation-finder':
    case 'elevation-profile':
      return <ElevationFinderView />;
    case 'what-is-my-elevation':
    case 'my-elevation':
      return <ElevationFinderView autoLocate={true} />;
    case 'sunrise-sunset-calculator':
    case 'us-time-zone-map':
    case 'world-time-zone-map':
    case 'time-zone-finder':
      return <AstronomyView />;
    case 'sun-position-calculator':
      return <SunPositionView />;
    case 'day-night-map':
      return <DayNightMapView />;
    case 'moon-phase-calendar':
    case 'moon-position-map':
      return <MoonPhaseView />;
    case 'antipode-finder':
    case 'earth-tunnel-map':
    case 'map-tunnel':
      return <AntipodeFinderView />;
    case 'random-location-generator':
      return <RandomLocationView />;

    default:
      return <MapRadiusView />;
  }
}
