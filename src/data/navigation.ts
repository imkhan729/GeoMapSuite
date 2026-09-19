export interface NavToolItem {
  name: string;
  href: string;
  badge?: string;
  scope?: 'us-only' | 'worldwide';
}

export interface NavToolCategory {
  label: string;
  tools: NavToolItem[];
}

export interface NavMapItem {
  name: string;
  href: string;
  all?: boolean;
}

export interface NavMapCategory {
  label: string;
  maps: NavMapItem[];
}

export const TOOLS_MENU: NavToolCategory[] = [
  {
    label: "Location",
    tools: [
      { name: "What County Am I In?", href: "/tools/what-county-am-i-in", scope: "us-only" },
      { name: "What City Am I In?", href: "/tools/what-city-am-i-in", scope: "worldwide" },
      { name: "What State Am I In?", href: "/tools/what-state-am-i-in", scope: "us-only" },
      { name: "What ZIP Code Am I In?", href: "/tools/what-zip-code-am-i-in", scope: "us-only" },
      { name: "What Country Am I In?", href: "/tools/what-country-am-i-in", scope: "worldwide" },
    ],
  },
  {
    label: "Distance",
    tools: [
      { name: "Drive Time Map", href: "/tools/drive-time-map", scope: "worldwide" },
      { name: "Map Radius Tool", href: "/tools/map-radius-tool", scope: "worldwide" },
      { name: "Map Area Calculator", href: "/tools/map-area-calculator", scope: "worldwide" },
      { name: "Distance Calculator", href: "/tools/distance-between-two-places", scope: "worldwide" },
      { name: "ZIP Code Distance", href: "/tools/distance-between-zip-codes", scope: "us-only" },
      { name: "City Distance", href: "/tools/distance-between-cities", scope: "us-only" },
      { name: "Halfway Point", href: "/tools/halfway-between-two-places", scope: "worldwide" },
      { name: "Crow Flies Distance", href: "/tools/crow-flies-distance", scope: "worldwide" },
      { name: "Multi-Stop Route Distance", href: "/tools/multi-stop-route-distance", scope: "worldwide" },
      { name: "Distance Matrix", href: "/tools/distance-matrix-calculator", scope: "worldwide" },
      { name: "Horizon Distance", href: "/tools/horizon-distance-calculator", scope: "worldwide" },
    ],
  },
  {
    label: "Lookup",
    tools: [
      { name: "ZIP Codes in Radius", href: "/tools/find-zip-codes-in-radius", scope: "us-only" },
      { name: "Cities in Radius", href: "/tools/find-cities-in-radius", scope: "us-only" },
      { name: "Population in Radius", href: "/tools/population-within-radius", scope: "us-only" },
      { name: "Address to County", href: "/tools/address-to-county-lookup", scope: "us-only" },
      { name: "County Map with Cities", href: "/tools/county-map-with-cities", scope: "us-only" },
      { name: "Nearest National Park", href: "/tools/find-nearest-national-park", scope: "us-only" },
      { name: "Sunrise & Sunset", href: "/tools/sunrise-sunset-calculator", scope: "worldwide" },
      { name: "Sun Position", href: "/tools/sun-position-calculator", scope: "worldwide" },
      { name: "Day Night Map", href: "/tools/day-night-map", scope: "worldwide" },
      { name: "Moon Position Map", href: "/tools/moon-position-map", scope: "worldwide" },
      { name: "Moon Phase Calendar", href: "/tools/moon-phase-calendar", scope: "worldwide" },
      { name: "Time Difference", href: "/tools/time-difference-calculator", scope: "worldwide" },
      { name: "Random Location", href: "/tools/random-location-generator", scope: "worldwide" },
    ],
  },
  {
    label: "Coordinates",
    tools: [
      { name: "Address to Coordinates", href: "/tools/address-to-coordinates", scope: "worldwide" },
      { name: "Coordinates to Address", href: "/tools/coordinates-to-address", scope: "worldwide" },
      { name: "Coordinates to City", href: "/tools/coordinates-to-city", scope: "worldwide" },
      { name: "Coordinates to Country", href: "/tools/coordinates-to-country", scope: "worldwide" },
      { name: "Coordinates to State", href: "/tools/coordinates-to-state", scope: "us-only" },
      { name: "Lat/Lng Finder", href: "/tools/latitude-longitude-finder", scope: "worldwide" },
      { name: "Lat/Lng Map", href: "/tools/latitude-longitude-map", scope: "worldwide" },
      { name: "GPS Converter", href: "/tools/gps-coordinate-converter", scope: "worldwide" },
      { name: "UTM Converter", href: "/tools/utm-to-lat-long", scope: "worldwide" },
      { name: "Elevation Finder", href: "/tools/elevation-finder", scope: "worldwide" },
      { name: "What Is My Elevation?", href: "/my-elevation", scope: "worldwide" },
      { name: "Elevation Profile", href: "/elevation-profile", scope: "worldwide" },
      { name: "Time Zone Finder", href: "/tools/time-zone-finder", scope: "worldwide" },
      { name: "US Time Zone Map", href: "/us-time-zone-map", scope: "us-only" },
      { name: "World Time Zone Map", href: "/world-time-zone-map", scope: "worldwide" },
      { name: "Bearing Calculator", href: "/tools/bearing-calculator", scope: "worldwide" },
      { name: "Antipode Finder", href: "/tools/antipode-finder", scope: "worldwide" },
      { name: "Map Tunnel", href: "/tools/map-tunnel", scope: "worldwide" },
      { name: "Geographic Center", href: "/tools/geographic-center-finder", scope: "worldwide" },
    ],
  },
  {
    label: "Map Makers",
    tools: [
      { name: "Embed Google Maps", href: "/tools/embed-map", scope: "worldwide" },
      { name: "Map Drawer", href: "/tools/map-drawer", scope: "worldwide" },
      { name: "Map with Legend", href: "/tools/map-with-legend", scope: "worldwide" },
      { name: "Color a Map", href: "/tools/color-a-map", scope: "worldwide" },
      { name: "Country Size Comparison", href: "/tools/country-size-comparison", scope: "worldwide" },
      { name: "Map with Counties", href: "/tools/map-with-counties", scope: "us-only" },
      { name: "Map with ZIP Codes", href: "/tools/map-with-zip-codes", scope: "us-only" },
      { name: "US County Map", href: "/tools/us-county-map-interactive", scope: "us-only" },
      { name: "Pin Drop Map", href: "/tools/pin-drop-map", scope: "worldwide" },
      { name: "CSV to Map", href: "/tools/csv-to-map", scope: "worldwide" },
      { name: "KML Viewer", href: "/tools/kml-viewer", scope: "worldwide" },
      { name: "GeoJSON Viewer", href: "/tools/geojson-viewer", scope: "worldwide" },
      { name: "GPX Viewer", href: "/tools/gpx-viewer", scope: "worldwide" },
    ],
  },
  {
    label: "Geographic Lines",
    tools: [
      { name: "Equator", href: "/tools/equator", scope: "worldwide" },
      { name: "Tropic of Cancer", href: "/tools/tropic-of-cancer", scope: "worldwide" },
      { name: "Tropic of Capricorn", href: "/tools/tropic-of-capricorn", scope: "worldwide" },
      { name: "Arctic Circle", href: "/tools/arctic-circle", scope: "worldwide" },
      { name: "Antarctic Circle", href: "/tools/antarctic-circle", scope: "worldwide" },
      { name: "Prime Meridian", href: "/tools/prime-meridian", scope: "worldwide" },
      { name: "International Date Line", href: "/tools/international-date-line", scope: "worldwide" },
    ],
  },
];

export const MAPS_MENU: NavMapCategory[] = [
  {
    label: "US States",
    maps: [
      { name: "United States", href: "/maps/blank/united-states" },
      { name: "California", href: "/maps/blank/california" },
      { name: "Texas", href: "/maps/blank/texas" },
      { name: "Florida", href: "/maps/blank/florida" },
      { name: "New York", href: "/maps/blank/new-york" },
      { name: "All 51 state maps", href: "/maps/blank", all: true },
    ],
  },
  {
    label: "US Counties",
    maps: [
      { name: "California Counties", href: "/states/california/counties" },
      { name: "Texas Counties", href: "/states/texas/counties" },
      { name: "Florida Counties", href: "/states/florida/counties" },
      { name: "New York Counties", href: "/states/new-york/counties" },
      { name: "Pennsylvania Counties", href: "/states/pennsylvania/counties" },
      { name: "Counties by state", href: "/states", all: true },
    ],
  },
  {
    label: "Continents",
    maps: [
      { name: "World", href: "/maps/blank/world" },
      { name: "Europe", href: "/maps/blank/europe" },
      { name: "Asia", href: "/maps/blank/asia" },
      { name: "Africa", href: "/maps/blank/africa" },
      { name: "North America", href: "/maps/blank/north-america" },
      { name: "South America", href: "/maps/blank/south-america" },
      { name: "Oceania", href: "/maps/blank/oceania" },
    ],
  },
  {
    label: "Countries",
    maps: [
      { name: "France", href: "/maps/blank/france" },
      { name: "Germany", href: "/maps/blank/germany" },
      { name: "Japan", href: "/maps/blank/japan" },
      { name: "United Kingdom", href: "/maps/blank/united-kingdom" },
      { name: "India", href: "/maps/blank/india" },
      { name: "Australia", href: "/maps/blank/australia" },
      { name: "Brazil", href: "/maps/blank/brazil" },
      { name: "Russia", href: "/maps/blank/russia" },
    ],
  },
];
