// Terrain utilities - shared noise and height sampling
// This module ensures terrain physics and visuals are in sync

import { createNoise2D } from 'simplex-noise';
import { WORLD, LAKES } from './constants';

// Lazy-initialized noise instance with fixed seed for deterministic terrain
// Using lazy init to avoid blocking module load (createNoise2D is heavy)
let noise2D: ReturnType<typeof createNoise2D> | null = null;

function getNoise2D() {
  if (!noise2D) {
    noise2D = createNoise2D(() => 0.42);
  }
  return noise2D;
}

/**
 * Get terrain height at any world position
 * Uses multi-octave simplex noise for realistic terrain
 */
export function getTerrainHeight(x: number, z: number): number {
  const noise = getNoise2D();

  // Large scale continental shapes - VISIBLE mountains
  let h = noise(x * 0.003, z * 0.003) * 35;

  // Mountain ridges (absolute value creates peaks) - VISIBLE
  h += Math.abs(noise(x * 0.008 + 100, z * 0.008 + 100)) * 20;

  // REMOVED: Rolling hills, medium bumps, fine detail
  // These were invisible but caused physics instability (ghost collisions, jitter)

  // Flatten spawn area (center) - smooth falloff
  const dist = Math.sqrt(x * x + z * z);
  const flatRadius = 60;
  if (dist < flatRadius) {
    const t = dist / flatRadius;
    // Smooth cubic interpolation for nicer transition
    const smoothT = t * t * (3 - 2 * t);
    h *= smoothT;
  }

  // Create lake depressions - lower terrain at lake positions
  for (const lake of LAKES) {
    const lakeDist = Math.sqrt((x - lake.x) ** 2 + (z - lake.z) ** 2);
    const depressionRadius = lake.size + 10; // Blend zone around lake
    if (lakeDist < depressionRadius) {
      // Smooth depression - deepest at center, blends at edges
      const t = lakeDist / depressionRadius;
      const depression = (1 - t * t) * (lake.depth + 8);
      h -= depression;
    }
  }

  // Ensure minimum height of 0
  return Math.max(0, h);
}

/**
 * Generate heights array for Rapier HeightfieldCollider
 * Returns the heights and proper scale for physics
 *
 * IMPORTANT: Rapier expects column-major order and total size as scale
 * See: https://threlte.xyz/docs/examples/geometry/terrain-with-rapier-physics
 */
export function generateHeightfield(
  size: number,
  segments: number
): { heights: Float32Array; scale: { x: number; y: number; z: number } } {
  const nsubdivs = segments;
  const heights = new Float32Array((nsubdivs + 1) * (nsubdivs + 1));
  const halfSize = size / 2;
  const step = size / nsubdivs;

  // Column-major order (x outer, z inner) - matches Rapier's expectation
  for (let x = 0; x <= nsubdivs; x++) {
    for (let z = 0; z <= nsubdivs; z++) {
      const worldX = x * step - halfSize;
      const worldZ = z * step - halfSize;
      const heightIndex = z + (nsubdivs + 1) * x;  // Column-major!
      heights[heightIndex] = getTerrainHeight(worldX, worldZ);
    }
  }

  return {
    heights,
    scale: { x: size, y: 1, z: size }  // Total size, not step!
  };
}

/**
 * Get a position on the terrain surface (for placing objects)
 * Returns [x, y, z] where y is the terrain height + offset
 */
export function getPositionOnTerrain(
  x: number,
  z: number,
  offsetY: number = 0
): [number, number, number] {
  return [x, getTerrainHeight(x, z) + offsetY, z];
}

/**
 * Get terrain slope at a position
 * Returns the maximum slope ratio (height change / distance)
 * 0 = flat, 0.1 = 10% grade, 1.0 = 45 degrees
 */
export function getTerrainSlope(x: number, z: number, sampleDistance = 5): number {
  const h0 = getTerrainHeight(x, z);
  const hN = getTerrainHeight(x, z - sampleDistance);
  const hS = getTerrainHeight(x, z + sampleDistance);
  const hE = getTerrainHeight(x + sampleDistance, z);
  const hW = getTerrainHeight(x - sampleDistance, z);

  // Max height difference across sample points
  const maxDiff = Math.max(
    Math.abs(hN - h0), Math.abs(hS - h0),
    Math.abs(hE - h0), Math.abs(hW - h0)
  );

  return maxDiff / sampleDistance;
}

/**
 * Generate an array of positions scattered on the terrain
 * All positions will be ON the terrain surface
 */
export function generateScatteredPositions(
  count: number,
  minDist: number = 10,
  hoverHeight: number = 0,
  avoidCenter: number = 30
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const maxAttempts = count * 20;
  let attempts = 0;

  while (positions.length < count && attempts < maxAttempts) {
    attempts++;

    // Random angle and distance from center
    const angle = Math.random() * Math.PI * 2;
    const distance = avoidCenter + Math.random() * (WORLD.HALF_SIZE - avoidCenter - 20);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    // Check minimum distance from other positions
    const tooClose = positions.some(
      (p) => Math.sqrt((p[0] - x) ** 2 + (p[2] - z) ** 2) < minDist
    );

    if (!tooClose) {
      // Get actual terrain height at this position
      const y = getTerrainHeight(x, z) + hoverHeight;
      positions.push([x, y, z]);
    }
  }

  return positions;
}
