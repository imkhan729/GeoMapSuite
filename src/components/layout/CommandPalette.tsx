'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Compass, MapPin, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { getAllTools, ToolRegistryItem } from '@/lib/tools/registry';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const tools = getAllTools();
  const filteredTools = query.trim() === ''
    ? tools.slice(0, 8)
    : tools.filter((t) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.secondaryKeywords.some((k) => k.toLowerCase().includes(query.toLowerCase()))
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelect = (tool: ToolRegistryItem) => {
    onClose();
    router.push(`/tools/${tool.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTools.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % filteredTools.length);
    } else if (e.key === 'Enter' && filteredTools[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredTools[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-navy-950/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-navy-200 overflow-hidden">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-navy-200 bg-navy-50/50">
          <Search className="h-5 w-5 text-brand-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search geographic tools, calculators, coordinate converters..."
            className="w-full bg-transparent text-sm font-medium text-navy-900 placeholder:text-navy-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-navy-400 hover:text-navy-700 hover:bg-navy-100"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-navy-100">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={tool.slug}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${
                    isSelected ? 'bg-brand-50 text-navy-950 border border-brand-200' : 'hover:bg-navy-50 text-navy-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-navy-100 text-navy-600'
                      }`}
                    >
                      <Compass className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{tool.name}</span>
                        {tool.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 text-brand-800">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-navy-500 line-clamp-1 mt-0.5">{tool.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <CornerDownLeft className="h-4 w-4 text-brand-600 shrink-0 ml-2" />
                  )}
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-sm text-navy-500">
              No tools matching &quot;{query}&quot;. Try &quot;radius&quot;, &quot;coordinates&quot;, or &quot;area&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-4 py-2 text-[11px] text-navy-400 bg-navy-50 border-t border-navy-100">
          <div className="flex items-center gap-3">
            <span><kbd className="font-mono bg-white px-1 py-0.5 rounded border border-navy-200">↑</kbd> <kbd className="font-mono bg-white px-1 py-0.5 rounded border border-navy-200">↓</kbd> navigate</span>
            <span><kbd className="font-mono bg-white px-1 py-0.5 rounded border border-navy-200">↵</kbd> select</span>
            <span><kbd className="font-mono bg-white px-1 py-0.5 rounded border border-navy-200">esc</kbd> close</span>
          </div>
          <span>GeoMap Suite Tools Directory</span>
        </div>
      </div>
    </div>
  );
}
