const fs = require('fs');

const { TOOL_REGISTRY } = require('../src/lib/tools/registry.ts');

// All 68 live tools from simplemaplab.com
const liveTools = [
  // Location Tools
  { name: "What County Am I In?", href: "/tools/what-county-am-i-in", slug: "what-county-am-i-in" },
  { name: "What City Am I In?", href: "/tools/what-city-am-i-in", slug: "what-city-am-i-in" },
  { name: "What State Am I In?", href: "/tools/what-state-am-i-in", slug: "what-state-am-i-in" },
  { name: "What ZIP Code Am I In?", href: "/tools/what-zip-code-am-i-in", slug: "what-zip-code-am-i-in" },
  { name: "What Country Am I In?", href: "/tools/what-country-am-i-in", slug: "what-country-am-i-in" },

  // Measurement / Distance
  { name: "Drive Time Map", href: "/tools/drive-time-map", slug: "drive-time-map" },
  { name: "Map Radius Tool", href: "/tools/map-radius-tool", slug: "map-radius-tool" },
  { name: "Map Area Calculator", href: "/tools/map-area-calculator", slug: "map-area-calculator" },
  { name: "Distance Calculator", href: "/tools/distance-between-two-places", slug: "distance-between-two-places" },
  { name: "ZIP Code Distance", href: "/tools/distance-between-zip-codes", slug: "distance-between-zip-codes" },
  { name: "City Distance", href: "/tools/distance-between-cities", slug: "distance-between-cities" },
  { name: "Halfway Point", href: "/tools/halfway-between-two-places", slug: "halfway-between-two-places" },
  { name: "Crow Flies Distance", href: "/tools/crow-flies-distance", slug: "crow-flies-distance" },
  { name: "Multi-Stop Route Distance", href: "/tools/multi-stop-route-distance", slug: "multi-stop-route-distance" },
  { name: "Distance Matrix", href: "/tools/distance-matrix-calculator", slug: "distance-matrix-calculator" },
  { name: "Bearing Calculator", href: "/tools/bearing-calculator", slug: "bearing-calculator" },
  { name: "Horizon Distance", href: "/tools/horizon-distance-calculator", slug: "horizon-distance-calculator" },

  // Coordinates
  { name: "Address to Coordinates", href: "/tools/address-to-coordinates", slug: "address-to-coordinates" },
  { name: "Coordinates to Address", href: "/tools/coordinates-to-address", slug: "coordinates-to-address" },
  { name: "Coordinates to City", href: "/tools/coordinates-to-city", slug: "coordinates-to-city" },
  { name: "Coordinates to Country", href: "/tools/coordinates-to-country", slug: "coordinates-to-country" },
  { name: "Coordinates to State", href: "/tools/coordinates-to-state", slug: "coordinates-to-state" },
  { name: "Lat/Lng Finder", href: "/tools/latitude-longitude-finder", slug: "latitude-longitude-finder" },
  { name: "Lat/Lng Map", href: "/tools/latitude-longitude-map", slug: "latitude-longitude-map" },
  { name: "GPS Converter", href: "/tools/gps-coordinate-converter", slug: "gps-coordinate-converter" },
  { name: "UTM Converter", href: "/tools/utm-to-lat-long", slug: "utm-to-lat-long" },
  { name: "Antipode Finder", href: "/tools/antipode-finder", slug: "antipode-finder" },
  { name: "Map Tunnel", href: "/tools/map-tunnel", slug: "map-tunnel" },
  { name: "Random Location", href: "/tools/random-location-generator", slug: "random-location-generator" },
  { name: "Geographic Center", href: "/tools/geographic-center-finder", slug: "geographic-center-finder" },

  // Map Makers & Cartography
  { name: "Embed Google Maps", href: "/tools/embed-map", slug: "embed-map" },
  { name: "Map Drawer", href: "/tools/map-drawer", slug: "map-drawer" },
  { name: "Map with Legend", href: "/tools/map-with-legend", slug: "map-with-legend" },
  { name: "Color a Map", href: "/tools/color-a-map", slug: "color-a-map" },
  { name: "Country Size Comparison", href: "/tools/country-size-comparison", slug: "country-size-comparison" },
  { name: "Map with Counties", href: "/tools/map-with-counties", slug: "map-with-counties" },
  { name: "Map with ZIP Codes", href: "/tools/map-with-zip-codes", slug: "map-with-zip-codes" },
  { name: "US County Map", href: "/tools/us-county-map-interactive", slug: "us-county-map-interactive" },
  { name: "Pin Drop Map", href: "/tools/pin-drop-map", slug: "pin-drop-map" },
  { name: "CSV to Map", href: "/tools/csv-to-map", slug: "csv-to-map" },
  { name: "KML Viewer", href: "/tools/kml-viewer", slug: "kml-viewer" },
  { name: "GeoJSON Viewer", href: "/tools/geojson-viewer", slug: "geojson-viewer" },
  { name: "GPX Viewer", href: "/tools/gpx-viewer", slug: "gpx-viewer" },

  // Lookup & Data
  { name: "ZIP Codes in Radius", href: "/tools/find-zip-codes-in-radius", slug: "find-zip-codes-in-radius" },
  { name: "Cities in Radius", href: "/tools/find-cities-in-radius", slug: "find-cities-in-radius" },
  { name: "Population in Radius", href: "/tools/population-within-radius", slug: "population-within-radius" },
  { name: "Address to County", href: "/tools/address-to-county-lookup", slug: "address-to-county-lookup" },
  { name: "County Map with Cities", href: "/tools/county-map-with-cities", slug: "county-map-with-cities" },
  { name: "Nearest National Park", href: "/tools/find-nearest-national-park", slug: "find-nearest-national-park" },

  // Reference & Astronomy
  { name: "What Is My Elevation?", href: "/my-elevation", slug: "what-is-my-elevation" },
  { name: "Elevation Profile", href: "/elevation-profile", slug: "elevation-profile" },
  { name: "US Time Zone Map", href: "/us-time-zone-map", slug: "us-time-zone-map" },
  { name: "World Time Zone Map", href: "/world-time-zone-map", slug: "world-time-zone-map" },
  { name: "Elevation Finder", href: "/tools/elevation-finder", slug: "elevation-finder" },
  { name: "Time Zone Finder", href: "/tools/time-zone-finder", slug: "time-zone-finder" },
  { name: "Sunrise & Sunset", href: "/tools/sunrise-sunset-calculator", slug: "sunrise-sunset-calculator" },
  { name: "Sun Position", href: "/tools/sun-position-calculator", slug: "sun-position-calculator" },
  { name: "Time Difference", href: "/tools/time-difference-calculator", slug: "time-difference-calculator" },
  { name: "Day Night Map", href: "/tools/day-night-map", slug: "day-night-map" },
  { name: "Moon Position Map", href: "/tools/moon-position-map", slug: "moon-position-map" },
  { name: "Moon Phase Calendar", href: "/tools/moon-phase-calendar", slug: "moon-phase-calendar" },

  // Geographic Lines
  { name: "Equator", href: "/tools/equator", slug: "equator" },
  { name: "Tropic of Cancer", href: "/tools/tropic-of-cancer", slug: "tropic-of-cancer" },
  { name: "Tropic of Capricorn", href: "/tools/tropic-of-capricorn", slug: "tropic-of-capricorn" },
  { name: "Arctic Circle", href: "/tools/arctic-circle", slug: "arctic-circle" },
  { name: "Antarctic Circle", href: "/tools/antarctic-circle", slug: "antarctic-circle" },
  { name: "Prime Meridian", href: "/tools/prime-meridian", slug: "prime-meridian" },
  { name: "International Date Line", href: "/tools/international-date-line", slug: "international-date-line" }
];

console.log('Total live tools checked:', liveTools.length);
