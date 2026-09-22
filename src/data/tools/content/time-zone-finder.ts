import { ToolContent } from '@/types/content';

export const timeZoneFinderContent: ToolContent = {
  slug: 'time-zone-finder',
  primaryKeyword: 'time zone finder',
  searchIntent: 'Users want to find the exact IANA time zone, UTC offset, DST status, and current local time for any address, city, or GPS coordinates.',
  directAnswer:
    'Enter any city name, street address, or ZIP code — or click anywhere on the map — to instantly get the IANA time zone identifier (e.g. America/New_York), current UTC offset, abbreviation (EDT/PST), Daylight Saving Time status, and a live local clock that updates every second.',

  howTo: [
    {
      title: 'Search by city or address',
      description:
        'Type any city name, postal address, airport code, or landmark in the search bar and press Search. The tool geocodes the location and queries its IANA time zone from the Open-Meteo free API.',
    },
    {
      title: 'Use your GPS location',
      description:
        'Click "Use My GPS" to automatically detect your device\'s position and display your local time zone, offset, and DST status in real time.',
    },
    {
      title: 'Click anywhere on the map',
      description:
        'Click any point on the interactive globe to resolve the time zone for that exact latitude/longitude pair. Useful for remote locations, mid-ocean points, or disputed territories.',
    },
    {
      title: 'Compare two time zones',
      description:
        'Switch to the "Compare Two Zones" tab, choose two cities from the preset list, and instantly see the time difference in hours and minutes plus the business-hours overlap window.',
    },
    {
      title: 'View the live World Clock',
      description:
        'Switch to the "World Clock" tab to see the current local time in 30 major cities across all continents. Times update every second. Click any city to open it in the finder.',
    },
  ],

  examples: [
    {
      title: 'Find time zone for Tokyo, Japan',
      scenario: 'A remote team in New York wants to schedule a video call with a partner in Tokyo.',
      inputs: [
        { label: 'City', value: 'Tokyo, Japan' },
        { label: 'Tool', value: 'Time Zone Finder → Search' },
      ],
      steps: [
        'Type "Tokyo, Japan" in the search bar and press Search.',
        'Select "Tokyo, Japan" from the autocomplete results.',
        'The result card shows: IANA ID = Asia/Tokyo, UTC Offset = UTC+9:00, Abbreviation = JST, DST = No.',
        'The live clock shows the current local time in Tokyo.',
      ],
      output: [
        { label: 'IANA Time Zone', value: 'Asia/Tokyo' },
        { label: 'Common Name',   value: 'Japan Standard Time' },
        { label: 'UTC Offset',    value: 'UTC+9:00' },
        { label: 'Abbreviation',  value: 'JST' },
        { label: 'DST Active',    value: 'No — Japan does not observe DST' },
      ],
      explanation:
        'Japan Standard Time (JST) is permanently at UTC+9. Japan abolished Daylight Saving Time after World War II and has not reinstated it, so JST never changes.',
    },
    {
      title: 'Compare New York and London business hours',
      scenario: 'A UK startup needs to find overlapping business hours with a US client in New York.',
      inputs: [
        { label: 'Location A', value: 'New York, USA (America/New_York)' },
        { label: 'Location B', value: 'London, UK (Europe/London)' },
      ],
      steps: [
        'Switch to the "Compare Two Zones" tab.',
        'Set Location A to "New York, USA" and Location B to "London, UK".',
        'During BST (summer): London is UTC+1, New York EDT is UTC-4 → difference = +5h.',
        'Business hours overlap: 9 AM–5 PM NYC is 2 PM–10 PM London; 9 AM–5 PM London is 4 AM–12 PM NYC.',
        'Overlap window: 9 AM–12 PM NYC / 2 PM–5 PM London.',
      ],
      output: [
        { label: 'Time Difference (BST)',     value: '+5 hours' },
        { label: 'Time Difference (GMT/EST)', value: '+5 hours' },
        { label: 'Business Overlap',          value: '9:00–12:00 NYC / 14:00–17:00 London' },
      ],
      explanation:
        'The Eastern US is always 5 hours behind the UK in winter (EST vs GMT) and also 5 hours behind in summer (EDT vs BST) because both zones shift clocks simultaneously in late autumn and early spring.',
    },
    {
      title: 'Find time zone for a remote GPS coordinate',
      scenario: 'An oceanographer needs to convert logged UTC timestamps from an instrument buoy at 35°N 160°E to local time.',
      inputs: [
        { label: 'Latitude',  value: '35.0000° N' },
        { label: 'Longitude', value: '160.0000° E' },
        { label: 'Method',    value: 'Click on map' },
      ],
      steps: [
        'Click the map near 35°N 160°E in the central Pacific Ocean.',
        'The tool sends those coordinates to Open-Meteo to resolve the IANA zone.',
        'Result: the point falls in international waters, returning the nominal zone.',
        'Apply the UTC offset to convert logged timestamps.',
      ],
      output: [
        { label: 'Approximate Zone', value: 'Etc/GMT-10 or Pacific/Honolulu area' },
        { label: 'UTC Offset',       value: 'UTC+10:00 (nominal)' },
      ],
      explanation:
        'Open ocean areas outside territorial waters do not have official time zones. The Open-Meteo API returns the geographically nearest mainland zone, which serves as a practical approximation.',
    },
  ],

  methodology: {
    formulaTitle: 'UTC Offset Derivation via Intl APIs',
    formulaDescription:
      'The UTC offset is derived by comparing the wall-clock time reported by `Intl.DateTimeFormat` for the target IANA zone against the UTC timestamp.',
    mathFormula: 'UTC offset (min) = local_wall_clock_UTC_epoch − actual_UTC_epoch',
    datum: 'IANA Time Zone Database (TZDB), updated at least twice per year by IANA. Browser implementations (V8, SpiderMonkey, JavaScriptCore) bundle a copy of TZDB and update it with browser releases.',
    precision:
      'UTC offsets are exact to the minute (some historical time zones had half-minute offsets; modern zones use whole minutes or 30/45-minute steps). DST transitions are accurate to the second according to TZDB rules.',
    limitations: [
      'IANA zone resolution from raw coordinates requires a server-side database or external API call. This tool uses the Open-Meteo free API, which may occasionally return a neighbouring zone for locations near boundaries.',
      'Historical time zone data before 1970 may be incomplete or approximate in some browser TZDB implementations.',
      'DST rules change by government decree, sometimes with short notice. The browser\'s TZDB may lag behind very recent changes until the next browser update.',
      'Ocean and Antarctic coordinates have no official civilian time zone; the tool returns the nearest landmass zone as an approximation.',
    ],
    sources: [
      { name: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
      { name: 'Open-Meteo Forecast API (free, no auth)', url: 'https://open-meteo.com/en/docs' },
      { name: 'ECMAScript Internationalization API (Intl)', url: 'https://tc39.es/ecma402/' },
      { name: 'Photon Komoot Geocoding API', url: 'https://photon.komoot.io/' },
    ],
  },

  resultExplanation: [
    {
      heading: 'IANA Time Zone ID',
      body: 'The canonical identifier from the IANA Time Zone Database, e.g. "America/Chicago" or "Asia/Kolkata". This is the authoritative, unambiguous name used by all modern operating systems, programming languages, and databases. Always prefer IANA IDs over abbreviations like "EST" (ambiguous — used by multiple zones).',
    },
    {
      heading: 'UTC Offset',
      body: 'The number of hours and minutes that must be added to UTC to obtain local time. Positive offsets (UTC+) are east of Greenwich; negative offsets (UTC−) are west. Displayed as UTC±H:MM. Note that the offset can change when DST begins or ends.',
    },
    {
      heading: 'Abbreviation',
      body: 'The short time zone code in effect right now, e.g. EDT, PST, AEST, IST. Abbreviations are NOT unique — "IST" is used by India (UTC+5:30), Ireland (UTC+1 summer), and Israel (UTC+2 summer). Always use the IANA ID for unambiguous machine processing.',
    },
    {
      heading: 'DST Active',
      body: 'Indicates whether Daylight Saving Time (Summer Time) is currently in effect. When DST is active, most clocks are advanced by one hour (occasionally 30 minutes), causing the UTC offset to increase. Countries near the equator typically do not observe DST.',
    },
    {
      heading: 'Common Name',
      body: 'A human-friendly English description of the time zone, e.g. "Eastern Time" or "India Standard Time". One common name may encompass multiple IANA zone IDs (e.g. both America/New_York and America/Toronto use "Eastern Time").',
    },
  ],

  useCases: [
    {
      title: 'Remote Team Meeting Scheduling',
      audience: 'Project managers, HR coordinators',
      description:
        'Use the Compare tab to find overlapping business hours between team members in different countries, then schedule calls within the mutual 9-to-5 window.',
    },
    {
      title: 'Flight & Travel Planning',
      audience: 'Travellers, frequent flyers',
      description:
        'Look up the time zone for a destination city to calculate arrival times, jet lag, and adjust medication or meal schedules across time zone boundaries.',
    },
    {
      title: 'Software Development & Logging',
      audience: 'Developers, DevOps engineers',
      description:
        'Verify the IANA time zone ID to use in application configuration, database TIMESTAMP WITH TIME ZONE columns, and log parsing scripts. Get the exact offset to correctly parse legacy timestamps.',
    },
    {
      title: 'Broadcast & Media Production',
      audience: 'Broadcasters, event coordinators',
      description:
        'Schedule live events, webinars, or sports broadcasts by confirming exactly when "8 PM local" translates to in multiple target markets around the world.',
    },
    {
      title: 'Scientific Field Research',
      audience: 'Researchers, data scientists',
      description:
        'Convert UTC sensor timestamps to local time for field stations in remote locations using the IANA zone discovered from GPS coordinates.',
    },
    {
      title: 'Legal & Compliance',
      audience: 'Lawyers, compliance officers',
      description:
        'Determine the exact legal local time for electronic contracts, court filings, SEC trading deadlines, and cross-border regulatory submissions.',
    },
  ],

  troubleshooting: [
    {
      question: 'Why does the tool show a different time zone than my phone?',
      answer:
        'Your phone uses the carrier network or GPS chip to determine the time zone, while this tool queries the Open-Meteo API from coordinates. For locations near time zone boundaries (e.g. parts of Indiana, Navajo Nation, or Russia-Kazakhstan borders), results may differ by one zone. Use the exact IANA ID from your phone settings as the authoritative answer for your device.',
    },
    {
      question: 'The GPS button didn\'t work. What happened?',
      answer:
        'Your browser may have denied the Geolocation permission. Click the padlock icon in the browser address bar → Site settings → Allow Location, then try again. On iOS Safari, enable Location for the browser in Settings → Privacy → Location Services.',
    },
    {
      question: 'The time zone returned for an ocean coordinate seems wrong.',
      answer:
        'Open ocean areas have no official civilian time zone. The Open-Meteo API returns the nearest landmass zone as a geographic approximation. Ships at sea use either UTC or the time zone of their flag state. For nautical purposes, time is typically tracked in UTC.',
    },
    {
      question: 'Why are there two different time zones with the same UTC offset?',
      answer:
        'UTC offsets are not unique identifiers. Multiple time zones can share the same numeric offset but differ in DST rules. For example, UTC-5 encompasses both America/New_York (observes DST) and America/Bogota (never DST). Always use the IANA ID to uniquely identify a zone.',
    },
    {
      question: 'The DST status shown seems incorrect for my location.',
      answer:
        'DST rules change by government proclamation. If a country recently changed its DST rules, the browser\'s TZDB may not yet include the update. Update your browser to the latest version to get the most current TZDB. You can also check the IANA TZDB directly at https://www.iana.org/time-zones.',
    },
  ],

  faqs: [
    {
      question: 'What is the difference between UTC and GMT?',
      answer:
        'UTC (Coordinated Universal Time) is the international time standard maintained by atomic clocks. GMT (Greenwich Mean Time) is the local mean solar time at the Royal Observatory in Greenwich, London. For practical purposes they are equivalent and UTC+0:00 = GMT. However, GMT can be affected by minor variations in Earth\'s rotation, while UTC is kept precise by periodic leap seconds. Modern time zones are defined relative to UTC, not GMT.',
    },
    {
      question: 'What is an IANA time zone ID and why does it matter?',
      answer:
        'An IANA ID (also called Olson ID) is a canonical string like "America/Chicago" that uniquely identifies a set of time zone rules — current UTC offset, historical changes, and future DST transitions. Unlike abbreviations (EST, IST) which are ambiguous and non-standard, IANA IDs are unambiguous and used by every major operating system, programming language, database, and cloud platform. Always store IANA IDs in data systems rather than offsets or abbreviations.',
    },
    {
      question: 'How does Daylight Saving Time (DST) work?',
      answer:
        'DST is a seasonal clock adjustment, typically advancing clocks by one hour in spring ("spring forward") and reverting in autumn ("fall back"). The practice is intended to shift an hour of daylight to the evening. Not all countries observe DST — Japan, India, China, most of Africa, and equatorial nations do not. US clocks change on the second Sunday of March and first Sunday of November. EU clocks change on the last Sunday of March and last Sunday of October.',
    },
    {
      question: 'Which countries do not observe Daylight Saving Time?',
      answer:
        'The majority of countries do not observe DST. Notable examples: China (Asia/Shanghai, always UTC+8), India (Asia/Kolkata, always UTC+5:30), Japan (Asia/Tokyo, always UTC+9), Russia (abolished DST in 2014), most of Africa, the Middle East (except Iran and some others), and Southeast Asia. The US state of Arizona also does not observe DST (except the Navajo Nation within Arizona).',
    },
    {
      question: 'Why does India have a 30-minute UTC offset (UTC+5:30)?',
      answer:
        'India adopted UTC+5:30 as a compromise when it became independent in 1947, choosing a single national time zone that minimises the maximum solar noon deviation across the subcontinent (which spans about 30 degrees of longitude). Several other countries use fractional offsets: Nepal is UTC+5:45, Sri Lanka is UTC+5:30, Iran is UTC+3:30, and Australia\'s Northern Territory is UTC+9:30.',
    },
    {
      question: 'What is the UTC offset vs the time zone offset?',
      answer:
        'The UTC offset is the signed difference between local wall-clock time and UTC at a given moment. The time zone offset is the same concept but may change seasonally due to DST. Example: America/New_York has a standard offset of UTC-5 (EST) in winter and a DST offset of UTC-4 (EDT) in summer. When you see "UTC-4" it means local time is 4 hours behind UTC at that moment.',
    },
    {
      question: 'How can I find the time zone programmatically from coordinates?',
      answer:
        'Browser-side, there is no built-in API to resolve IANA zone from raw lat/lng. Options include: (1) Use the Open-Meteo free API with ?timezone=auto parameter (used by this tool); (2) Use the Google Time Zone API (requires billing); (3) Bundle the tzdb-world npm package (~250 KB) for offline resolution; (4) Use a server-side library like moment-timezone with geo polygon data. For production systems handling millions of requests, the tzdb-world approach avoids per-request API calls.',
    },
    {
      question: 'Can I use this tool for historical date/time questions?',
      answer:
        'This tool shows current time zone data. For historical dates, time zones may have had different rules — for example, many US states switched time zones in the past century, and Russia eliminated DST in 2014. For historical accuracy, use a TZDB-aware library like Luxon, date-fns-tz, or Python\'s pytz/zoneinfo, which include historical rule transitions for every IANA zone.',
    },
  ],

  limitations: [
    'IANA zone resolution from coordinates requires an external API call (Open-Meteo). An offline fallback returns the browser\'s local time zone.',
    'Ocean, Antarctic, and uninhabited polar coordinates return the nearest landmass time zone, which may not reflect ship or base operating time.',
    'Disputed territories (e.g. Western Sahara, Crimea) may return either administering authority\'s time zone depending on the geocoding service used.',
    'Very recent DST law changes may not be reflected until the browser\'s built-in TZDB is updated via a browser update.',
    'The Compare tab is limited to 16 preset city pairs. For custom zones, type a city in the Finder tab first.',
  ],

  sources: [
    { name: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
    { name: 'Open-Meteo Free API — timezone parameter', url: 'https://open-meteo.com/en/docs' },
    { name: 'ECMAScript Internationalization API Specification', url: 'https://tc39.es/ecma402/' },
    { name: 'NIST Time and Frequency Division', url: 'https://www.nist.gov/time' },
    { name: 'timeanddate.com — DST reference', url: 'https://www.timeanddate.com/time/dst/' },
  ],

  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography & Cartography Review' },
  reviewedAt: '2026-09-21',
  contentHash: 'timezone-finder-v1',
};

