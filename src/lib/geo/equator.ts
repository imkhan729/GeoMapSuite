export const EQUATOR_LATITUDE = 0;
export const WGS84_EQUATORIAL_RADIUS_METERS = 6_378_137;
export const WGS84_EQUATOR_CIRCUMFERENCE_KM =
  (2 * Math.PI * WGS84_EQUATORIAL_RADIUS_METERS) / 1_000;

export function clampEquatorLongitude(longitude: number): number {
  if (!Number.isFinite(longitude)) return 0;
  return Math.max(-180, Math.min(180, longitude));
}

export function formatLongitudeDms(longitude: number): string {
  const bounded = clampEquatorLongitude(longitude);
  const hemisphere = bounded < 0 ? 'W' : 'E';
  const absolute = Math.abs(bounded);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  return `${degrees}° ${String(minutes).padStart(2, '0')}′ ${seconds.toFixed(2).padStart(5, '0')}″ ${hemisphere}`;
}
