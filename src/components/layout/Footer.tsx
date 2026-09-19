import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Sparkles, ArrowRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e8e6e1] bg-[#f7f6f2] text-[#6b6860] transition-colors">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-baseline gap-1 no-underline transition-opacity hover:opacity-90">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#1a1a18]">
                GeoMap
              </span>
              <span className="font-serif text-2xl font-medium tracking-tight text-[#2a6e4e]">
                Suite
              </span>
            </Link>
            <p className="text-sm text-[#54524b] max-w-sm leading-relaxed">
              Free interactive map tools and printable blank maps. Built on open data from OpenStreetMap, US Census Bureau, Natural Earth, and Copernicus DEM. Fast, private, browser-executed — no sign-up required.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#737067] pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[#2a6e4e]" />
                <span>Zero coordinate logging</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-[#2a6e4e]" />
                <span>Open-data powered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#7c6a4f]" />
                <span>68 tools & 110 maps</span>
              </div>
            </div>
          </div>

          {/* Column 1: Popular Free Tools */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wide text-[#1a1a18]">Popular Tools</h3>
            <ul className="mt-3.5 space-y-2 text-sm">
              <li>
                <Link href="/tools/drive-time-map" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Drive Time Map
                </Link>
              </li>
              <li>
                <Link href="/tools/what-county-am-i-in" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  What County Am I In?
                </Link>
              </li>
              <li>
                <Link href="/tools/map-radius-tool" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Map Radius Tool
                </Link>
              </li>
              <li>
                <Link href="/tools/map-drawer" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Map Drawer
                </Link>
              </li>
              <li>
                <Link href="/tools/coordinates-to-address" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Coordinates to Address
                </Link>
              </li>
              <li>
                <Link href="/tools/distance-between-two-places" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Distance Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/latitude-longitude-finder" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Lat/Lng Finder
                </Link>
              </li>
              <li>
                <Link href="/elevation-profile" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Elevation Profile
                </Link>
              </li>
              <li>
                <Link href="/us-time-zone-map" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  US Time Zone Map
                </Link>
              </li>
              <li>
                <Link href="/world-time-zone-map" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  World Time Zone Map
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/tools" className="inline-flex items-center gap-1 font-medium text-[#2a6e4e] hover:underline text-xs">
                  All 68 tools <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Printable Blank Maps */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wide text-[#1a1a18]">Printable Maps</h3>
            <ul className="mt-3.5 space-y-2 text-sm">
              <li>
                <Link href="/maps/blank/united-states" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  United States
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/world" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  World Map
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/europe" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Europe
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/california" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  California
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/texas" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Texas
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/japan" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Japan
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/france" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  France
                </Link>
              </li>
              <li>
                <Link href="/maps/blank/australia" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Australia
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/maps/blank" className="inline-flex items-center gap-1 font-medium text-[#2a6e4e] hover:underline text-xs">
                  All 110 blank maps <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Studies, Data & Trust */}
          <div>
            <h3 className="font-serif text-sm font-semibold tracking-wide text-[#1a1a18]">Data & Policies</h3>
            <ul className="mt-3.5 space-y-2 text-sm">
              <li>
                <Link href="/states" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Counties by State
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Blog & Geospatial Insights
                </Link>
              </li>
              <li>
                <Link href="/tools/country-size-comparison" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Country Size Comparison
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Geographic Glossary
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Methodology & Math
                </Link>
              </li>
              <li>
                <Link href="/data-sources" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Data Sources & Licenses
                </Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Editorial Policy
                </Link>
              </li>
              <li>
                <Link href="/corrections" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Corrections & Updates
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  About GeoMap Suite
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[#54524b] hover:text-[#2a6e4e] transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Attribution Bar */}
        <div className="mt-10 border-t border-[#e8e6e1] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8a8880] gap-3">
          <p>© {currentYear} GeoMap Suite. Data: US Census Bureau · Natural Earth · OpenStreetMap · Copernicus GLO-90 DEM.</p>
          <div className="flex items-center gap-4">
            <Link href="/data-sources" className="hover:text-[#2a6e4e] transition-colors">
              Attribution & Licenses
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-[#2a6e4e] transition-colors">
              Privacy & Cookies
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#2a6e4e] transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
