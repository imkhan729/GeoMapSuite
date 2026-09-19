import React from 'react';
import { ShieldCheck, Lock, Sparkles, Database } from 'lucide-react';

interface TrustStripProps {
  dataSource?: string;
  accuracyMode?: string;
}

export function TrustStrip({
  dataSource = 'WGS84 Datum / OpenStreetMap',
  accuracyMode = 'Ellipsoidal Geodesic',
}: TrustStripProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 py-2 text-[11px] sm:text-xs text-[#54524b] font-medium">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f4f8f5] px-3 py-1 text-[#235c41] border border-[#c7ded2]">
        <Sparkles className="h-3 w-3 text-[#2a6e4e]" />
        <span>100% Free &amp; Private</span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fcfbf9] px-3 py-1 text-[#54524b] border border-[#e8e6e1]">
        <Lock className="h-3 w-3 text-[#737067]" />
        <span>Client-Side Execution</span>
      </div>
      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#fcfbf9] px-3 py-1 text-[#54524b] border border-[#e8e6e1]">
        <Database className="h-3 w-3 text-[#737067]" />
        <span>Data: {dataSource}</span>
      </div>
      <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#fcfbf9] px-3 py-1 text-[#54524b] border border-[#e8e6e1]">
        <ShieldCheck className="h-3 w-3 text-[#2a6e4e]" />
        <span>Accuracy: {accuracyMode}</span>
      </div>
    </div>
  );
}
