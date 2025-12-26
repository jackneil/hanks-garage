'use client';

import { useMemo } from 'react';
import { RigidBody, CuboidCollider, HeightfieldCollider } from '@react-three/rapier';
import * as THREE from 'three';
import { WORLD, RAMPS, LAKES } from '../lib/constants';
import { getTerrainHeight, getTerrainSlope, generateHeightfield } from '../lib/terrainUtils';

export function Terrain() {
  const size = WORLD.SIZE;
  const segments = WORLD.TERRAIN.SEGMENTS;

  // Generate visual geometry that matches physics with height-based coloring
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geo.attributes.position.array as Float32Array;
    const colors = new Float32Array(positions.length);

    // Color palette for terrain
    const grassLow = new THREE.Color('#3d6b2e');    // Dark grass
    const grassMid = new THREE.Color('#5a8f4a');    // Light grass
    const rock = new THREE.Color('#6b6b6b');        // Gray rock
    const snow = new THREE.Color('#f5f5f5');        // White snow
    const sand = new THREE.Color('#c2b280');        // Sandy/dirt

    // Apply terrain heights and colors to visual mesh
    // Note: PlaneGeometry Y becomes -Z after rotation, so we negate to match physics
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const planeY = positions[i + 1]; // Plane's Y becomes -Z in world after rotation
      const height = getTerrainHeight(x, -planeY);
      positions[i + 2] = height;

      // Height-based coloring (terrain heights range 0-70)
      let color: THREE.Color;
      if (height < 5) {
        // Low areas - sand near water, dark grass
        color = height < 2 ? sand : grassLow;
      } else if (height < 20) {
        // Valley/plains - grass blend
        const t = (height - 5) / 15;
        color = grassLow.clone().lerp(grassMid, t);
      } else if (height < 40) {
        // Hills - transition to rock
        const t = (height - 20) / 20;
        color = grassMid.clone().lerp(rock, t);
      } else if (height < 55) {
        // Mountains - rock with snow transition
        const t = (height - 40) / 15;
        color = rock.clone().lerp(snow, t);
      } else {
        // Peaks - snow
        color = snow;
      }

      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    geo.rotateX(-Math.PI / 2);

    return geo;
  }, [size, segments]);

  // Generate heightfield for physics (column-major order, total size scale)
  const { heights, scale } = useMemo(() => {
    const result = generateHeightfield(size, segments);
    // Convert Float32Array to number[] for HeightfieldCollider
    return {
      heights: Array.from(result.heights),
      scale: result.scale,
    };
  }, [size, segments]);

  return (
    <group>
      {/* Terrain with HeightfieldCollider - stable and fast */}
      <RigidBody type="fixed" colliders={false}>
        <HeightfieldCollider args={[segments, segments, heights, scale]} />
        <mesh geometry={geometry} receiveShadow>
          <meshStandardMaterial
            vertexColors
            roughness={0.85}
            metalness={0.0}
            flatShading
          />
        </mesh>
      </RigidBody>

      {/* Ramps placed ON the terrain */}
      <Ramps />

      {/* Stunt Zone platform */}
      <StuntPlatform />
    </group>
  );
}

// Ramp component - properly placed on terrain
function Ramp({
  position,
  rotation = 0,
  size = 'medium',
}: {
  position: [number, number, number];
  rotation?: number;
  size?: 'small' | 'medium' | 'large' | 'mega';
}) {
  const rampDimensions = RAMPS[size.toUpperCase() as keyof typeof RAMPS];
  const { WIDTH, LENGTH, HEIGHT } = rampDimensions;

  // Create ramp geometry
  const rampGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Ramp vertices: flat base with inclined top
    const vertices = new Float32Array([
      // Bottom face
      -WIDTH/2, 0, -LENGTH/2,
      WIDTH/2, 0, -LENGTH/2,
      WIDTH/2, 0, LENGTH/2,
      -WIDTH/2, 0, LENGTH/2,
      // Top face (inclined)
      -WIDTH/2, 0, -LENGTH/2,
      WIDTH/2, 0, -LENGTH/2,
      WIDTH/2, HEIGHT, LENGTH/2,
      -WIDTH/2, HEIGHT, LENGTH/2,
    ]);

    const indices = new Uint16Array([
      // Bottom
      0, 1, 2, 0, 2, 3,
      // Top (ramp surface)
      4, 6, 5, 4, 7, 6,
      // Front
      3, 2, 6, 3, 6, 7,
      // Back
      0, 5, 1, 0, 4, 5,
      // Left
      0, 3, 7, 0, 7, 4,
      // Right
      1, 5, 6, 1, 6, 2,
    ]);

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    geo.computeVertexNormals();

    return geo;
  }, [WIDTH, LENGTH, HEIGHT]);

  return (
    <RigidBody type="fixed" position={position} rotation={[0, rotation, 0]}>
      <CuboidCollider
        args={[WIDTH / 2, HEIGHT / 2, LENGTH / 2]}
        position={[0, HEIGHT / 4, 0]}
        rotation={[Math.atan2(HEIGHT, LENGTH), 0, 0]}
      />
      <mesh geometry={rampGeometry} castShadow receiveShadow>
        <meshStandardMaterial color="#8B4513" roughness={0.7} />
      </mesh>
    </RigidBody>
  );
}

// Check if position is in a lake
function isInLake(x: number, z: number): boolean {
  return LAKES.some(lake => {
    const dist = Math.sqrt((x - lake.x) ** 2 + (z - lake.z) ** 2);
    return dist < lake.size + 10;
  });
}

function Ramps() {
  // Define ramp configs with terrain-sampled heights, avoiding lakes
  const ramps = useMemo(() => {
    const configs = [
      // Starting area ramps
      { x: 30, z: 0, rotation: 0, size: 'small' as const },
      { x: 50, z: 20, rotation: Math.PI / 4, size: 'medium' as const },
      { x: -40, z: 30, rotation: -Math.PI / 6, size: 'small' as const },

      // Around the world - adjusted to avoid lakes
      { x: 20, z: -50, rotation: 0, size: 'large' as const },
      { x: 80, z: 50, rotation: Math.PI / 3, size: 'medium' as const },
      { x: -80, z: -60, rotation: Math.PI / 4, size: 'mega' as const },
      { x: 100, z: -30, rotation: -Math.PI / 4, size: 'large' as const },
      { x: -40, z: 100, rotation: 0, size: 'small' as const },
      { x: 60, z: -120, rotation: Math.PI / 2, size: 'medium' as const },
    ];

    // Sample terrain height for each ramp, skip lakes and steep terrain
    return configs
      .filter(r => !isInLake(r.x, r.z))
      .filter(r => getTerrainSlope(r.x, r.z, 10) < 0.15) // Only flat areas (<15% grade)
      .map(r => ({
        position: [r.x, getTerrainHeight(r.x, r.z), r.z] as [number, number, number],
        rotation: r.rotation,
        size: r.size,
      }));
  }, []);

  return (
    <>
      {ramps.map((ramp, i) => (
        <Ramp key={i} {...ramp} />
      ))}
    </>
  );
}

// Stunt zone platform - elevated flat area for tricks
function StuntPlatform() {
  // Place in a specific location, elevated above terrain
  const baseX = -100;
  const baseZ = -100;
  const terrainY = getTerrainHeight(baseX, baseZ);
  const platformY = Math.max(terrainY + 5, 10); // At least 10 units high

  return (
    <group position={[baseX, platformY, baseZ]}>
      {/* Main platform */}
      <RigidBody type="fixed">
        <CuboidCollider args={[30, 1, 30]} position={[0, 0, 0]} />
        <mesh receiveShadow>
          <boxGeometry args={[60, 2, 60]} />
          <meshStandardMaterial color="#555555" roughness={0.5} />
        </mesh>
      </RigidBody>

      {/* Ramp up to platform */}
      <RigidBody type="fixed" position={[0, -platformY / 2, 35]} rotation={[-Math.PI / 6, 0, 0]}>
        <CuboidCollider args={[15, 0.5, 20]} />
        <mesh castShadow receiveShadow>
          <boxGeometry args={[30, 1, 40]} />
          <meshStandardMaterial color="#666666" roughness={0.6} />
        </mesh>
      </RigidBody>

      {/* Half pipe structure */}
      <RigidBody type="fixed" position={[0, 3, -20]}>
        <mesh rotation={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[12, 12, 25, 32, 1, true, 0, Math.PI]} />
          <meshStandardMaterial color="#666" side={THREE.DoubleSide} />
        </mesh>
      </RigidBody>

      {/* Jump ramps on platform */}
      <Ramp position={[-20, 2, 0]} rotation={Math.PI / 2} size="small" />
      <Ramp position={[20, 2, 0]} rotation={-Math.PI / 2} size="small" />
    </group>
  );
}

// Boundary walls (invisible but prevent escaping)
export function Boundaries() {
  const size = WORLD.SIZE;
  const height = WORLD.BOUNDARY.WALL_HEIGHT;
  const thickness = WORLD.BOUNDARY.WALL_THICKNESS;

  return (
    <>
      {/* North wall */}
      <RigidBody type="fixed" position={[0, height / 2, size / 2]}>
        <CuboidCollider args={[size / 2, height / 2, thickness / 2]} />
      </RigidBody>
      {/* South wall */}
      <RigidBody type="fixed" position={[0, height / 2, -size / 2]}>
        <CuboidCollider args={[size / 2, height / 2, thickness / 2]} />
      </RigidBody>
      {/* East wall */}
      <RigidBody type="fixed" position={[size / 2, height / 2, 0]}>
        <CuboidCollider args={[thickness / 2, height / 2, size / 2]} />
      </RigidBody>
      {/* West wall */}
      <RigidBody type="fixed" position={[-size / 2, height / 2, 0]}>
        <CuboidCollider args={[thickness / 2, height / 2, size / 2]} />
      </RigidBody>
    </>
  );
}
