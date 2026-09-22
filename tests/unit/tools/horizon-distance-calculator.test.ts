import { describe, it, expect } from 'vitest';
import {
  calculateHorizonDistance,
  calculateEarthCurvatureDrop,
  convertHeightToMeters,
  convertMetersToHeight,
  HORIZON_PRESETS,
  REFRACTION_FACTORS,
} from '@/lib/geo/horizon';

describe('Horizon Distance Calculator Engine', () => {
  describe('Standard Observer Horizon Calculations', () => {
    it('calculates accurate optical and geometric horizon for a standing human (1.74m / 5.71ft)', () => {
      const heightMeters = 1.74; // ~5.71 ft
      const result = calculateHorizonDistance(heightMeters, { refractionModel: 'optical' });

      // Geometric vacuum distance is sqrt(2 * 6371000 * 1.74) ~= 4,709 m (~2.93 miles)
      expect(result.geometricDistanceMiles).toBeGreaterThan(2.9);
      expect(result.geometricDistanceMiles).toBeLessThan(3.0);
      expect(result.geometricDistanceKm).toBeCloseTo(4.71, 1);

      // Optical refraction (k=7/6) extends distance by ~8% to ~5,089 m (~3.16 miles)
      expect(result.horizonDistanceMiles).toBeGreaterThan(3.1);
      expect(result.horizonDistanceMiles).toBeLessThan(3.25);
      expect(result.horizonDistanceKm).toBeGreaterThan(result.geometricDistanceKm);

      // Dip angle at eye level is very small (~0.03° to 0.05°)
      expect(result.dipAngleDegrees).toBeGreaterThan(0.03);
      expect(result.dipAngleDegrees).toBeLessThan(0.06);
    });

    it('correctly models different atmospheric refraction modes (optical vs geometric vs radio)', () => {
      const heightMeters = 50; // 50m tower
      const geometric = calculateHorizonDistance(heightMeters, { refractionModel: 'geometric' });
      const optical = calculateHorizonDistance(heightMeters, { refractionModel: 'optical' });
      const radio = calculateHorizonDistance(heightMeters, { refractionModel: 'radio' });

      expect(geometric.refractionFactor).toBe(1.0);
      expect(optical.refractionFactor).toBeCloseTo(7 / 6, 3);
      expect(radio.refractionFactor).toBeCloseTo(4 / 3, 3);

      // Radio horizon > Optical horizon > Geometric horizon
      expect(radio.horizonDistanceMeters).toBeGreaterThan(optical.horizonDistanceMeters);
      expect(optical.horizonDistanceMeters).toBeGreaterThan(geometric.horizonDistanceMeters);

      // Geometric horizon should match vacuum baseline
      expect(geometric.horizonDistanceMeters).toBeCloseTo(geometric.geometricDistanceMeters, 2);
    });

    it('calculates airliner cruise altitude (FL360 / 36,000 ft) horizon and dip angle', () => {
      const heightFeet = 36000;
      const heightMeters = heightFeet * 0.3048; // 10,972.8 m
      const result = calculateHorizonDistance(heightMeters, { refractionModel: 'optical' });

      // At 36,000 ft, horizon is ~240-260 miles away
      expect(result.horizonDistanceMiles).toBeGreaterThan(240);
      expect(result.horizonDistanceMiles).toBeLessThan(260);

      // Dip angle is between 3.0° and 3.5°
      expect(result.dipAngleDegrees).toBeGreaterThan(3.0);
      expect(result.dipAngleDegrees).toBeLessThan(3.5);
    });
  });

  describe('Target Visibility & Earth Curvature Concealment', () => {
    it('shows full visibility when target is within observer horizon', () => {
      const observerHeight = 15; // 15m (~49 ft)
      const targetHeight = 10; // 10m (~33 ft)
      const distanceToTarget = 5000; // 5 km (well within 15m horizon)

      const result = calculateHorizonDistance(observerHeight, {
        targetHeightMeters: targetHeight,
        distanceToTargetMeters: distanceToTarget,
        refractionModel: 'optical',
      });

      expect(result.isVisible).toBe(true);
      expect(result.hiddenHeightMeters).toBe(0);
      expect(result.hiddenHeightFeet).toBe(0);
    });

    it('calculates partially concealed target beyond observer horizon', () => {
      const observerHeight = 1.74; // Standing observer horizon is ~5.09 km
      const targetHeight = 30; // 30m lighthouse
      const distanceToTarget = 20000; // 20 km (beyond observer horizon of 5.09 km)

      const result = calculateHorizonDistance(observerHeight, {
        targetHeightMeters: targetHeight,
        distanceToTargetMeters: distanceToTarget,
        refractionModel: 'optical',
      });

      // Target is beyond observer horizon, so hidden height > 0
      expect(result.hiddenHeightMeters).toBeGreaterThan(5);
      expect(result.hiddenHeightMeters).toBeLessThan(20);
      // Since target height (30m) > hidden height (~15m), top portion is visible
      expect(result.isVisible).toBe(true);
    });

    it('marks target as invisible when Earth curvature completely submerges it', () => {
      const observerHeight = 1.74; // Horizon ~5 km
      const targetHeight = 5; // 5m small vessel
      const distanceToTarget = 30000; // 30 km away

      const result = calculateHorizonDistance(observerHeight, {
        targetHeightMeters: targetHeight,
        distanceToTargetMeters: distanceToTarget,
        refractionModel: 'optical',
      });

      // At 30 km with 1.74m eye height, hidden height is > 40 meters
      expect(result.hiddenHeightMeters).toBeGreaterThan(30);
      // 5m vessel is completely submerged below curvature
      expect(result.isVisible).toBe(false);
    });

    it('calculates combined maximum line of sight between two elevated points', () => {
      const h1 = 50; // 50m Cape Hatteras focal plane
      const h2 = 20; // 20m ship mast
      const result = calculateHorizonDistance(h1, {
        targetHeightMeters: h2,
        refractionModel: 'optical',
      });

      expect(result.maxLineOfSightDistanceMeters).toBeDefined();
      expect(result.maxLineOfSightDistanceMeters).toBe(
        result.horizonDistanceMeters + result.targetHorizonDistanceMeters!
      );
      // Sighting range should be ~44 km (~27 miles)
      expect(result.maxLineOfSightDistanceMiles!).toBeGreaterThan(25);
      expect(result.maxLineOfSightDistanceMiles!).toBeLessThan(30);
    });
  });

  describe('Earth Curvature Drop Formula', () => {
    it('calculates standard curvature drop (~8 inches at 1 mile, ~66.7 ft at 10 miles)', () => {
      const oneMileMeters = 1609.344;
      const drop1 = calculateEarthCurvatureDrop(oneMileMeters);

      // 8 inches = 0.667 feet = 0.203 meters
      expect(drop1.dropFeet).toBeCloseTo(0.667, 1);
      expect(drop1.dropMeters).toBeCloseTo(0.203, 1);

      const tenMilesMeters = 10 * 1609.344;
      const drop10 = calculateEarthCurvatureDrop(tenMilesMeters);

      // (10)^2 * 8 inches = 800 inches = ~66.7 feet = ~20.3 meters
      expect(drop10.dropFeet).toBeCloseTo(66.7, 0);
    });
  });

  describe('Unit Conversions & Presets', () => {
    it('accurately converts height units back and forth', () => {
      const feet = 100;
      const meters = convertHeightToMeters(feet, 'feet');
      expect(meters).toBeCloseTo(30.48, 2);

      const backToFeet = convertMetersToHeight(meters, 'feet');
      expect(backToFeet).toBeCloseTo(100, 2);

      const miles = convertMetersToHeight(1609.344, 'miles');
      expect(miles).toBeCloseTo(1.0, 3);
    });

    it('contains comprehensive real-world height presets', () => {
      expect(HORIZON_PRESETS.length).toBeGreaterThanOrEqual(10);
      const standing = HORIZON_PRESETS.find((p) => p.id === 'standing-human');
      const iss = HORIZON_PRESETS.find((p) => p.id === 'iss-orbit');
      const airliner = HORIZON_PRESETS.find((p) => p.id === 'airliner-cruise');

      expect(standing).toBeDefined();
      expect(standing!.heightMeters).toBeCloseTo(1.74, 2);

      expect(airliner).toBeDefined();
      expect(airliner!.heightFeet).toBe(36000);

      expect(iss).toBeDefined();
      expect(iss!.heightMeters).toBe(408000);
    });
  });
});
