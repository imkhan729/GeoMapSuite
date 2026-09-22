import { ToolContent } from '@/types/content';

export const timeDifferenceCalculatorContent: ToolContent = {
  slug: 'time-difference-calculator',
  primaryKeyword: 'time difference calculator',
  searchIntent: 'Users want to calculate the exact hour and minute difference between two cities or time zones, find overlapping business hours for meetings, and convert a specific local time to another time zone.',
  directAnswer:
    'Enter two cities or time zones to instantly see the live time difference in hours and minutes, the current local time in each location, business hours overlap window for meetings, and a real-time converter showing what any time in City A is in City B.',

  howTo: [
    {
      title: 'Select two locations',
      description:
        'Choose Location A and Location B from the preset city dropdowns, or click "Search any city…" to geocode any address, city name, or landmark in the world.',
    },
    {
      title: 'Read the live time difference',
      description:
        'The result hero displays the live time difference (e.g. "+5h") and both current local times, which update every second. The difference accounts for DST — it reflects the real offset right now, not a fixed value.',
    },
    {
      title: 'Find your business hours overlap',
      description:
        'The Business Hours Overlap panel shows exactly how many hours of working time the two locations share and the best window for scheduling calls. Choose from four work-hours presets or adjust later.',
    },
    {
      title: 'Convert a specific meeting time',
      description:
        'Use the Meeting Time Converter to pick any time in Location A (e.g. 10:00 AM) and instantly see what that time is in Location B, including a "next day" alert if the conversion crosses midnight.',
    },
    {
      title: 'Add more cities',
      description:
        'Click "Add City" or use the quick-add preset chips to add a third, fourth, or more locations to a live world-time dashboard. Remove any city with the × button.',
    },
    {
      title: 'Click the world reference table',
      description:
        'Click any row in the 30-city reference table to instantly set that city as Location B, letting you quickly scan the time difference against any major world hub.',
    },
  ],

  examples: [
    {
      title: 'New York ↔ London meeting overlap',
      scenario: 'A US startup (New York) needs to schedule a weekly call with a London partner. They want to know the best time that works for both.',
      inputs: [
        { label: 'Location A', value: 'New York, USA (America/New_York)' },
        { label: 'Location B', value: 'London, UK (Europe/London)' },
        { label: 'Working hours', value: 'Standard (9 AM–5 PM)' },
      ],
      steps: [
        'Select "New York, USA" as Location A and "London, UK" as Location B.',
        'In summer (EDT vs BST): New York is UTC-4, London is UTC+1 → difference = +5h.',
        'Business hours for New York in UTC: 13:00–21:00.',
        'Business hours for London in UTC: 08:00–16:00.',
        'Overlap in UTC: 13:00–16:00 (3 hours).',
        'In New York local time: 9 AM–12 PM. In London local time: 2 PM–5 PM.',
      ],
      output: [
        { label: 'Time Difference',   value: '+5 hours (summer) or +5 hours (winter)' },
        { label: 'Overlap Duration',  value: '3 hours' },
        { label: 'Best Call Window',  value: '9–12 AM New York / 2–5 PM London' },
      ],
      explanation:
        'UK and US Eastern both advance their clocks by 1 hour for summer time, so the difference remains +5h year-round. This creates a reliable 3-hour window each weekday morning for the US team.',
    },
    {
      title: 'Los Angeles ↔ Tokyo meeting planner',
      scenario: 'A California engineering team needs to sync with their Tokyo office. They want to know if any overlap exists.',
      inputs: [
        { label: 'Location A', value: 'Los Angeles, USA (America/Los_Angeles)' },
        { label: 'Location B', value: 'Tokyo, Japan (Asia/Tokyo)' },
        { label: 'Working hours', value: 'Standard (9 AM–5 PM)' },
      ],
      steps: [
        'Select Los Angeles and Tokyo.',
        'PST (winter): UTC-8. JST: UTC+9. Difference = +17h.',
        'LA business hours in UTC: 17:00–01:00 (next day).',
        'Tokyo business hours in UTC: 00:00–08:00.',
        'Overlap in UTC: 00:00–01:00 (1 hour) — only for extended hours preset.',
        'For standard 9–5: 5 PM in LA = 10 AM next day in Tokyo → no overlap.',
      ],
      output: [
        { label: 'Time Difference',  value: '+17h (winter PST/JST)' },
        { label: 'Overlap (9–5)',    value: 'No overlap' },
        { label: 'Workaround',       value: '8 AM LA = 1 AM Tokyo; 5 PM LA = 10 AM next day Tokyo' },
      ],
      explanation:
        'A 17-hour gap means standard working hours never overlap. The best approach is an asynchronous workflow with daily Loom recordings, or one party agreeing to an early/late meeting outside standard hours.',
    },
    {
      title: 'Convert 3 PM EST to Singapore time',
      scenario: 'A contract lawyer in New York signs a document at 3:00 PM EST. The Singapore counterpart needs to know the equivalent Singapore Standard Time for filing records.',
      inputs: [
        { label: 'From', value: '3:00 PM Eastern Standard Time (America/New_York, winter)' },
        { label: 'To',   value: 'Asia/Singapore (UTC+8)' },
      ],
      steps: [
        'Set Location A to New York, Location B to Singapore.',
        'Select 3:00 PM in the Meeting Time Converter.',
        'EST (winter) is UTC-5; Singapore is UTC+8.',
        '3:00 PM EST = 20:00 UTC.',
        '20:00 UTC + 8h = 04:00 next day Singapore time.',
      ],
      output: [
        { label: 'Input Time',   value: '3:00 PM EST (UTC-5)' },
        { label: 'Output Time',  value: '4:00 AM SGT (UTC+8) — next day' },
        { label: 'UTC',          value: '20:00 UTC' },
      ],
      explanation:
        'Singapore Standard Time is always UTC+8 with no DST, making it a stable reference zone. The 13-hour difference from EST means afternoon times in New York always fall in the early morning of the following calendar day in Singapore.',
    },
  ],

  methodology: {
    formulaTitle: 'UTC-Based Offset Arithmetic',
    formulaDescription:
      'Time zone conversion works by converting both local times to UTC, then adding the target UTC offset. The business-hours overlap window is found by intersecting the two zones\' 9–5 windows projected onto the UTC timeline.',
    mathFormula: 'T_B = T_A − UTC_A + UTC_B',
    datum: 'IANA Time Zone Database (TZDB). UTC offsets and DST transitions are computed using browser-native Intl.DateTimeFormat APIs, which bundle a copy of TZDB updated with each browser release.',
    precision:
      'UTC offsets are accurate to the minute. The tool reflects the real DST status at the moment of the calculation — it does not rely on static offset tables. Offsets can change during DST transitions twice per year.',
    limitations: [
      'DST rules are set by government decree and can change with short notice. The browser\'s TZDB may lag behind very recent changes until the next browser update.',
      'The business hours overlap assumes standard working hours are defined identically in both cities. Public holidays and non-standard company hours are not considered.',
      'The Meeting Time Converter does not account for calendar day boundaries beyond a ±24h window.',
      'Searching by city name requires a network connection (Photon geocoding API) and coordinate-to-timezone resolution (Open-Meteo API).',
    ],
    sources: [
      { name: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
      { name: 'ECMAScript Internationalization API Specification (Intl)', url: 'https://tc39.es/ecma402/' },
      { name: 'Open-Meteo free timezone API', url: 'https://open-meteo.com/en/docs' },
    ],
  },

  resultExplanation: [
    {
      heading: 'Time Difference (hours and minutes)',
      body: 'The signed difference in UTC offsets between the two selected locations at this exact moment. A positive value means Location B is ahead of Location A (further east). The value accounts for DST — if one location observes summer time and the other does not, the difference changes at the DST transition date.',
    },
    {
      heading: 'Business Hours Overlap',
      body: 'The overlap window is calculated by projecting both zones\' working hours (default 9 AM–5 PM) onto the UTC timeline and finding their intersection. The result is displayed in each zone\'s local time so both parties can immediately see the window on their own clock.',
    },
    {
      heading: 'Meeting Time Conversion',
      body: 'A specific local time in Location A is converted to UTC (subtract offset A), then the target offset B is added to yield the equivalent wall-clock time in Location B. A "next day" badge appears when the conversion crosses midnight.',
    },
    {
      heading: 'DST Active badge',
      body: 'Shown when Daylight Saving Time is currently in effect for that location. DST typically advances the clock by 1 hour, increasing the UTC offset by 60 minutes. The time difference between two locations may therefore be different in summer vs winter if they follow different DST schedules.',
    },
  ],

  useCases: [
    {
      title: 'Remote Team Scheduling',
      audience: 'Managers, Scrum masters, HR coordinators',
      description:
        'Find the exact overlap window between distributed team members across multiple continents to schedule stand-ups, retrospectives, and 1:1s during everyone\'s working hours.',
    },
    {
      title: 'Client Communication',
      audience: 'Consultants, Account managers, Sales teams',
      description:
        'Before calling an international client, verify what time it is there right now and confirm they are within business hours — avoiding calls at 3 AM.',
    },
    {
      title: 'Global Event Broadcasting',
      audience: 'Event producers, Webinar hosts, Conference organisers',
      description:
        'Convert a planned broadcast time to every major region\'s local time to publish accurate schedules for Asia-Pacific, Europe, and Americas audiences simultaneously.',
    },
    {
      title: 'Contract & Legal Deadlines',
      audience: 'Lawyers, Compliance officers, Finance teams',
      description:
        'Convert deadline times across jurisdictions — e.g. convert a New York Stock Exchange 4 PM ET close to the equivalent time in Tokyo, Frankfurt, and Sydney for trade settlement.',
    },
    {
      title: 'Travel Planning',
      audience: 'Frequent flyers, Travellers',
      description:
        'Before a long-haul flight, calculate how many hours ahead or behind the destination is and plan sleep, meals, and medication schedules to minimise jet lag.',
    },
    {
      title: 'Software Deployment Coordination',
      audience: 'DevOps engineers, Release managers',
      description:
        'Schedule deployments during the joint off-peak window for all regions to minimise user impact during maintenance windows.',
    },
  ],

  troubleshooting: [
    {
      question: 'The time difference changed — why is it different now than last month?',
      answer:
        'One or both zones switched to/from Daylight Saving Time. DST transitions happen twice a year and change the UTC offset by ±60 minutes. For example, New York–London is +5h in summer (EDT vs BST) and also +5h in winter (EST vs GMT), but New York–Los Angeles is always -3h because both cities observe US DST on the same schedule.',
    },
    {
      question: 'My search returns a wrong city — what should I do?',
      answer:
        'The search uses the Photon geocoding API (OpenStreetMap data). Try adding the country or state to disambiguate — e.g. "Springfield, Illinois" instead of "Springfield". The tool then resolves the IANA time zone from the returned coordinates via Open-Meteo.',
    },
    {
      question: 'No business hours overlap is shown even though I expected some.',
      answer:
        'The default working hours preset is 9 AM–5 PM. For zones with very large differences (e.g. Los Angeles and Tokyo at 17h apart), no standard 8-hour window overlaps. Try the "Extended (8–6)" preset to get 1 additional hour on each end, or consider planning asynchronous communication.',
    },
    {
      question: 'The meeting converter shows "next day" — is that correct?',
      answer:
        'Yes. If Location B is many hours ahead of Location A, an afternoon meeting in A can fall in the early morning hours of the following calendar day in B. The "next day" badge is a reminder that the date changes — participants in B may need to note the meeting on the following day\'s calendar.',
    },
    {
      question: 'Why does China show UTC+8 even though it spans five geographic time zones?',
      answer:
        'China adopted a single national time zone (China Standard Time, UTC+8, IANA: Asia/Shanghai) in 1949. Geographically the western regions of China are closer to UTC+5 or UTC+6 solar time, but the government mandates UTC+8 nationwide for administrative simplicity.',
    },
  ],

  faqs: [
    {
      question: 'Is the time difference the same all year round?',
      answer:
        'Not necessarily. If both locations observe DST on the same schedule (e.g. both are US cities), the difference stays constant year-round. If only one location observes DST, or they transition on different dates (US vs EU clocks change on different weeks), the difference shifts by 1 hour for a few weeks each spring and autumn.',
    },
    {
      question: 'How do I find the best time for a global all-hands meeting?',
      answer:
        'Add all team locations using the "Add More Locations" panel and the quick preset chips. Then look at the Business Hours Overlap for your two primary zones. For three or more zones, mentally intersect their working-hours ranges. A common compromise for US West Coast, US East Coast, and Central Europe is 9 AM Pacific / 12 PM Eastern / 6 PM CET.',
    },
    {
      question: 'What is the largest time difference between two inhabited places?',
      answer:
        'The maximum time difference between two cities is approximately 26 hours, between Baker Island (UTC-12, uninhabited US minor outlying island) and places observing UTC+14 (Kiribati — Line Islands). Among regularly inhabited places, the practical maximum is between American Samoa (UTC-11) and Kiribati (UTC+14) at 25 hours, meaning they can share the same calendar time while being one full day apart.',
    },
    {
      question: 'Why does India have a 30-minute offset (UTC+5:30)?',
      answer:
        'India chose UTC+5:30 when it became independent as a compromise to minimise the maximum solar noon deviation across the entire subcontinent. The Intl API correctly returns a 330-minute offset for Asia/Kolkata. Several other countries use fractional offsets: Iran (UTC+3:30), Nepal (UTC+5:45), and parts of Australia (UTC+9:30 or UTC+10:30).',
    },
    {
      question: 'Does the tool account for daylight saving time in the overlap window?',
      answer:
        'Yes. Both UTC offsets are derived in real time from the browser\'s IANA TZDB at the current timestamp, so any active DST shift is already reflected in the overlap calculation. If you look at the tool in winter vs summer, the overlap window may shift by ±1 hour for DST-observing locations.',
    },
    {
      question: 'How do I calculate the time difference for a future date?',
      answer:
        'This tool calculates the live current time difference. For future dates — especially around DST transition weekends — the offset may be different. For precise future calculations, use a programming library like Luxon, date-fns-tz, or Python\'s zoneinfo module and specify the exact date to get the correct offset for that moment.',
    },
    {
      question: 'What is the difference between UTC offset and time zone?',
      answer:
        'A UTC offset (e.g. UTC-5) is a simple numeric value representing the hours and minutes ahead of or behind UTC at a given instant. A time zone (identified by an IANA ID like America/New_York) is a set of rules that defines the UTC offset for every moment in history and into the future, including DST transitions. Multiple IANA time zones can share the same UTC offset at any given moment but have different DST rules.',
    },
    {
      question: 'Can I share a specific comparison with a colleague?',
      answer:
        'Use the "Copy Result" button to copy a text summary of the time difference, both local times, offsets, and the overlap window to your clipboard. Paste it into Slack, email, or a calendar invite. For a permanent shareable link, bookmark the URL after selecting your cities — future improvements may add URL-based state sharing.',
    },
  ],

  limitations: [
    'Business hours overlap uses a fixed configurable window (default 9 AM–5 PM) and does not account for public holidays, company-specific schedules, or religious observances.',
    'Very recent government DST rule changes may not be reflected until the user\'s browser is updated to include the latest TZDB.',
    'The meeting time converter only converts the time component, not the date. "Next day" is indicated but the actual calendar date is not shown.',
    'City search requires network access (Photon geocoding) and Open-Meteo time zone resolution. Offline or poor-connection scenarios fall back to the browser\'s local zone.',
    'The tool does not store or retrieve user preferences between sessions — selections reset on page reload.',
  ],

  sources: [
    { name: 'IANA Time Zone Database', url: 'https://www.iana.org/time-zones' },
    { name: 'ECMAScript Internationalization API', url: 'https://tc39.es/ecma402/' },
    { name: 'Open-Meteo Forecast API — timezone parameter', url: 'https://open-meteo.com/en/docs' },
    { name: 'timeanddate.com — DST around the world', url: 'https://www.timeanddate.com/time/dst/' },
    { name: 'NIST Time and Frequency Division', url: 'https://www.nist.gov/time' },
  ],

  reviewer: { name: 'GeoMapSuite Editorial Team', role: 'Geography & Cartography Review' },
  reviewedAt: '2026-09-21',
  contentHash: 'time-difference-calculator-v1',
};
