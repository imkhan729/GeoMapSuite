export const TROPIC_OF_CANCER_REFERENCE_LATITUDE = 23.4364;
const WGS84_SEMI_MAJOR_AXIS_METERS = 6_378_137;
const WGS84_FLATTENING = 1 / 298.257223563;

export function clampTropicLongitude(longitude: number): number {
  if (!Number.isFinite(longitude)) return 0;
  return Math.max(-180, Math.min(180, longitude));
}

export function formatLongitudeDms(longitude: number): string {
  const bounded = clampTropicLongitude(longitude);
  const hemisphere = bounded < 0 ? 'W' : 'E';
  const absolute = Math.abs(bounded);
  const degrees = Math.floor(absolute);
  const minutesFloat = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  return `${degrees}° ${String(minutes).padStart(2, '0')}′ ${seconds.toFixed(2).padStart(5, '0')}″ ${hemisphere}`;
}

/** WGS 84 length of a parallel at the reference latitude, not surface distance. */
export function getTropicParallelCircumferenceKm(latitude = TROPIC_OF_CANCER_REFERENCE_LATITUDE): number {
  const phi = (latitude * Math.PI) / 180;
  const eccentricitySquared = WGS84_FLATTENING * (2 - WGS84_FLATTENING);
  const primeVerticalRadius = WGS84_SEMI_MAJOR_AXIS_METERS / Math.sqrt(1 - eccentricitySquared * Math.sin(phi) ** 2);
  return (2 * Math.PI * primeVerticalRadius * Math.cos(phi)) / 1_000;
}
