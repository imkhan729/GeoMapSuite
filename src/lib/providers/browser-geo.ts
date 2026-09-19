import { generateGeodesicCircle } from '@/lib/geo';

export interface GeoSearchResult {
  id: string;
  displayName: string;
  lat: number;
  lng: number;
  type?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

export interface ReverseGeoResult {
  displayName: string;
  road?: string;
  city?: string;
  district?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
  countryEn?: string;
  countryCode?: string;
}

export async function searchPlaces(query: string): Promise<GeoSearchResult[]> {
  const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query.trim())}&limit=5`);
  if (!response.ok) throw new Error('Location search is temporarily unavailable.');
  const data = await response.json();
  return (data.features || []).map((feature: any) => {
    const [lng, lat] = feature.geometry.coordinates;
    const props = feature.properties || {};
    const parts = [props.name, props.street, props.city, props.state, props.country].filter(Boolean);
    return {
      id: String(props.osm_id || `${lat},${lng}`),
      displayName: parts.join(', ') || `${lat}, ${lng}`,
      lat,
      lng,
      type: props.osm_value || props.type || 'place',
      city: props.city || props.town,
      state: props.state,
      country: props.country,
      postcode: props.postcode,
    };
  });
}

export async function reverseGeocodePoint(lat: number, lng: number): Promise<ReverseGeoResult> {
  const response = await fetch(`https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`);
  if (!response.ok) throw new Error('Address lookup is temporarily unavailable.');
  const data = await response.json();
  const props = data.features?.[0]?.properties || {};
  const countryCode = String(props.countrycode || '').toUpperCase();
  let countryEn = props.country || '';
  if (countryCode.length === 2) {
    try {
      countryEn = new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryEn;
    } catch {}
  }
  const district = props.district || props.locality || props.suburb;
  const municipality = props.municipality;
  const city = props.city || props.town || props.village || municipality;
  const street = props.street || (props.type === 'street' ? props.name : undefined);
  const road = props.housenumber ? `${props.housenumber} ${street || ''}`.trim() : (street || props.name);
  const parts = [road, district, city, props.county, props.state, props.postcode, countryEn].filter(Boolean);
  return {
    displayName: parts.join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    road,
    city,
    district,
    municipality,
    county: props.county,
    state: props.state,
    postcode: props.postcode,
    country: props.country || countryEn,
    countryEn,
    countryCode,
  };
}

export async function lookupElevation(lat: number, lng: number) {
  const response = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
  if (!response.ok) throw new Error('Elevation lookup is temporarily unavailable.');
  const data = await response.json();
  const elevationMeters = Array.isArray(data.elevation) ? data.elevation[0] : data.elevation;
  return {
    elevationMeters,
    elevationFeet: Number((elevationMeters * 3.280839895).toFixed(1)),
  };
}

export function createTravelTimeEstimates(lat: number, lng: number, times: number[], profile: string) {
  const speedKmh = profile === 'walking' ? 4.5 : profile === 'cycling' ? 15 : 45;
  const detourFactor = 1.35;
  const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
  return times.map((minutes, index) => {
    const radiusMeters = ((speedKmh * 1000) / 60) * (minutes / detourFactor);
    return {
      timeMinutes: minutes,
      radiusApproxKm: Number((radiusMeters / 1000).toFixed(1)),
      color: colors[index % colors.length],
      geometry: { type: 'Polygon', coordinates: [generateGeodesicCircle({ lat, lng }, radiusMeters, 72)] },
    };
  });
}
