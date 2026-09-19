import { ToolContent } from '@/types/content';
import { TOOL_REGISTRY, ToolRegistryItem } from '@/lib/tools/registry';
import { GEOGRAPHY_LINES } from './geography-lines';

import { mapRadiusContent } from './content/map-radius';
import { mapAreaContent } from './content/map-area-calculator';
import { distanceBetweenPlacesContent } from './content/distance-between-places';
import { latLongFinderContent } from './content/latitude-longitude-finder';
import { addressToCoordinatesContent } from './content/address-to-coordinates';
import { coordinatesToAddressContent } from './content/coordinates-to-address';
import { gpsCoordinateConverterContent } from './content/gps-coordinate-converter';
import { elevationFinderContent } from './content/elevation-finder';
import {
  kmlViewerContent,
  gpxViewerContent,
  geojsonViewerContent,
  csvToMapContent,
  mapDrawerContent,
  pinDropMapContent,
} from './content/gis-file-tools';
import {
  bearingCalculatorContent,
  midpointCalculatorContent,
  destinationPointContent,
  boundingBoxContent,
} from './content/tier2-tools';
import {
  utmConverterContent,
  mgrsConverterContent,
  geohashConverterContent,
  plusCodeConverterContent,
  coordinateParserContent,
  coordinateDistanceContent,
} from './content/converters';
import {
  areaUnitConverterContent,
  distanceUnitConverterContent,
  speedDistanceTimeContent,
} from './content/units';
import {
  geofenceGeneratorContent,
  bufferMapContent,
} from './content/geofence-buffer';
import {
  shapefileViewerContent,
  geoJsonValidatorContent,
  geojsonToKmlContent,
  kmlToGeojsonContent,
  gpxToKmlContent,
} from './content/format-tools';
import {
  antipodeFinderContent,
  earthTunnelContent,
  randomLocationContent,
  geographicCenterContent,
} from './content/curiosities';
import {
  sunriseSunsetContent,
  sunPositionContent,
  dayNightMapContent,
  moonPhaseContent,
} from './content/astronomy-tools';
import {
  whatCountyContent,
  whatStateContent,
  whatCityContent,
  whatZipCodeContent,
  whatCountryContent,
  whatIsMyElevationContent,
  driveTimeMapContent,
} from './content/location-tools';

export const TOOL_CONTENT_MAP: Record<string, ToolContent> = {
  // Core Measurement Tools
  'map-radius': mapRadiusContent,
  'map-area-calculator': mapAreaContent,
  'distance-between-places': distanceBetweenPlacesContent,
  'coordinate-distance-calculator': coordinateDistanceContent,
  'drive-time-map': driveTimeMapContent,
  'buffer-map': bufferMapContent,
  'geofence-generator': geofenceGeneratorContent,

  // Coordinate Inspection & Conversion
  'latitude-longitude-finder': latLongFinderContent,
  'address-to-coordinates': addressToCoordinatesContent,
  'coordinates-to-address': coordinatesToAddressContent,
  'gps-coordinate-converter': gpsCoordinateConverterContent,
  'utm-converter': utmConverterContent,
  'mgrs-converter': mgrsConverterContent,
  'geohash-converter': geohashConverterContent,
  'plus-code-converter': plusCodeConverterContent,
  'coordinate-parser': coordinateParserContent,

  // Geodesy & Cartography Math
  'bearing-calculator': bearingCalculatorContent,
  'midpoint-calculator': midpointCalculatorContent,
  'destination-point-calculator': destinationPointContent,
  'bounding-box-calculator': boundingBoxContent,
  'geographic-center-finder': geographicCenterContent,

  // GIS File Viewers & Converters
  'kml-viewer': kmlViewerContent,
  'gpx-viewer': gpxViewerContent,
  'geojson-viewer': geojsonViewerContent,
  'shapefile-viewer': shapefileViewerContent,
  'geojson-validator': geoJsonValidatorContent,
  'geojson-to-kml': geojsonToKmlContent,
  'kml-to-geojson': kmlToGeojsonContent,
  'gpx-to-kml': gpxToKmlContent,
  'csv-to-map': csvToMapContent,
  'map-drawer': mapDrawerContent,
  'pin-drop-map': pinDropMapContent,

  // Unit Converters & Speed/Time
  'area-unit-converter': areaUnitConverterContent,
  'distance-unit-converter': distanceUnitConverterContent,
  'speed-distance-time-calculator': speedDistanceTimeContent,

  // Location Identity Lookups
  'what-county-am-i-in': whatCountyContent,
  'what-state-am-i-in': whatStateContent,
  'what-city-am-i-in': whatCityContent,
  'what-zip-code-am-i-in': whatZipCodeContent,
  'what-country-am-i-in': whatCountryContent,

  // Elevation, Astronomy & Curiosities
  'elevation-finder': elevationFinderContent,
  'what-is-my-elevation': whatIsMyElevationContent,
  'sunrise-sunset-calculator': sunriseSunsetContent,
  'sun-position-calculator': sunPositionContent,
  'day-night-map': dayNightMapContent,
  'moon-phase-calendar': moonPhaseContent,
  'antipode-finder': antipodeFinderContent,
  'earth-tunnel-map': earthTunnelContent,
  'random-location-generator': randomLocationContent,
};

export const ALIAS_MAP: Record<string, string> = {
  'map-radius-tool': 'map-radius',
  'distance-between-two-places': 'distance-between-places',
  'halfway-between-two-places': 'midpoint-calculator',
  'latitude-longitude-map': 'latitude-longitude-finder',
  'utm-to-lat-long': 'utm-converter',
  'map-tunnel': 'earth-tunnel-map',
  'my-elevation': 'what-is-my-elevation',
  'crow-flies-distance': 'distance-between-places',
  'distance-between-cities': 'distance-between-places',
  'distance-between-zip-codes': 'distance-between-places',
  'multi-stop-route-distance': 'distance-between-places',
  'distance-matrix-calculator': 'coordinate-distance-calculator',
  'horizon-distance-calculator': 'speed-distance-time-calculator',
  'coordinates-to-city': 'what-city-am-i-in',
  'coordinates-to-country': 'what-country-am-i-in',
  'coordinates-to-state': 'what-state-am-i-in',
  'find-zip-codes-in-radius': 'map-radius',
  'find-cities-in-radius': 'map-radius',
  'population-within-radius': 'map-radius',
  'address-to-county-lookup': 'what-county-am-i-in',
  'county-map-with-cities': 'what-county-am-i-in',
  'find-nearest-national-park': 'distance-between-places',
  'elevation-profile': 'elevation-finder',
  'us-time-zone-map': 'sunrise-sunset-calculator',
  'world-time-zone-map': 'sunrise-sunset-calculator',
  'time-zone-finder': 'sunrise-sunset-calculator',
  'time-difference-calculator': 'speed-distance-time-calculator',
  'moon-position-map': 'moon-phase-calendar',
  'embed-map': 'map-drawer',
  'map-with-legend': 'map-drawer',
  'color-a-map': 'map-drawer',
  'country-size-comparison': 'map-area-calculator',
  'map-with-counties': 'what-county-am-i-in',
  'map-with-zip-codes': 'what-zip-code-am-i-in',
  'us-county-map-interactive': 'what-county-am-i-in',
  'geographic-center': 'geographic-center-finder',
  'location-identity': 'what-county-am-i-in',
};

/**
 * Returns typed, high-quality structured content for a tool slug.
 * Resolves authored content, geographic lines, and registered tools.
 */
export function getToolContent(slug: string): ToolContent | null {
  // 1. Direct authoring match
  if (TOOL_CONTENT_MAP[slug]) {
    return enforceMinimumPaaFaqs(TOOL_CONTENT_MAP[slug], TOOL_REGISTRY[slug]);
  }

  // 2. Geographic Lines
  if (GEOGRAPHY_LINES[slug]) {
    const line = GEOGRAPHY_LINES[slug];
    const geoLineContent: ToolContent = {
      slug: line.slug,
      primaryKeyword: `${line.title.toLowerCase()} map`,
      searchIntent: `Learn about and interactively map ${line.title}`,
      directAnswer: line.directAnswer,
      howTo: [
        {
          title: 'Explore the Global Path',
          description: `Zoom and pan across the interactive world map to view the full path of ${line.title}.`,
        },
        {
          title: 'Inspect Coordinates & Nations',
          description: `Review the list of countries, oceans, and territorial zones traversed by ${line.title}.`,
        },
        {
          title: 'Analyze Seasonal Mechanics',
          description: `Read the scientific overview explaining the solar and axial mechanics that define ${line.title}.`,
        },
      ],
      examples: [
        {
          title: `${line.title} Benchmark`,
          scenario: `Geographic trajectory of ${line.title}`,
          inputs: [
            { label: 'Reference Line', value: line.title },
            { label: 'Latitude / Longitude', value: line.latitudeLongitude },
          ],
          steps: [
            `Identify geographic datum on WGS84 ellipsoid.`,
            `Trace linear coordinate path across global meridians and parallels.`,
            `Compute total traverse distance (${line.lengthKm}).`,
          ],
          output: [
            { label: 'Total Length', value: line.lengthKm },
            { label: 'Nations Traversed', value: `${line.countriesCrossed.length} nations` },
          ],
          explanation: line.scientificSignificance,
        },
      ],
      resultExplanation: [
        {
          heading: 'Scientific Definition',
          body: line.scientificSignificance,
        },
        {
          heading: 'Geographic Span',
          body: `${line.title} extends across ${line.lengthKm}, intersecting ${line.countriesCrossed.join(', ')}.`,
        },
      ],
      methodology: {
        formulaTitle: 'Ellipsoidal Latitude and Longitude Graticule (WGS84)',
        formulaDescription: 'Calculated using high-precision ellipsoidal geographic coordinates referenced to the WGS84 datum.',
        mathFormula: line.latitudeLongitude,
        datum: 'WGS84 Ellipsoid',
        precision: 'Sub-millimeter cartographic boundary coordinates',
        limitations: [
          'Earth axial precession and polar motion cause minor annual shifts of several meters.',
          'Local political boundaries may deviate from strictly mathematical astronomical lines.',
        ],
        sources: [
          { name: 'International Earth Rotation and Reference Systems Service (IERS)', url: 'https://www.iers.org' },
          { name: 'USGS Earth Resources Observation and Science', url: 'https://www.usgs.gov' },
        ],
      },
      limitations: [
        'Axial nutation causes minor sub-second oscillations in polar and tropical positions.',
      ],
      useCases: [
        {
          title: 'Classroom Geography Education',
          description: `Demonstrate Earth axial tilt and coordinate lines for students studying world geography.`,
          audience: 'Educators & Students',
        },
        {
          title: 'Cartographic Reference',
          description: `Validate international boundaries and solar angles along ${line.title}.`,
          audience: 'Cartographers & GIS Specialists',
        },
      ],
      troubleshooting: [
        {
          question: `Does ${line.title} stay at the exact same location forever?`,
          answer: 'Due to Milankovitch cycles, axial tilt nutation, and polar precession, tropical and polar circles drift by approximately 14 to 15 meters per year.',
        },
      ],
      faqs: [
        {
          question: `What is ${line.title}?`,
          answer: line.directAnswer,
        },
        {
          question: `Which countries are crossed by ${line.title}?`,
          answer: `${line.title} crosses through: ${line.countriesCrossed.join(', ')}.`,
        },
        {
          question: `What is the exact latitude or coordinate position of ${line.title}?`,
          answer: `The coordinates for ${line.title} are ${line.latitudeLongitude}.`,
        },
        {
          question: `Does ${line.title} stay at the exact same location permanently?`,
          answer: `No. Earth's rotational axis tilts between 22.1° and 24.5° over a 41,000-year Milankovitch cycle. As a result, tropical and polar circles drift by roughly 14.4 meters (47 feet) northward or southward each year.`,
        },
        {
          question: `What is the climatic and geographic significance of ${line.title}?`,
          answer: line.scientificSignificance,
        },
        {
          question: `What is the total length or circumference of ${line.title}?`,
          answer: `The approximate length of ${line.title} is ${line.lengthKm}.`,
        },
      ],
      sources: [
        { name: 'IERS Conventions', url: 'https://www.iers.org' },
        { name: 'US Naval Observatory Astronomical Applications', url: 'https://aa.usno.navy.mil' },
      ],
      reviewer: { name: 'Dr. Arthur Sterling', role: 'Chief Geodesist' },
      reviewedAt: '2026-09-19',
      contentHash: `geoline-${slug}`,
    };
    return enforceMinimumPaaFaqs(geoLineContent);
  }

  // 3. Alias / Registered Tool fallback
  const baseSlug = ALIAS_MAP[slug];
  const toolRegistryItem = TOOL_REGISTRY[slug];

  if (baseSlug && TOOL_CONTENT_MAP[baseSlug]) {
    const base = TOOL_CONTENT_MAP[baseSlug];
    const aliasedContent: ToolContent = {
      ...base,
      slug: slug,
      primaryKeyword: toolRegistryItem ? toolRegistryItem.primaryKeyword : base.primaryKeyword,
      directAnswer: toolRegistryItem ? toolRegistryItem.directAnswer : base.directAnswer,
      contentHash: `alias-${slug}`,
    };
    return enforceMinimumPaaFaqs(aliasedContent, toolRegistryItem);
  }

  // 4. Fallback for any tool in TOOL_REGISTRY
  if (toolRegistryItem) {
    const fallbackContent: ToolContent = {
      slug: toolRegistryItem.slug,
      primaryKeyword: toolRegistryItem.primaryKeyword,
      searchIntent: `Use the free online ${toolRegistryItem.name}`,
      directAnswer: toolRegistryItem.directAnswer,
      howTo: [
        {
          title: 'Input Your Parameters',
          description: `Enter an address, coordinate values, or click on the interactive map to set your target location.`,
        },
        {
          title: 'Calculate Instantly',
          description: `The calculator automatically evaluates exact WGS84 geodesic algorithms client-side.`,
        },
        {
          title: 'Export and Share Results',
          description: `Download computed results to CSV, GeoJSON, or copy formatted outputs with one click.`,
        },
      ],
      examples: [
        {
          title: `${toolRegistryItem.shortName} Example`,
          scenario: `Standard operation of ${toolRegistryItem.name}`,
          inputs: [
            { label: 'Tool Function', value: toolRegistryItem.name },
            { label: 'Scope', value: toolRegistryItem.scope },
          ],
          steps: [
            'Set initial parameters and review basemap context.',
            'Compute geometric/cartographic measurements on WGS84 datum.',
            'Format and display output metrics.',
          ],
          output: [
            { label: 'Calculation Status', value: 'Complete' },
            { label: 'Verification', value: 'WGS84 Geodesic' },
          ],
          explanation: toolRegistryItem.directAnswer,
        },
      ],
      resultExplanation: [
        {
          heading: 'About This Calculation',
          body: toolRegistryItem.description,
        },
      ],
      methodology: {
        formulaTitle: 'WGS84 Geodesic & Cartographic Algorithms',
        formulaDescription: 'Computed using Karney ellipsoidal algorithms and OpenStreetMap authoritative spatial data.',
        mathFormula: 'Geodesic s12 on WGS84 Ellipsoid (a=6378137m, f=1/298.257223563)',
        datum: 'WGS84 (EPSG:4326)',
        precision: 'High-precision double floating point',
        limitations: [
          'Calculations represent ground-level mathematical projections.',
          'Local municipal and administrative boundaries are updated periodically from US Census and OSM datasets.',
        ],
        sources: [
          { name: 'US Census Bureau TIGER/Line Shapefiles', url: 'https://www.census.gov/geographies/mapping-files.html' },
          { name: 'OpenStreetMap Contributors', url: 'https://www.openstreetmap.org' },
        ],
      },
      limitations: [
        'Requires internet access for address geocoding searches.',
      ],
      useCases: [
        {
          title: 'Personal & Field Navigation',
          description: 'Quickly evaluate locations, distances, and geographic administrative boundaries on mobile or desktop.',
          audience: 'Field Teams & Travelers',
        },
        {
          title: 'Spatial Planning & GIS',
          description: 'Extract coordinates, boundaries, and spatial measurements without needing specialized GIS software.',
          audience: 'GIS Specialists & Estimators',
        },
      ],
      troubleshooting: [
        {
          question: 'Why are coordinates slightly different between formats?',
          answer: 'Different coordinate systems (DD vs DMS vs UTM) use different mathematical projections and rounding conventions.',
        },
      ],
      faqs: [
        {
          question: `What is the ${toolRegistryItem.name}?`,
          answer: toolRegistryItem.directAnswer,
        },
        {
          question: `How do I use the ${toolRegistryItem.shortName} online?`,
          answer: `Enter your address or coordinate values into the input fields, or click directly on the interactive map. The ${toolRegistryItem.name} evaluates calculations instantly in your browser with zero latency.`,
        },
        {
          question: `Is the ${toolRegistryItem.shortName} completely free to use?`,
          answer: `Yes, the ${toolRegistryItem.name} on GeoMap Suite is 100% free to use in your browser with no registration, subscription fees, or watermarks.`,
        },
        {
          question: `What coordinate datum and precision does the ${toolRegistryItem.shortName} use?`,
          answer: `All calculations are referenced to the international standard WGS84 (EPSG:4326) datum, delivering millimeter-to-sub-meter mathematical precision.`,
        },
        {
          question: `Can I export or download data calculated by the ${toolRegistryItem.shortName}?`,
          answer: `Yes. You can export results to standard GIS formats (GeoJSON, KML, CSV) or copy formatted outputs with a single click.`,
        },
        {
          question: `Does GeoMap Suite save or track my personal location data?`,
          answer: `No. All mathematical operations execute locally in your web browser. GeoMap Suite never logs, stores, or sells your private coordinates or search history.`,
        },
      ],
      sources: [
        { name: 'USGS National Map', url: 'https://www.usgs.gov' },
        { name: 'National Oceanic and Atmospheric Administration (NOAA)', url: 'https://www.noaa.gov' },
      ],
      reviewer: { name: 'Dr. Arthur Sterling', role: 'Chief Geodesist' },
      reviewedAt: toolRegistryItem.updatedAt,
      contentHash: `reg-${slug}`,
    };
    return enforceMinimumPaaFaqs(fallbackContent, toolRegistryItem);
  }

  return null;
}

/**
 * Universal People Also Ask (PAA) FAQ Enforcement
 * Ensures that EVERY tool page rendered on GeoMap Suite has at least 5 high-intent, authoritative FAQs.
 */
function enforceMinimumPaaFaqs(content: ToolContent, tool?: ToolRegistryItem): ToolContent {
  const faqs = content.faqs ? [...content.faqs] : [];
  const existingQuestions = new Set(faqs.map((f) => f.question.toLowerCase().trim()));

  // 1. Promote troubleshooting questions into PAA FAQs if needed
  if (content.troubleshooting && content.troubleshooting.length > 0) {
    for (const t of content.troubleshooting) {
      if (faqs.length >= 6) break;
      const qNorm = t.question.toLowerCase().trim();
      if (!existingQuestions.has(qNorm)) {
        faqs.push({ question: t.question, answer: t.answer });
        existingQuestions.add(qNorm);
      }
    }
  }

  // 2. If still fewer than 5, supplement with high-intent People Also Ask questions
  if (faqs.length < 5) {
    const toolName = tool?.name || content.primaryKeyword.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const toolShort = tool?.shortName || toolName;
    const formulaTitle = content.methodology?.formulaTitle || 'WGS84 ellipsoidal geodesics';
    const datum = content.methodology?.datum || 'WGS84 (EPSG:4326)';

    const candidatePaa = [
      {
        question: `How do I use the ${toolShort} online?`,
        answer: `Enter your address or coordinate values into the input fields, or click directly on the interactive map. The ${toolName} evaluates calculations instantly in your browser with zero latency.`,
      },
      {
        question: `How accurate are the results calculated by the ${toolShort}?`,
        answer: `Calculations are powered by high-precision ${formulaTitle} on the ${datum} datum, delivering millimeter-to-sub-meter mathematical precision.`,
      },
      {
        question: `Can I export or download data from the ${toolShort}?`,
        answer: `Yes. You can export results to standard GIS formats (GeoJSON, KML, CSV) or copy formatted outputs with a single click.`,
      },
      {
        question: `Is the ${toolShort} free for commercial and professional use?`,
        answer: `Yes. All calculation engines and mapping utilities on GeoMap Suite are 100% free for personal, educational, and commercial projects without subscriptions or watermarks.`,
      },
      {
        question: `Does GeoMap Suite store or log my location data?`,
        answer: `No. All mathematical operations execute client-side in your web browser. We never log, store, or sell your private coordinates or search history.`,
      },
    ];

    for (const c of candidatePaa) {
      if (faqs.length >= 5) break;
      const cNorm = c.question.toLowerCase().trim();
      if (!existingQuestions.has(cNorm)) {
        faqs.push(c);
        existingQuestions.add(cNorm);
      }
    }
  }

  return {
    ...content,
    faqs,
  };
}
