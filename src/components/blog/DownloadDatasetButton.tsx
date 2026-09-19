'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface DownloadDatasetButtonProps {
  csvData: string;
  fileName?: string;
  label?: string;
}

export function DownloadDatasetButton({
  csvData,
  fileName = 'geomap-suite-dataset.csv',
  label = 'Download CSV Dataset',
}: DownloadDatasetButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#2a6e4e] px-4 py-2 text-xs font-semibold text-white hover:bg-[#235c41] shadow-xs transition-colors"
    >
      <Download className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}
