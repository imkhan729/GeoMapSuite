declare module 'open-location-code' {
  export class OpenLocationCode {
    encode(latitude: number, longitude: number, codeLength?: number): string;
    decode(code: string): {
      latitudeCenter: number;
      longitudeCenter: number;
      latitudeLo: number;
      longitudeLo: number;
      latitudeHi: number;
      longitudeHi: number;
      codeLength: number;
    };
    isValid(code: string): boolean;
    isShort(code: string): boolean;
    isFull(code: string): boolean;
  }
}

declare module 'mgrs' {
  export function forward(ll: [number, number], accuracy?: number): string;
  export function toPoint(mgrs: string): [number, number];
  export function inverse(mgrs: string): [number, number, number, number];
}

declare module 'geographiclib-geodesic' {
  export interface GeodesicResult {
    lat1?: number;
    lon1?: number;
    azi1?: number;
    lat2?: number;
    lon2?: number;
    azi2?: number;
    s12?: number;
    a12?: number;
    m12?: number;
    M12?: number;
    M21?: number;
    S12?: number;
  }

  export class Geodesic {
    static readonly WGS84: Geodesic;
    constructor(a: number, f: number);
    Inverse(lat1: number, lon1: number, lat2: number, lon2: number, outmask?: number): GeodesicResult;
    Direct(lat1: number, lon1: number, azi1: number, s12: number, outmask?: number): GeodesicResult;
  }

  export class PolygonArea {
    constructor(earth: Geodesic, polyline?: boolean);
    AddPoint(lat: number, lon: number): void;
    AddEdge(azi: number, s: number): void;
    Compute(reverse: boolean, sign: boolean): { number: number; perimeter: number; area: number };
    TestPoint(lat: number, lon: number, reverse: boolean, sign: boolean): { number: number; perimeter: number; area: number };
    Clear(): void;
  }
}
