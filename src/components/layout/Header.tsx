'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { CommandPalette } from './CommandPalette';
import { TOOLS_MENU, MAPS_MENU } from '@/data/navigation';

export function Header() {
  const [activeDropdown, setActiveDropdown] = useState<'tools' | 'maps' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<'tools' | 'maps' | null>('tools');

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const handleMouseEnter = (menu: 'tools' | 'maps') => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full border-b border-[#e8e6e1] bg-[#fcfbf9]/95 backdrop-blur-md transition-colors"
      >
        <div className="mx-auto flex h-[54px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Left: Logo & Brand */}
          <Link
            href="/"
            className="flex items-baseline gap-1 no-underline transition-opacity hover:opacity-90"
            onClick={() => setActiveDropdown(null)}
          >
            <span className="font-serif text-[22px] font-bold tracking-tight text-[#1a1a18]">
              GeoMap
            </span>
            <span className="font-serif text-[22px] font-medium tracking-tight text-[#2a6e4e]">
              Suite
            </span>
          </Link>

          {/* Right Side: Navigation Menu (Right-aligned) + Search + Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 mr-1">
              {/* Tools Dropdown Trigger */}
              <div
                onMouseEnter={() => handleMouseEnter('tools')}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <Link
                  href="/tools"
                  onClick={() => setActiveDropdown(null)}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeDropdown === 'tools'
                      ? 'text-[#2a6e4e] bg-[#f0eee8]/60'
                      : 'text-[#4a4843] hover:text-[#1a1a18] hover:bg-[#f0eee8]/50'
                  }`}
                >
                  Tools
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-150 opacity-60 ${
                      activeDropdown === 'tools' ? 'rotate-180 text-[#2a6e4e]' : ''
                    }`}
                  />
                </Link>
              </div>

              {/* Maps Dropdown Trigger */}
              <div
                onMouseEnter={() => handleMouseEnter('maps')}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <Link
                  href="/maps/blank"
                  onClick={() => setActiveDropdown(null)}
                  className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    activeDropdown === 'maps'
                      ? 'text-[#2a6e4e] bg-[#f0eee8]/60'
                      : 'text-[#4a4843] hover:text-[#1a1a18] hover:bg-[#f0eee8]/50'
                  }`}
                >
                  Maps
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-150 opacity-60 ${
                      activeDropdown === 'maps' ? 'rotate-180 text-[#2a6e4e]' : ''
                    }`}
                  />
                </Link>
              </div>

              {/* US States Reference */}
              <Link
                href="/states"
                onClick={() => setActiveDropdown(null)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[#4a4843] hover:text-[#1a1a18] hover:bg-[#f0eee8]/50 transition-colors"
              >
                US States
              </Link>

              {/* Blog Link */}
              <Link
                href="/blog"
                onClick={() => setActiveDropdown(null)}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[#4a4843] hover:text-[#1a1a18] hover:bg-[#f0eee8]/50 transition-colors"
              >
                Blog
              </Link>
            </nav>

            <div className="h-4 w-px bg-[#e8e6e1] hidden md:block" />

            {/* Right Action / Search trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#e8e6e1] bg-white px-3 py-1.5 text-xs font-medium text-[#6b6860] hover:border-[#d8d5cd] hover:text-[#1a1a18] transition-all shadow-2xs"
              aria-label="Open search dialog"
            >
              <Search className="h-3.5 w-3.5 text-[#8a8880]" />
              <span className="hidden sm:inline">Search tools...</span>
              <kbd className="hidden sm:inline rounded bg-[#f5f4f0] px-1.5 py-0.5 text-[10px] font-semibold text-[#6b6860] border border-[#e8e6e1]">
                ⌘K
              </kbd>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setActiveDropdown(null);
              }}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-[#e8e6e1] text-[#1a1a18] hover:bg-[#f0eee8]"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Tools Mega-Menu Dropdown */}
        {activeDropdown === 'tools' && (
          <div
            onMouseEnter={() => handleMouseEnter('tools')}
            onMouseLeave={handleMouseLeave}
            className="hidden md:block absolute left-0 right-0 top-[54px] bg-white border-b border-[#e8e6e1] shadow-lg animate-fade-in z-50 max-h-[calc(100vh-64px)] overflow-y-auto"
          >
            <div className="mx-auto max-w-7xl px-6 py-6">
              <div className="grid grid-cols-6 gap-6">
                {TOOLS_MENU.map((category) => (
                  <div key={category.label} className="space-y-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#2a6e4e]">
                      {category.label}
                    </span>
                    <ul className="space-y-1">
                      {category.tools.map((tool) => (
                        <li key={tool.href}>
                          <Link
                            href={tool.href}
                            onClick={() => setActiveDropdown(null)}
                            className="block py-1 text-[13px] leading-snug text-[#33312e] hover:text-[#2a6e4e] transition-colors"
                          >
                            {tool.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom row banner */}
              <div className="mt-6 pt-4 border-t border-[#f0eee8] flex items-center justify-between">
                <p className="text-xs text-[#8a8880]">
                  Over 64 free in-browser geographic calculators, converters, and cartography tools.
                </p>
                <Link
                  href="/tools"
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2a6e4e] hover:underline"
                >
                  <span>View directory with all 68 tools</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Maps Mega-Menu Dropdown */}
        {activeDropdown === 'maps' && (
          <div
            onMouseEnter={() => handleMouseEnter('maps')}
            onMouseLeave={handleMouseLeave}
            className="hidden md:block absolute left-0 right-0 top-[54px] bg-white border-b border-[#e8e6e1] shadow-lg animate-fade-in z-50"
          >
            <div className="mx-auto max-w-7xl px-6 py-6">
              <div className="grid grid-cols-4 gap-8">
                {MAPS_MENU.map((category) => (
                  <div key={category.label} className="space-y-2">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#2a6e4e]">
                      {category.label}
                    </span>
                    <ul className="space-y-1">
                      {category.maps.map((mapItem) => (
                        <li key={mapItem.href}>
                          <Link
                            href={mapItem.href}
                            onClick={() => setActiveDropdown(null)}
                            className={`block py-1 text-[13px] leading-snug transition-colors ${
                              mapItem.all
                                ? 'font-semibold text-[#2a6e4e] hover:underline'
                                : 'text-[#33312e] hover:text-[#2a6e4e]'
                            }`}
                          >
                            {mapItem.name} {mapItem.all && '→'}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Bottom row banner */}
              <div className="mt-6 pt-4 border-t border-[#f0eee8] flex items-center justify-between">
                <p className="text-xs text-[#8a8880]">
                  Printable blank map outlines in vector SVG, PNG, and PDF formats for classroom and cartography.
                </p>
                <Link
                  href="/maps/blank"
                  onClick={() => setActiveDropdown(null)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2a6e4e] hover:underline"
                >
                  <span>Browse all 110 blank maps</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-[#e8e6e1] bg-white px-4 py-4 space-y-4 shadow-xl max-h-[calc(100vh-54px)] overflow-y-auto">
            {/* Mobile Nav Tabs */}
            <div className="flex border-b border-[#f0eee8] pb-2 gap-2">
              <button
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'tools' ? null : 'tools')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mobileExpandedSection === 'tools'
                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                    : 'text-[#6b6860] hover:bg-[#f5f4f0]'
                }`}
              >
                Tools ({TOOLS_MENU.reduce((acc, cat) => acc + cat.tools.length, 0)})
              </button>
              <button
                onClick={() => setMobileExpandedSection(mobileExpandedSection === 'maps' ? null : 'maps')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  mobileExpandedSection === 'maps'
                    ? 'bg-[#E8F5E9] text-[#2E7D32]'
                    : 'text-[#6b6860] hover:bg-[#f5f4f0]'
                }`}
              >
                Maps
              </button>
            </div>

            {/* Mobile Tools Category List */}
            {mobileExpandedSection === 'tools' && (
              <div className="space-y-4">
                <Link
                  href="/tools"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs font-bold text-[#2a6e4e] pb-1 border-b border-[#f0eee8]"
                >
                  All Tools Directory →
                </Link>

                {TOOLS_MENU.map((cat) => (
                  <div key={cat.label} className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c6a4f] block">
                      {cat.label}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {cat.tools.map((t) => (
                        <Link
                          key={t.href}
                          href={t.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="py-1.5 text-xs text-[#33312e] hover:text-[#2a6e4e] border-b border-[#f5f4f0]"
                        >
                          {t.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Maps Category List */}
            {mobileExpandedSection === 'maps' && (
              <div className="space-y-4">
                <Link
                  href="/maps/blank"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-xs font-bold text-[#2a6e4e] pb-1 border-b border-[#f0eee8]"
                >
                  All Blank Maps Library →
                </Link>

                {MAPS_MENU.map((cat) => (
                  <div key={cat.label} className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#7c6a4f] block">
                      {cat.label}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {cat.maps.map((m) => (
                        <Link
                          key={m.href}
                          href={m.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`py-1.5 text-xs ${
                            m.all
                              ? 'font-bold text-[#2a6e4e]'
                              : 'text-[#33312e] hover:text-[#2a6e4e]'
                          } border-b border-[#f5f4f0]`}
                        >
                          {m.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Additional Nav Links */}
            <div className="pt-3 border-t border-[#f0eee8] flex flex-wrap gap-4 text-xs font-medium text-[#6b6860]">
              <Link href="/states" onClick={() => setIsMobileMenuOpen(false)}>
                US States
              </Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/guides" onClick={() => setIsMobileMenuOpen(false)}>
                Guides
              </Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Command Palette Modal */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
