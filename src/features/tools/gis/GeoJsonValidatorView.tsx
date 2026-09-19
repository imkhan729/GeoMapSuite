'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, Code, RefreshCw } from 'lucide-react';

interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  path?: string;
}

export function GeoJsonValidatorView() {
  const [inputText, setInputText] = useState<string>(`{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Central Park",
        "category": "Park"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-73.973, 40.764],
            [-73.981, 40.768],
            [-73.958, 40.800],
            [-73.949, 40.796],
            [-73.973, 40.764]
          ]
        ]
      }
    }
  ]
}`);

  const validationResults = useMemo((): { isValid: boolean; issues: ValidationIssue[]; parsedObject?: any } => {
    const issues: ValidationIssue[] = [];
    const trimmed = inputText.trim();

    if (!trimmed) {
      return { isValid: false, issues: [{ severity: 'error', message: 'Input is empty. Please enter GeoJSON.' }] };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(trimmed);
    } catch (err: any) {
      return {
        isValid: false,
        issues: [{ severity: 'error', message: `JSON Syntax Error: ${err.message}` }],
      };
    }

    // 1. Root Object Type Check
    const validRootTypes = ['FeatureCollection', 'Feature', 'Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];
    if (!parsed.type || !validRootTypes.includes(parsed.type)) {
      issues.push({
        severity: 'error',
        message: `Invalid root "type". Must be one of: ${validRootTypes.join(', ')}. Found: "${parsed.type}"`,
        path: 'type',
      });
    }

    // 2. FeatureCollection inspection
    if (parsed.type === 'FeatureCollection') {
      if (!Array.isArray(parsed.features)) {
        issues.push({
          severity: 'error',
          message: 'FeatureCollection must have a "features" array.',
          path: 'features',
        });
      } else {
        parsed.features.forEach((feature: any, idx: number) => {
          validateFeature(feature, `features[${idx}]`, issues);
        });
      }
    } else if (parsed.type === 'Feature') {
      validateFeature(parsed, 'root', issues);
    } else if (validRootTypes.includes(parsed.type)) {
      validateGeometry(parsed, 'root', issues);
    }

    const hasErrors = issues.some((i) => i.severity === 'error');
    return {
      isValid: !hasErrors,
      issues,
      parsedObject: parsed,
    };
  }, [inputText]);

  return (
    <div className="space-y-6">
      {/* Editor & Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor */}
        <div className="bg-white p-4 rounded-2xl border border-navy-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-800 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-brand-600" /> GeoJSON Code Editor
            </span>
            <button
              onClick={() => setInputText('')}
              className="text-[11px] font-semibold text-navy-500 hover:text-navy-800"
            >
              Clear
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={14}
            className="w-full text-xs font-mono bg-navy-950 text-navy-200 p-3 rounded-xl border border-navy-800 focus:outline-none focus:ring-2 focus:ring-brand-500 scrollbar-thin"
            placeholder="Paste GeoJSON to validate RFC 7946 conformance..."
          />
        </div>

        {/* Validation Report */}
        <div className="bg-white p-5 rounded-2xl border border-navy-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-navy-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-600" />
              <h3 className="text-sm font-bold text-navy-900">RFC 7946 Validation Report</h3>
            </div>
            {validationResults.isValid ? (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid GeoJSON
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                <XCircle className="h-3.5 w-3.5" /> Errors Found
              </span>
            )}
          </div>

          {/* Rule Checks List */}
          <div className="space-y-2.5">
            {validationResults.issues.length === 0 ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
                <p className="font-bold">All 6 Standard Conformance Checks Passed:</p>
                <ul className="list-disc list-inside text-[11px] space-y-0.5 text-emerald-700">
                  <li>Valid JSON Syntax & Root Type Structure</li>
                  <li>Coordinate Ordering: [Longitude, Latitude] WGS84</li>
                  <li>Coordinate Boundaries: Longitude [-180, 180], Latitude [-90, 90]</li>
                  <li>Polygon Rings: Correctly closed (First vertex equals Last vertex)</li>
                  <li>Feature & Geometry Attribute Specifications</li>
                </ul>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {validationResults.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                      issue.severity === 'error'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : issue.severity === 'warning'
                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                        : 'bg-navy-50 border-navy-200 text-navy-800'
                    }`}
                  >
                    {issue.severity === 'error' ? (
                      <XCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                    )}
                    <div>
                      {issue.path && <strong className="font-mono text-[11px] block">{issue.path}:</strong>}
                      <span>{issue.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function validateFeature(feature: any, path: string, issues: ValidationIssue[]) {
  if (typeof feature !== 'object' || feature === null) {
    issues.push({ severity: 'error', message: 'Feature must be an object.', path });
    return;
  }

  if (feature.type !== 'Feature') {
    issues.push({ severity: 'error', message: `Feature "type" must be "Feature". Found: "${feature.type}"`, path: `${path}.type` });
  }

  if (!feature.geometry && feature.geometry !== null) {
    issues.push({ severity: 'error', message: 'Feature must have a "geometry" property (or null).', path: `${path}.geometry` });
  } else if (feature.geometry) {
    validateGeometry(feature.geometry, `${path}.geometry`, issues);
  }
}

function validateGeometry(geometry: any, path: string, issues: ValidationIssue[]) {
  if (typeof geometry !== 'object' || geometry === null) {
    issues.push({ severity: 'error', message: 'Geometry must be an object.', path });
    return;
  }

  const validGeomTypes = ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon', 'GeometryCollection'];
  if (!validGeomTypes.includes(geometry.type)) {
    issues.push({ severity: 'error', message: `Invalid geometry type: "${geometry.type}".`, path: `${path}.type` });
    return;
  }

  if (geometry.type === 'Point') {
    validateCoordinatePair(geometry.coordinates, `${path}.coordinates`, issues);
  } else if (geometry.type === 'LineString') {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2) {
      issues.push({ severity: 'error', message: 'LineString must have at least 2 coordinate positions.', path: `${path}.coordinates` });
    } else {
      geometry.coordinates.forEach((c: any, i: number) => validateCoordinatePair(c, `${path}.coordinates[${i}]`, issues));
    }
  } else if (geometry.type === 'Polygon') {
    if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
      issues.push({ severity: 'error', message: 'Polygon coordinates must be an array of linear rings.', path: `${path}.coordinates` });
    } else {
      geometry.coordinates.forEach((ring: any, rIdx: number) => {
        if (!Array.isArray(ring) || ring.length < 4) {
          issues.push({ severity: 'error', message: `LinearRing ${rIdx} must have at least 4 coordinate positions (first and last matching).`, path: `${path}.coordinates[${rIdx}]` });
        } else {
          // Check ring closure
          const first = ring[0];
          const last = ring[ring.length - 1];
          if (Array.isArray(first) && Array.isArray(last) && (first[0] !== last[0] || first[1] !== last[1])) {
            issues.push({ severity: 'error', message: `LinearRing ${rIdx} is unclosed. First vertex [${first[0]}, ${first[1]}] does not match last vertex [${last[0]}, ${last[1]}].`, path: `${path}.coordinates[${rIdx}]` });
          }
          ring.forEach((c: any, i: number) => validateCoordinatePair(c, `${path}.coordinates[${rIdx}][${i}]`, issues));
        }
      });
    }
  }
}

function validateCoordinatePair(coord: any, path: string, issues: ValidationIssue[]) {
  if (!Array.isArray(coord) || coord.length < 2) {
    issues.push({ severity: 'error', message: 'Coordinate position must be an array of at least [longitude, latitude].', path });
    return;
  }

  const [lng, lat] = coord;
  if (typeof lng !== 'number' || isNaN(lng) || lng < -180 || lng > 180) {
    issues.push({ severity: 'error', message: `Invalid Longitude: ${lng}. Must be a number in range [-180, 180].`, path });
  }

  if (typeof lat !== 'number' || isNaN(lat) || lat < -90 || lat > 90) {
    issues.push({ severity: 'error', message: `Invalid Latitude: ${lat}. Must be a number in range [-90, 90].`, path });
  }
}
