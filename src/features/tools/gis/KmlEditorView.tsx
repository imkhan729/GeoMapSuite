'use client';

import { useState } from 'react';
import { Download, FileCode2, Upload } from 'lucide-react';
import { downloadFile } from '@/lib/geo/export';

type Feature = { name: string; type: string; coordinates: string; visible: boolean; color: string };

const sample: Feature[] = [{ name: 'Sample placemark', type: 'Point', coordinates: '-122.4194,37.7749,0', visible: true, color: '#2a6e4e' }];

export function KmlEditorView() {
  const [features, setFeatures] = useState<Feature[]>(sample);
  const [fileName, setFileName] = useState('edited-map.kml');
  const [message, setMessage] = useState('Load a KML file to edit placemark names, visibility, and basic colors.');

  const parse = (text: string) => {
    const xml = new DOMParser().parseFromString(text, 'text/xml');
    if (xml.querySelector('parsererror')) throw new Error('Invalid KML XML.');
    const next: Feature[] = [];
    xml.querySelectorAll('Placemark').forEach((pm) => {
      const geometry = pm.querySelector('Point, LineString, Polygon');
      const coordinates = geometry?.querySelector('coordinates')?.textContent?.trim().replace(/\s+/g, ' ') || '';
      if (geometry && coordinates) next.push({ name: pm.querySelector('name')?.textContent?.trim() || 'Untitled placemark', type: geometry.tagName, coordinates, visible: true, color: '#2a6e4e' });
    });
    if (!next.length) throw new Error('No supported Point, LineString, or Polygon placemarks found.');
    setFeatures(next); setMessage(`${next.length} placemark${next.length === 1 ? '' : 's'} ready to edit.`);
  };

  const upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return; setFileName(file.name.replace(/\.(kmz|kml)$/i, '') + '-edited.kml');
    const reader = new FileReader(); reader.onload = () => { try { parse(String(reader.result || '')); } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not read this KML file.'); } }; reader.readAsText(file);
  };

  const update = (index: number, patch: Partial<Feature>) => setFeatures((items) => items.map((item, i) => i === index ? { ...item, ...patch } : item));
  const exportKml = () => {
    const placemarks = features.filter((f) => f.visible).map((f) => `<Placemark><name>${escapeXml(f.name)}</name><Style><LineStyle><color>${hexToKml(f.color)}</color><width>3</width></LineStyle><PolyStyle><color>${hexToKml(f.color)}</color></PolyStyle></Style>${geometryMarkup(f)}</Placemark>`).join('');
    const output = `<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><name>Edited KML</name>${placemarks}</Document></kml>`;
    downloadFile(output, fileName, 'application/vnd.google-earth.kml+xml'); setMessage('Edited KML downloaded.');
  };
  return <div className="space-y-5">
    <div className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-6 text-center space-y-3"><FileCode2 className="mx-auto h-8 w-8 text-brand-600" /><label htmlFor="kml-editor-upload" className="cursor-pointer font-bold text-brand-600"><Upload className="mr-1 inline h-4 w-4" />Upload KML file</label><input id="kml-editor-upload" type="file" accept=".kml" onChange={upload} className="hidden" /><p className="text-xs text-navy-500">Edit locally in your browser. Files are never uploaded.</p></div>
    <div className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs"><div className="mb-3 flex items-center justify-between"><div><h3 className="font-bold text-navy-900">Placemark editor</h3><p className="text-xs text-navy-500">{message}</p></div><button onClick={exportKml} className="rounded-xl bg-brand-600 px-3 py-2 text-xs font-bold text-white"><Download className="mr-1 inline h-3.5 w-3.5" />Download KML</button></div><div className="space-y-3">{features.map((feature, index) => <div key={index} className="grid gap-2 rounded-xl border border-navy-100 p-3 sm:grid-cols-[1fr_auto_auto] sm:items-center"><input value={feature.name} onChange={(e) => update(index, { name: e.target.value })} aria-label={`Placemark ${index + 1} name`} className="rounded-lg border border-navy-200 px-3 py-2 text-sm" /><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={feature.visible} onChange={(e) => update(index, { visible: e.target.checked })} />Visible</label><input type="color" value={feature.color} onChange={(e) => update(index, { color: e.target.value })} aria-label={`Placemark ${index + 1} color`} className="h-9 w-12 rounded border border-navy-200" /><p className="text-[11px] text-navy-500 sm:col-span-3">{feature.type} · {feature.coordinates.slice(0, 90)}{feature.coordinates.length > 90 ? '…' : ''}</p></div>)}</div></div>
  </div>;
}

function escapeXml(value: string) { return value.replace(/[<>&'\"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c] || c)); }
function hexToKml(hex: string) { const h = hex.replace('#', ''); return `ff${h.slice(4, 6)}${h.slice(2, 4)}${h.slice(0, 2)}`; }
function geometryMarkup(feature: Feature) { if (feature.type === 'Polygon') return `<Polygon><outerBoundaryIs><LinearRing><coordinates>${feature.coordinates}</coordinates></LinearRing></outerBoundaryIs></Polygon>`; return `<${feature.type}><coordinates>${feature.coordinates}</coordinates></${feature.type}>`; }
