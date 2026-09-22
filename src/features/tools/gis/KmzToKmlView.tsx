'use client';
import { useState } from 'react';
import { Download, Upload } from 'lucide-react';

export function KmzToKmlView() {
  const [status, setStatus] = useState('Upload a KMZ archive to extract its main KML document locally.');
  const extract = async (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; try { const bytes = new Uint8Array(await file.arrayBuffer()); const text = await unzipKml(bytes); const blob = new Blob([text], { type: 'application/vnd.google-earth.kml+xml' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = file.name.replace(/\.kmz$/i, '') + '.kml'; a.click(); URL.revokeObjectURL(url); setStatus('KML extracted and downloaded.'); } catch (err) { setStatus(err instanceof Error ? err.message : 'Could not extract this KMZ.'); } };
  return <div className="space-y-5"><div className="rounded-2xl border-2 border-dashed border-navy-200 bg-navy-50/50 p-8 text-center"><label htmlFor="kmz-extract-upload" className="cursor-pointer font-bold text-brand-600"><Upload className="mr-1 inline h-5 w-5" />Choose KMZ file<input id="kmz-extract-upload" type="file" accept=".kmz,application/vnd.google-earth.kmz" onChange={extract} className="hidden" /></label><p className="mt-2 text-xs text-navy-500">ZIP extraction happens in your browser. No upload or account required.</p></div><div className="rounded-2xl border border-navy-200 bg-white p-5 text-center text-sm text-navy-600" aria-live="polite"><Download className="mx-auto mb-2 h-6 w-6 text-brand-600" />{status}</div></div>;
}

async function unzipKml(bytes: Uint8Array): Promise<string> {
  const view = new DataView(bytes.buffer); let eocd = -1;
  for (let i = bytes.length - 22; i >= 0 && i > bytes.length - 65558; i--) if (view.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('This is not a valid KMZ ZIP archive.');
  const centralOffset = view.getUint32(eocd + 16, true); const nameLength = view.getUint16(centralOffset + 28, true); const extraLength = view.getUint16(centralOffset + 30, true); const commentLength = view.getUint16(centralOffset + 32, true); const entryCount = view.getUint16(eocd + 10, true); let cursor = centralOffset; let chosen: { method: number; offset: number; size: number; name: string } | null = null;
  for (let i = 0; i < entryCount; i++) { const nameLen = view.getUint16(cursor + 28, true); const extraLen = view.getUint16(cursor + 30, true); const commentLen = view.getUint16(cursor + 32, true); const decoder = new TextDecoder(); const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLen)); const method = view.getUint16(cursor + 10, true); const size = view.getUint32(cursor + 24, true); const offset = view.getUint32(cursor + 42, true); if (!chosen && name.toLowerCase().endsWith('.kml')) chosen = { method, offset, size, name }; cursor += 46 + nameLen + extraLen + commentLen; }
  if (!chosen) throw new Error('No .kml document was found inside this KMZ.');
  const localNameLen = view.getUint16(chosen.offset + 26, true); const localExtraLen = view.getUint16(chosen.offset + 28, true); const start = chosen.offset + 30 + localNameLen + localExtraLen; const compressed = bytes.slice(start, start + chosen.size);
  if (chosen.method === 0) return new TextDecoder().decode(compressed);
  if (chosen.method === 8 && 'DecompressionStream' in window) { const stream = new DecompressionStream('deflate-raw'); const output = await new Response(new Blob([compressed.buffer as ArrayBuffer]).stream().pipeThrough(stream)).arrayBuffer(); return new TextDecoder().decode(output); }
  throw new Error('This archive uses an unsupported ZIP compression method.');
}
