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
import { EquatorMapView } from '@/features/tools/geography/EquatorMapView';
import { TropicOfCancerMapView } from '@/features/tools/geography/TropicOfCancerMapView';
import { TropicOfCapricornMapView } from '@/features/tools/geography/TropicOfCapricornMapView';
import { ArcticCircleMapView } from '@/features/tools/geography/ArcticCircleMapView';
import { AntarcticCircleMapView } from '@/features/tools/geography/AntarcticCircleMapView';
import { PrimeMeridianMapView } from '@/features/tools/geography/PrimeMeridianMapView';
import { InternationalDateLineMapView } from '@/features/tools/geography/InternationalDateLineMapView';
import { GoogleMapsEmbedGeneratorView } from '@/features/tools/cartography/GoogleMapsEmbedGeneratorView';
import { MapWithLegendMakerView } from '@/features/tools/cartography/MapWithLegendMakerView';
import { UsTimeZoneMapView } from '@/features/tools/reference/UsTimeZoneMapView';
import { WorldTimeZoneMapView } from '@/features/tools/reference/WorldTimeZoneMapView';

// Dedicated Tool Interactive Feature Components
import { MapRadiusView } from '@/features/tools/radius/MapRadiusView';
import { MapAreaView } from '@/features/tools/area/MapAreaView';
import { DistanceBetweenPlacesView } from '@/features/tools/distance/DistanceBetweenPlacesView';
import { DistanceBetweenZipCodesView } from '@/features/tools/distance/DistanceBetweenZipCodesView';
import { DistanceBetweenCitiesView } from '@/features/tools/distance/DistanceBetweenCitiesView';
import { MultiStopRouteDistanceView } from '@/features/tools/distance/MultiStopRouteDistanceView';
import { DistanceMatrixView } from '@/features/tools/distance/DistanceMatrixView';
import { HorizonDistanceView } from '@/features/tools/distance/HorizonDistanceView';
import { LatLongFinderView } from '@/features/tools/coordinates/LatLongFinderView';
import { AddressToCoordinatesView } from '@/features/tools/coordinates/AddressToCoordinatesView';
import { CoordinatesToAddressView } from '@/features/tools/coordinates/CoordinatesToAddressView';
import { CoordinatesToCityView } from '@/features/tools/coordinates/CoordinatesToCityView';
import { CoordinatesToCountryView } from '@/features/tools/coordinates/CoordinatesToCountryView';
import { CoordinatesToStateView } from '@/features/tools/coordinates/CoordinatesToStateView';
import { CoordinateConverterView } from '@/features/tools/coordinates/CoordinateConverterView';
import { ElevationFinderView } from '@/features/tools/elevation/ElevationFinderView';
import { DriveTimeMapView } from '@/features/tools/isochrone/DriveTimeMapView';
import { PinDropMapView } from '@/features/tools/cartography/PinDropMapView';
import { CsvToMapView } from '@/features/tools/data/CsvToMapView';
import { FindZipCodesInRadiusView } from '@/features/tools/data/FindZipCodesInRadiusView';
import { FindCitiesInRadiusView } from '@/features/tools/data/FindCitiesInRadiusView';
import { PopulationWithinRadiusView } from '@/features/tools/data/PopulationWithinRadiusView';
import { CountyMapWithCitiesView } from '@/features/tools/data/CountyMapWithCitiesView';
import { FindNearestNationalParkView } from '@/features/tools/data/FindNearestNationalParkView';
import { MapDrawerView } from '@/features/tools/cartography/MapDrawerView';
import { ColorAMapView } from '@/features/tools/cartography/ColorAMapView';
import { CountrySizeComparisonView } from '@/features/tools/cartography/CountrySizeComparisonView';
import { MapWithCountiesView } from '@/features/tools/cartography/MapWithCountiesView';
import { MapWithZipCodesView } from '@/features/tools/cartography/MapWithZipCodesView';
import { UsCountyMapInteractiveView } from '@/features/tools/cartography/UsCountyMapInteractiveView';
import { KmlViewerView } from '@/features/tools/gis/KmlViewerView';
import { KmlEditorView } from '@/features/tools/gis/KmlEditorView';
import { KmlValidatorView } from '@/features/tools/gis/KmlValidatorView';
import { KmlToKmzView } from '@/features/tools/gis/KmlToKmzView';
import { KmzToKmlView } from '@/features/tools/gis/KmzToKmlView';
import { KmlToolsHubView } from '@/features/tools/gis/KmlToolsHubView';
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
import { TimeZoneFinderView } from '@/features/tools/reference/TimeZoneFinderView';
import { TimeDifferenceCalculatorView } from '@/features/tools/reference/TimeDifferenceCalculatorView';
import { MoonPositionMapView } from '@/features/tools/reference/MoonPositionMapView';

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
          <span>{['equator', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? 'No account or API key required' : 'Zero Sign-Up &amp; Client-Side Privacy'}</span>
          </div>
          <span className="text-[#d4d1c9]">·</span>
          <div className="inline-flex items-center gap-1.5 text-[#54524b]">
            <Globe2 className="h-3.5 w-3.5 text-[#2a6e4e]" />
          <span>{tool.slug === 'equator' ? 'Interactive 0° latitude reference' : ['tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? 'Interactive latitude-line map' : 'WGS84 Ellipsoidal Geodesics'}</span>
          </div>
        </div>

        {/* H1 Main Heading: High-Intent SERP Keywords */}
        <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-serif font-semibold tracking-tight text-[#1a1a18] leading-[1.2]">
          {tool.slug === 'equator' ? 'Interactive Equator Map at 0° Latitude' : tool.slug === 'tropic-of-cancer' ? 'Interactive Tropic of Cancer Map' : tool.slug === 'tropic-of-capricorn' ? 'Interactive Tropic of Capricorn Map' : tool.slug === 'arctic-circle' ? 'Interactive Arctic Circle Map' : tool.slug === 'antarctic-circle' ? 'Interactive Antarctic Circle Map at 66.56° S' : tool.name}
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
          <a href="#accuracy" className="px-3 py-1.5 rounded-lg bg-[#fcfbf9] hover:bg-[#f7f6f2] text-[#54524b] hover:text-[#1a1a18] border border-[#e8e6e1] transition-colors">{['equator', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? 'Reference accuracy' : 'Accuracy Benchmark'}</a>
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
            {tool.slug === 'equator' ? 'Equator Map: Reference Details' : tool.slug === 'tropic-of-cancer' ? 'Tropic of Cancer Map: Reference Details' : tool.slug === 'tropic-of-capricorn' ? 'Tropic of Capricorn Map: Reference Details' : tool.slug === 'arctic-circle' ? 'Arctic Circle Map: Reference Details' : tool.slug === 'antarctic-circle' ? 'Antarctic Circle Map: Reference Details' : `${tool.shortName} Technical Specifications & Standards`}
          </h2>
          <span className="text-xs text-[#737067] font-medium hidden sm:inline">{['equator', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? 'Geographic reference' : 'Reference ISO / OGC Standard'}</span>
        </div>
        {['equator', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <SpecCard label="Map reference latitude" value={tool.slug === 'equator' ? '0°' : tool.slug === 'tropic-of-capricorn' ? '23.4364° S (approx.)' : tool.slug === 'arctic-circle' ? '66.5636° N (approx.)' : tool.slug === 'antarctic-circle' ? '66.5636° S (approx.)' : '23.4364° N (approx.)'} detail={tool.slug === 'equator' ? 'The Equator is the zero-degree parallel.' : 'A documented static cartographic reference; the astronomical line varies.'} />
          <SpecCard label="Longitude range" value="180° W to 180° E" detail="Select a longitude with the input, slider, shortcuts, or map." />
          <SpecCard label={tool.slug === 'equator' ? 'Reference circumference' : 'WGS 84 parallel length'} value={tool.slug === 'equator' ? '≈ 40,075.017 km' : ['arctic-circle', 'antarctic-circle'].includes(tool.slug) ? '≈ 15,984.2 km' : '≈ 36,788.4 km'} detail={tool.slug === 'equator' ? 'WGS 84 ellipsoid value derived using C = 2πa.' : 'Ellipsoid parallel-length calculation, not a route distance.'} />
          <SpecCard label="Map and data" value="OpenStreetMap tiles" detail="Map tiles need an internet connection; attribution appears below the map." />
        </div>
        ) : (
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
        )}
      </section>

      {/* Server-Rendered Usage Procedure */}
      <section id="howto" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-5 scroll-mt-20 shadow-xs">
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">
            How to Use the {tool.name}
          </h2>
          <p className="text-xs sm:text-sm text-[#737067] mt-1">
            {['equator', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? `Use this free ${tool.name} map to explore longitude, coordinates, and the reference latitude line.` : 'Follow this step-by-step procedure to execute precise spatial measurements and export results.'}
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
      {['equator', 'tropic-of-cancer', 'tropic-of-capricorn', 'arctic-circle', 'antarctic-circle'].includes(tool.slug) ? (
      <section id="accuracy" className="rounded-2xl border border-[#e8e6e1] bg-white p-6 sm:p-8 space-y-3 scroll-mt-20 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>{tool.slug === 'equator' ? 'Equator reference and map accuracy' : tool.slug === 'tropic-of-cancer' ? 'Tropic of Cancer reference and map accuracy' : tool.slug === 'tropic-of-capricorn' ? 'Tropic of Capricorn reference and map accuracy' : tool.slug === 'arctic-circle' ? 'Arctic Circle reference and map accuracy' : 'Antarctic Circle reference and map accuracy'}</span>
        </div>
        <h2 className="text-lg sm:text-xl font-serif font-semibold text-[#1a1a18]">{tool.slug === 'equator' ? 'A map reference for 0° latitude' : tool.slug === 'tropic-of-cancer' ? 'An approximate reference for the northern tropic' : tool.slug === 'tropic-of-capricorn' ? 'An approximate reference for the southern tropic' : tool.slug === 'arctic-circle' ? 'An approximate Arctic Circle reference' : 'An approximate Antarctic Circle reference'}</h2>
        <p className="text-sm text-[#54524b] leading-relaxed">
          {tool.slug === 'equator' ? 'The Equator is the zero-degree parallel: every point on the line has latitude 0°. The circumference shown here is derived from the WGS 84 ellipsoid semi-major axis (a = 6,378,137 m) using C = 2πa, then rounded to 0.001 km.' : tool.slug === 'tropic-of-cancer' ? 'This map uses 23.4364° N as a fixed cartographic reference for the Tropic of Cancer. The astronomical tropic follows changes in Earth’s axial tilt, so this is not a date-specific solar calculation. Its WGS 84 parallel length is a model-derived reference, not a ground-route measurement.' : tool.slug === 'tropic-of-capricorn' ? 'This map uses 23.4364° S as a fixed cartographic reference for the Tropic of Capricorn. The astronomical tropic follows changes in Earth’s axial tilt, so this is not a date-specific solar calculation. Its WGS 84 parallel length is a model-derived reference, not a ground-route measurement.' : tool.slug === 'arctic-circle' ? 'This map uses 66.5636° N as a fixed cartographic reference for the Arctic Circle. Its astronomical latitude follows changes in Earth’s axial tilt, so this is not an epoch-specific polar-circle calculation. The WGS 84 parallel length is a model-derived reference, not a ground-route measurement.' : 'This map uses 66.5636° S as a fixed cartographic reference for the Antarctic Circle. Its astronomical latitude follows changes in Earth’s axial tilt, so this is not an epoch-specific polar-circle calculation. The WGS 84 parallel length is a model-derived reference, not a ground-route measurement. The Antarctic Treaty area begins farther north at 60° S and is not the circle shown here.'} The displayed line and basemap are for geographic reference, not surveying or legal boundary work.
        </p>
      </section>
      ) : (
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
      )}

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
        <span>Last Reviewed: {content.reviewedAt} • Revision {content.contentHash}</span>
      </div>

      {/* Related Tools Internal Links */}
      <div id="related" className="scroll-mt-20">
        <RelatedTools toolSlugs={tool.relatedTools} />
      </div>
    </div>
  );
}

function SpecCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-xl border border-[#e8e6e1] bg-white p-5 space-y-1.5 shadow-2xs">
      <span className="text-[11px] font-bold uppercase tracking-wider text-[#737067] block">{label}</span>
      <p className="text-sm font-semibold text-[#1a1a18]">{value}</p>
      <p className="text-xs text-[#737067]">{detail}</p>
    </div>
  );
}

function renderToolComponent(slug: string) {
  if (slug === 'equator') return <EquatorMapView />;
  if (slug === 'tropic-of-cancer') return <TropicOfCancerMapView />;
  if (slug === 'tropic-of-capricorn') return <TropicOfCapricornMapView />;
  if (slug === 'arctic-circle') return <ArcticCircleMapView />;
  if (slug === 'antarctic-circle') return <AntarcticCircleMapView />;
  if (slug === 'prime-meridian') return <PrimeMeridianMapView />;
  if (slug === 'international-date-line') return <InternationalDateLineMapView />;
  if (slug === 'google-maps-embed-code-generator') return <GoogleMapsEmbedGeneratorView />;
  if (slug === 'map-with-legend-maker') return <MapWithLegendMakerView />;
  if (slug === 'us-time-zone-map') return <UsTimeZoneMapView />;
  if (slug === 'world-time-zone-map') return <WorldTimeZoneMapView />;

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
      return <DistanceBetweenPlacesView />;
    case 'distance-between-zip-codes':
      return <DistanceBetweenZipCodesView />;
    case 'distance-between-cities':
      return <DistanceBetweenCitiesView />;
    case 'multi-stop-route-distance':
      return <MultiStopRouteDistanceView />;
    case 'distance-matrix-calculator':
      return <DistanceMatrixView />;
    case 'horizon-distance-calculator':
      return <HorizonDistanceView />;
    case 'coordinate-distance-calculator':
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
    case 'coordinates-to-city':
      return <CoordinatesToCityView />;
    case 'coordinates-to-country':
      return <CoordinatesToCountryView />;
    case 'coordinates-to-state':
      return <CoordinatesToStateView />;
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
    case 'kml-to-csv':
      return <FormatConverterView initialMode="kml_to_csv" />;
    case 'kml-to-gpx':
      return <FormatConverterView initialMode="kml_to_gpx" />;
    case 'kml-editor':
      return <KmlEditorView />;
    case 'kml-validator':
      return <KmlValidatorView />;
    case 'kml-to-kmz':
      return <KmlToKmzView />;
    case 'kmz-to-kml':
      return <KmzToKmlView />;
    case 'kml-tools':
      return <KmlToolsHubView />;
    case 'csv-to-map':
      return <CsvToMapView />;
    case 'map-drawer':
    case 'embed-map':
    case 'map-with-legend':
      return <MapDrawerView />;
    case 'color-a-map':
      return <ColorAMapView />;
    case 'country-size-comparison':
      return <CountrySizeComparisonView />;
    case 'map-with-counties':
      return <MapWithCountiesView />;
    case 'map-with-zip-codes':
      return <MapWithZipCodesView />;
    case 'us-county-map-interactive':
      return <UsCountyMapInteractiveView />;
    case 'pin-drop-map':
      return <PinDropMapView />;

    // Unit Converters & Speed/Time
    case 'area-unit-converter':
      return <AreaUnitConverterView />;
    case 'distance-unit-converter':
      return <DistanceUnitConverterView />;
    case 'speed-distance-time-calculator':
      return <SpeedDistanceTimeView />;
    case 'time-difference-calculator':
      return <TimeDifferenceCalculatorView />;

    // Location Identity Lookups
    case 'what-county-am-i-in':
    case 'address-to-county-lookup':
      return <LocationIdentityView type="county" />;
    case 'county-map-with-cities':
      return <CountyMapWithCitiesView />;
    case 'what-state-am-i-in':
      return <LocationIdentityView type="state" />;
    case 'what-city-am-i-in':
      return <LocationIdentityView type="city" />;
    case 'what-zip-code-am-i-in':
      return <LocationIdentityView type="zip" />;
    case 'what-country-am-i-in':
      return <LocationIdentityView type="country" />;
    case 'find-zip-codes-in-radius':
      return <FindZipCodesInRadiusView />;
    case 'find-cities-in-radius':
      return <FindCitiesInRadiusView />;
    case 'population-within-radius':
      return <PopulationWithinRadiusView />;
    case 'find-nearest-national-park':
      return <FindNearestNationalParkView />;

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
      return <AstronomyView />;
    case 'time-zone-finder':
      return <TimeZoneFinderView />;
    case 'sun-position-calculator':
      return <SunPositionView />;
    case 'day-night-map':
      return <DayNightMapView />;
    case 'moon-phase-calendar':
      return <MoonPhaseView />;
    case 'moon-position-map':
      return <MoonPositionMapView />;
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
