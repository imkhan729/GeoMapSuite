import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllStates } from '@/data/states/states-registry';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { buildCanonicalUrl, buildSeoDescription, buildSeoTitle, SITE_CONFIG } from '@/lib/seo/metadata';
import { StatesDirectoryClient } from './StatesDirectoryClient';
import {
  MapPin,
  Building,
  Users,
  Maximize2,
  Compass,
  Download,
  HelpCircle,
  BookOpen,
  Scale,
  Award,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: buildSeoTitle('US States & Counties: Maps and FIPS Codes'),
  description:
    buildSeoDescription('Explore interactive maps and county lists for all 50 US states and Washington, DC. Find county names, seats, populations, and FIPS codes.'),
  keywords: [
    'us states list',
    'us counties by state',
    'state fips codes',
    'us county population',
    'us county map',
    'county demographics',
    'counties in california',
    'counties in texas',
    'counties in florida',
    'counties in pennsylvania',
    'geomapsuite',
  ],
  alternates: {
    canonical: buildCanonicalUrl('/states'),
  },
  openGraph: {
    title: buildSeoTitle('US States and Counties: Interactive Maps'),
    description:
      'Browse US state and county maps, county lists, FIPS codes, seats, and population information.',
    url: buildCanonicalUrl('/states'),
    siteName: SITE_CONFIG.name,
    type: 'website',
  },
};

export default function StatesHubPage() {
  const states = getAllStates();

  const totalCounties = states.reduce((acc, s) => acc + s.countyCount, 0);
  const totalLandArea = states.reduce((acc, s) => acc + s.landAreaSqMiles, 0);

  const faqs = [
    {
      q: 'How many counties and county equivalents are in the United States?',
      a: 'The 50 United States and the District of Columbia contain 3,143 counties and county-equivalent administrative subdivisions. When including the unincorporated territories of Puerto Rico (78 municipios), the US Virgin Islands (3 island districts), Guam, American Samoa, and Northern Mariana Islands, the grand total is 3,243 county equivalents nationwide.',
    },
    {
      q: 'What is a "county equivalent" in the US Census Bureau system?',
      a: 'In jurisdictions without standard county administrative units, the US Census Bureau designates equivalent subdivisions for statistical and governmental reporting. Key examples include the 64 Parishes of Louisiana, 19 Organized Boroughs and 11 statistical Census Areas of Alaska, 38 Independent Cities of Virginia (plus Baltimore City, MD, St. Louis, MO, and Carson City, NV), and Connecticut’s 9 Planning Regions adopted in 2024.',
    },
    {
      q: 'Which US state has the most counties, and which has the fewest?',
      a: 'Texas contains the largest number of counties in the nation with 254 counties. Delaware has the fewest true counties with only 3 (New Castle, Kent, and Sussex). Hawaii has 5 counties, and Rhode Island has 5 counties.',
    },
    {
      q: 'What is the most populous county in the United States?',
      a: 'Los Angeles County, California is by far the most populous county in the nation, with an estimated population exceeding 9.7 million residents—larger than 40 individual US states. Cook County, Illinois (Chicago) ranks second with over 5.2 million residents, followed by Harris County, Texas (Houston) with 4.7 million.',
    },
    {
      q: 'What is the largest county by land area in the United States?',
      a: 'Yukon-Koyukuk Census Area in Alaska covers the largest territorial land area of any county equivalent at 145,505 square miles (larger than Montana or Germany). Among standard lower-48 counties, San Bernardino County, California is the largest, spanning 20,057 square miles of land.',
    },
    {
      q: 'Why did Connecticut change its county boundaries in 2024?',
      a: 'Connecticut county governments were formally abolished by the state legislature in 1960, leaving historical county lines as merely ceremonial designations. In 2022, Connecticut petitioned the US Census Bureau to replace its 8 legacy counties with its 9 active Regional Councils of Governments (Planning Regions) as official statistical county equivalents, which officially took effect for Census data products in 2024.',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: f.a,
              },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://geomapsuite.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'US States Directory',
                item: 'https://geomapsuite.com/states',
              },
            ],
          }),
        }}
      />

      <Breadcrumbs items={[{ label: 'US States Directory' }]} />

      {/* Header & Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#2a6e4e]/10 px-3 py-1 text-xs font-semibold text-[#2a6e4e]">
          <span>National Geographic Reference</span>
          <span>•</span>
          <span>US Census Bureau 2024 Benchmarks</span>
        </div>

        <h1 className="text-3xl font-serif font-bold tracking-tight text-[#1a1a18] sm:text-4xl lg:text-5xl">
          United States Reference Hub & County Directory
        </h1>

        <p className="text-sm sm:text-base leading-relaxed text-[#54524b] max-w-4xl">
          Complete demographic reference, FIPS identifiers, and administrative directory for all{' '}
          <strong>50 US States</strong> and the <strong>District of Columbia</strong>. Compare{' '}
          <strong>{totalCounties.toLocaleString()} counties</strong> and county equivalents, 2024
          Census populations, state capitals, land areas, and interactive boundary maps.
        </p>
      </div>

      {/* National KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Building className="h-4 w-4 text-[#2a6e4e]" />
            <span>Jurisdictions</span>
          </div>
          <span className="text-2xl font-bold font-serif text-[#1a1a18] mt-1 block">
            50 States + DC
          </span>
          <span className="text-[11px] text-[#737067] mt-0.5 block">Plus 5 US Island Territories</span>
        </div>

        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <MapPin className="h-4 w-4 text-[#2a6e4e]" />
            <span>Total Counties</span>
          </div>
          <span className="text-2xl font-bold font-serif text-[#1a1a18] mt-1 block">
            {totalCounties.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#737067] mt-0.5 block">Counties & county equivalents</span>
        </div>

        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Users className="h-4 w-4 text-[#2a6e4e]" />
            <span>US Population</span>
          </div>
          <span className="text-2xl font-bold font-serif text-[#1a1a18] mt-1 block">
            335.8 Million
          </span>
          <span className="text-[11px] text-[#737067] mt-0.5 block">US Census Bureau 2024 PEP</span>
        </div>

        <div className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-[#737067] text-xs font-medium">
            <Maximize2 className="h-4 w-4 text-[#2a6e4e]" />
            <span>Total Land Area</span>
          </div>
          <span className="text-2xl font-bold font-serif text-[#1a1a18] mt-1 block">
            {totalLandArea.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#737067] mt-0.5 block">Square miles (50 states + DC)</span>
        </div>
      </div>

      {/* Popular State Quick Navigation Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="font-semibold text-[#1a1a18]">Popular State Directories:</span>
        {[
          { name: 'California', slug: 'california' },
          { name: 'Texas', slug: 'texas' },
          { name: 'Florida', slug: 'florida' },
          { name: 'New York', slug: 'new-york' },
          { name: 'Pennsylvania', slug: 'pennsylvania' },
          { name: 'Illinois', slug: 'illinois' },
          { name: 'Ohio', slug: 'ohio' },
          { name: 'Georgia', slug: 'georgia' },
          { name: 'North Carolina', slug: 'north-carolina' },
          { name: 'Michigan', slug: 'michigan' },
        ].map((item) => (
          <Link
            key={item.slug}
            href={`/states/${item.slug}/counties`}
            className="rounded-lg border border-[#e8e6e1] bg-white px-2.5 py-1 text-[#54524b] hover:border-[#2a6e4e] hover:text-[#2a6e4e] transition-colors shadow-2xs"
          >
            {item.name} Counties
          </Link>
        ))}
      </div>

      {/* Interactive Directory Section (Client Component) */}
      <StatesDirectoryClient states={states} />

      {/* In-Depth Educational Guide (E-E-A-T High-Authority Content) */}
      <div className="rounded-3xl border border-[#e8e6e1] bg-[#f7f6f2] p-6 sm:p-10 space-y-8">
        <div className="space-y-2 border-b border-[#e8e6e1] pb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#2a6e4e] uppercase tracking-wide">
            <BookOpen className="h-4 w-4" />
            <span>Authoritative Reference Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1a1a18]">
            Understanding United States Counties & Administrative Geography
          </h2>
          <p className="text-sm text-[#54524b] max-w-3xl leading-relaxed">
            Counties serve as the foundational intermediate tier of administrative governance in
            the United States, positioned between state governments and municipal cities or towns.
            Learn how county boundaries are structured, how unique equivalents operate, and how
            the Federal Government identifies them through standardized FIPS codes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#54524b] leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-[#1a1a18] flex items-center gap-2">
              <Scale className="h-5 w-5 text-[#2a6e4e]" />
              <span>Administrative Roles of County Government</span>
            </h3>
            <p>
              In 48 of the 50 states, counties operate as functional local government bodies.
              Typical county-level responsibilities include:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#54524b]">
              <li>
                <strong>Public Records & Deeds:</strong> County recorders and clerks record real
                estate deeds, mortgages, vital birth/marriage certificates, and business filings.
              </li>
              <li>
                <strong>Judicial Administration:</strong> State district and circuit courthouses are
                organized by county seats, with elected prosecutors, public defenders, and judges.
              </li>
              <li>
                <strong>Law Enforcement:</strong> County sheriffs maintain county jails, serve civil
                process, and provide primary police patrols in unincorporated areas outside city
                limits.
              </li>
              <li>
                <strong>Elections & Voting:</strong> County election boards manage voter registration
                rolls, ballot counting, and precinct polling stations for federal and state elections.
              </li>
              <li>
                <strong>Property Assessment & Taxation:</strong> County tax assessors calculate
                ad-valorem property assessments that fund local school districts and emergency
                services.
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h3 className="text-lg font-serif font-bold text-[#1a1a18] flex items-center gap-2">
              <Award className="h-5 w-5 text-[#2a6e4e]" />
              <span>County Equivalents Explained</span>
            </h3>
            <p>
              The United States Census Bureau classifies non-county areas as &quot;county equivalents&quot;
              to ensure contiguous geographic data coverage:
            </p>
            <ul className="space-y-2 text-xs">
              <li className="rounded-xl bg-white p-3 border border-[#e8e6e1]">
                <strong className="text-[#1a1a18] block mb-0.5">Louisiana Parishes (64)</strong>
                Inherited from French civil law and Catholic diocese parishes prior to the 1803
                Louisiana Purchase. Governed by Police Juries or parish councils.
              </li>
              <li className="rounded-xl bg-white p-3 border border-[#e8e6e1]">
                <strong className="text-[#1a1a18] block mb-0.5">Alaska Organized Boroughs (19) & Census Areas (11)</strong>
                Alaska’s vast Unorganized Borough covers over 320,000 square miles without borough
                government. The US Census Bureau divides it into 11 statistical Census Areas for
                demographic reporting.
              </li>
              <li className="rounded-xl bg-white p-3 border border-[#e8e6e1]">
                <strong className="text-[#1a1a18] block mb-0.5">Virginia Independent Cities (38)</strong>
                Virginia operates under an unusual constitutional structure where all 38 cities are
                completely independent of any surrounding county.
              </li>
              <li className="rounded-xl bg-white p-3 border border-[#e8e6e1]">
                <strong className="text-[#1a1a18] block mb-0.5">Connecticut Planning Regions (9)</strong>
                Effective 2024, the US Census Bureau officially retired Connecticut’s 8 historical
                counties in favor of its 9 functioning Regional Councils of Governments (Planning Regions).
              </li>
            </ul>
          </div>
        </div>

        {/* National Extremes & Superlatives Table */}
        <div className="space-y-4 pt-4 border-t border-[#e8e6e1]">
          <h3 className="text-lg font-serif font-bold text-[#1a1a18]">
            United States County Extremes & Benchmarks
          </h3>
          <div className="overflow-x-auto rounded-2xl border border-[#e8e6e1] bg-white">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7f6f2] text-[#54524b] uppercase font-bold text-[11px] border-b border-[#e8e6e1]">
                <tr>
                  <th className="px-4 py-3">Superlative Category</th>
                  <th className="px-4 py-3">Jurisdiction Name</th>
                  <th className="px-4 py-3">State</th>
                  <th className="px-4 py-3">Official Census Metric</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e6e1] text-[#54524b]">
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">Most Populous County</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">Los Angeles County</td>
                  <td className="px-4 py-3">California (CA)</td>
                  <td className="px-4 py-3 font-mono">9,721,138 residents</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Larger than 40 states</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">Least Populous County</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">Loving County</td>
                  <td className="px-4 py-3">Texas (TX)</td>
                  <td className="px-4 py-3 font-mono">51 residents</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Permian Basin region</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">Largest Area (Overall)</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">Yukon-Koyukuk Census Area</td>
                  <td className="px-4 py-3">Alaska (AK)</td>
                  <td className="px-4 py-3 font-mono">145,505 sq miles</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Larger than Germany</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">Largest Area (Lower 48)</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">San Bernardino County</td>
                  <td className="px-4 py-3">California (CA)</td>
                  <td className="px-4 py-3 font-mono">20,057 sq miles</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Larger than NJ, CT, DE combined</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">Smallest County (Overall)</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">Kalawao County</td>
                  <td className="px-4 py-3">Hawaii (HI)</td>
                  <td className="px-4 py-3 font-mono">12 sq miles (82 pop)</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Kalaupapa peninsula</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">Smallest Standard County</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">New York County (Manhattan)</td>
                  <td className="px-4 py-3">New York (NY)</td>
                  <td className="px-4 py-3 font-mono">23 sq miles</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Densest county in US</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">State with Most Counties</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">State of Texas</td>
                  <td className="px-4 py-3">Texas (TX)</td>
                  <td className="px-4 py-3 font-mono">254 counties</td>
                  <td className="px-4 py-3 text-right text-[#737067]">Average 1,028 sq mi</td>
                </tr>
                <tr className="hover:bg-[#fbfaf7]">
                  <td className="px-4 py-3 font-semibold text-[#1a1a18]">State with Fewest Counties</td>
                  <td className="px-4 py-3 font-bold text-[#2a6e4e]">State of Delaware</td>
                  <td className="px-4 py-3">Delaware (DE)</td>
                  <td className="px-4 py-3 font-mono">3 counties</td>
                  <td className="px-4 py-3 text-right text-[#737067]">New Castle, Kent, Sussex</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Featured GeoMap Suite County & Map Tools */}
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1a1a18]">
            Interactive County & Demographic Tools
          </h2>
          <p className="text-xs sm:text-sm text-[#737067] mt-1">
            Free browser-executed GIS utilities powered by US Census Bureau TIGER/Line data.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Link
            href="/tools/what-county-am-i-in"
            className="group rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                  <MapPin className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold text-[#2a6e4e] uppercase tracking-wide">
                  GPS Geolocation
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                What County Am I In?
              </h3>
              <p className="text-xs text-[#54524b] mt-1.5 leading-relaxed">
                Instantly detect your current county, FIPS code, and municipality using private,
                browser-based GPS coordinates.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
              <span>Detect My County</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/tools/address-to-county-lookup"
            className="group rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                  <Building className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold text-[#2a6e4e] uppercase tracking-wide">
                  Address Geocoding
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                Address to County Lookup
              </h3>
              <p className="text-xs text-[#54524b] mt-1.5 leading-relaxed">
                Type any US street address or postal ZIP code to identify its exact governing county,
                county seat, and 5-digit FIPS identifier.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
              <span>Lookup Address</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/tools/us-county-map-interactive"
            className="group rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                  <Compass className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold text-[#2a6e4e] uppercase tracking-wide">
                  Interactive GIS
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                US County Interactive Map
              </h3>
              <p className="text-xs text-[#54524b] mt-1.5 leading-relaxed">
                Explore all 3,143 United States county boundaries on a seamless vector map with
                hover tooltips, census data overlays, and search.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
              <span>Open Interactive Map</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/maps/blank/united-states"
            className="group rounded-3xl border border-[#e8e6e1] bg-white p-5 shadow-xs hover:border-[#2a6e4e] hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="p-2 rounded-xl bg-[#2a6e4e]/10 text-[#2a6e4e]">
                  <Download className="h-5 w-5" />
                </span>
                <span className="text-[11px] font-bold text-[#2a6e4e] uppercase tracking-wide">
                  Print & Export
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1a1a18] group-hover:text-[#2a6e4e] transition-colors">
                Printable Blank US Map
              </h3>
              <p className="text-xs text-[#54524b] mt-1.5 leading-relaxed">
                Download free high-resolution blank outline maps of the United States and individual
                states in vector SVG, PDF, and PNG formats.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#f0eee9] flex items-center justify-between text-xs font-semibold text-[#2a6e4e]">
              <span>Download Outlines</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-[#1a1a18] flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-[#2a6e4e]" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[#e8e6e1] bg-white p-5 shadow-xs space-y-2"
            >
              <h3 className="text-sm font-bold text-[#1a1a18]">
                {f.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#54524b] leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
