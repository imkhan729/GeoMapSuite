'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Upload } from 'lucide-react';

type Issue = { level: 'error' | 'warning' | 'pass'; text: string };
const sample = `<?xml version="1.0"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><Placemark><name>Sample point</name><Point><coordinates>-122.4194,37.7749,0</coordinates></Point></Placemark></Document></kml>`;

export function KmlValidatorView() {
  const [text, setText] = useState(sample);
  const [issues, setIssues] = useState<Issue[]>([]);
  const validate = (value = text) => {
    const results: Issue[] = [];
    const xml = new DOMParser().parseFromString(value, 'text/xml');
    if (xml.querySelector('parsererror')) { setIssues([{ level: 'error', text: 'XML is not well-formed. Check closing tags, quotes, and special characters.' }]); return; }
    const root = xml.documentElement;
    if (root?.localName !== 'kml') results.push({ level: 'error', text: 'The document root must be <kml>.' });
    if (!root?.namespaceURI?.includes('opengis.net/kml')) results.push({ level: 'warning', text: 'The root namespace is not the standard OGC KML namespace.' });
    const placemarks = Array.from(xml.getElementsByTagNameNS('*', 'Placemark'));
    if (!placemarks.length) results.push({ level: 'warning', text: 'No Placemark elements were found.' });
    let coordinateCount = 0;
    placemarks.forEach((pm, index) => {
      if (!pm.getElementsByTagNameNS('*', 'name')[0]?.textContent?.trim()) results.push({ level: 'warning', text: `Placemark ${index + 1} has no name.` });
      Array.from(pm.getElementsByTagNameNS('*', 'coordinates')).forEach((node) => node.textContent?.trim().split(/\s+/).forEach((pair) => {
        const [lon, lat] = pair.split(',').map(Number); coordinateCount++;
        if (!Number.isFinite(lon) || !Number.isFinite(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) results.push({ level: 'error', text: `Invalid coordinate in Placemark ${index + 1}: ${pair}` });
      }));
    });
    if (coordinateCount) results.push({ level: 'pass', text: `${coordinateCount} coordinate tuple${coordinateCount === 1 ? '' : 's'} checked within WGS 84 bounds.` });
    if (!results.some((i) => i.level === 'error')) results.unshift({ level: 'pass', text: `Valid XML KML structure with ${placemarks.length} Placemark${placemarks.length === 1 ? '' : 's'}.` });
    setIssues(results);
  };
  const upload = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { const value = String(reader.result || ''); setText(value); validate(value); }; reader.readAsText(file); };
  return <div className="space-y-5"><div className="grid gap-4 lg:grid-cols-2"><section className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs"><div className="mb-3 flex items-center justify-between"><h3 className="font-bold text-navy-900">KML source</h3><label className="cursor-pointer rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700"><Upload className="mr-1 inline h-3.5 w-3.5" />Upload KML<input type="file" accept=".kml" onChange={upload} className="hidden" /></label></div><textarea value={text} onChange={(e) => setText(e.target.value)} rows={18} className="w-full rounded-xl bg-navy-950 p-3 font-mono text-xs text-navy-100" /><button onClick={() => validate()} className="mt-3 w-full rounded-xl bg-brand-600 py-3 text-sm font-bold text-white">Validate KML</button><p className="mt-2 text-center text-xs text-navy-500">Parsed locally. No file upload or server processing.</p></section><section className="rounded-2xl border border-navy-200 bg-white p-4 shadow-xs"><h3 className="mb-3 font-bold text-navy-900">Validation report</h3>{issues.length ? <div className="space-y-2" aria-live="polite">{issues.map((issue, i) => <div key={i} className={`flex gap-2 rounded-xl border p-3 text-sm ${issue.level === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' : issue.level === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-800' : 'border-emerald-200 bg-emerald-50 text-emerald-800'}`}>{issue.level === 'error' ? <AlertCircle className="h-4 w-4 shrink-0" /> : <CheckCircle2 className="h-4 w-4 shrink-0" />}<span>{issue.text}</span></div>)}</div> : <p className="rounded-xl bg-navy-50 p-4 text-sm text-navy-600">Run validation to check XML, namespace, Placemark structure, and coordinate bounds.</p>}</section></div></div>;
}
