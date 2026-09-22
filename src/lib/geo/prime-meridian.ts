export const PRIME_MERIDIAN_LONGITUDE = 0;
export function clampPrimeLatitude(latitude: number): number { if (!Number.isFinite(latitude)) return 0; return Math.max(-90, Math.min(90, latitude)); }
export function formatPrimeLatitudeDms(latitude: number): string { const b=clampPrimeLatitude(latitude); const h=b<0?'S':'N'; const a=Math.abs(b); const d=Math.floor(a); const mf=(a-d)*60; let m=Math.floor(mf); let s=Number(((mf-m)*60).toFixed(2)); if(s>=60){s=0;m+=1;} return `${d}° ${String(m).padStart(2,'0')}′ ${s.toFixed(2).padStart(5,'0')}″ ${h}`; }
