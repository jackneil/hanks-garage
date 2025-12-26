'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sky, Cloud } from '@react-three/drei';
import * as THREE from 'three';
import { getTerrainHeight } from '../lib/terrainUtils';
import { LAKES } from '../lib/constants';

export function Environment() {
  return (
    <>
      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[100, 50, 100]}
        inclination={0.5}
        azimuth={0.25}
        rayleigh={0.5}
      />

      {/* Ambient light */}
      <ambientLight intensity={0.4} color="#87ceeb" />

      {/* Sun light */}
      <directionalLight
        position={[100, 100, 50]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={0.1}
        shadow-camera-far={500}
      />

      {/* Fill light */}
      <directionalLight
        position={[-50, 30, -50]}
        intensity={0.3}
        color="#ffcc88"
      />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#87ceeb', 100, 400]} />

      {/* Clouds */}
      <Clouds />

      {/* Trees scattered around */}
      <Trees />

      {/* Rocks */}
      <Rocks />

      {/* Lakes */}
      <Lakes />
    </>
  );
}

function Clouds() {
  // Static cloud positions - memoized to prevent flickering
  const cloudData = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => {
      const angle = (i / 15) * Math.PI * 2;
      const distance = 150 + Math.random() * 100;
      const height = 60 + Math.random() * 40;
      return {
        position: [
          Math.cos(angle) * distance,
          height,
          Math.sin(angle) * distance,
        ] as [number, number, number],
      };
    }), []);

  return (
    <group>
      {cloudData.map((cloud, i) => (
        <Cloud
          key={i}
          position={cloud.position}
          speed={0}
          opacity={0.5}
          scale={[30, 10, 10]}
        />
      ))}
    </group>
  );
}

// Check if position is in a lake (uses LAKES from constants)
function isInLake(x: number, z: number): boolean {
  return LAKES.some(lake => {
    const dist = Math.sqrt((x - lake.x) ** 2 + (z - lake.z) ** 2);
    return dist < lake.size + 5; // +5 margin for shore
  });
}

// Simple tree
function Tree({ position }: { position: [number, number, number] }) {
  // Memoize random values so they don't change every frame (was causing seizure-inducing flickering)
  const { scale, treeRotation } = useMemo(() => ({
    scale: 0.8 + Math.random() * 0.4,
    treeRotation: Math.random() * Math.PI * 2,
  }), []);

  return (
    <group position={position} scale={scale} rotation={[0, treeRotation, 0]}>
      {/* Trunk */}
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </mesh>
      {/* Foliage layers */}
      <mesh castShadow position={[0, 5, 0]}>
        <coneGeometry args={[2.5, 4, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 7, 0]}>
        <coneGeometry args={[2, 3, 8]} />
        <meshStandardMaterial color="#32CD32" roughness={0.8} />
      </mesh>
      <mesh castShadow position={[0, 8.5, 0]}>
        <coneGeometry args={[1.2, 2, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Trees() {
  // Generate tree positions on terrain, avoiding lakes
  const positions = useMemo(() => {
    const result: [number, number, number][] = [];
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 200;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;

      // Skip trees that would be in lakes
      if (isInLake(x, z)) continue;

      const y = getTerrainHeight(x, z);
      result.push([x, y, z]);
    }
    return result;
  }, []);

  return (
    <group>
      {positions.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
    </group>
  );
}

// Rock
function Rock({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#666" roughness={0.9} />
    </mesh>
  );
}

function Rocks() {
  // Generate rock positions on terrain
  const rocks = useMemo(() => {
    const result: { pos: [number, number, number]; scale: number }[] = [];
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 220;
      const x = Math.cos(angle) * distance;
      const z = Math.sin(angle) * distance;
      const y = getTerrainHeight(x, z) + 0.3;
      result.push({
        pos: [x, y, z],
        scale: 0.5 + Math.random() * 2,
      });
    }
    return result;
  }, []);

  return (
    <group>
      {rocks.map((rock, i) => (
        <Rock key={i} position={rock.pos} scale={rock.scale} />
      ))}
    </group>
  );
}

// Lake/water body
function Lake({ position, size }: { position: [number, number, number]; size: number }) {
  const waterRef = useRef<THREE.Mesh>(null);

  // Animate water with subtle wave effect
  useFrame((state) => {
    if (!waterRef.current) return;
    waterRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
  });

  return (
    <group position={position}>
      {/* Water surface */}
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[size, 32]} />
        <meshStandardMaterial
          color="#2980b9"
          transparent
          opacity={0.85}
          metalness={0.3}
          roughness={0.2}
        />
      </mesh>
      {/* Shore/beach ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[size, size + 3, 32]} />
        <meshStandardMaterial color="#c2b280" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Lakes() {
  // Place lakes at terrain level (terrain has depressions at these positions)
  const lakes = useMemo(() =>
    LAKES.map(lake => ({
      pos: [lake.x, getTerrainHeight(lake.x, lake.z) + 0.1, lake.z] as [number, number, number],
      size: lake.size,
    })),
  []);

  return (
    <group>
      {lakes.map((lake, i) => (
        <Lake key={i} position={lake.pos} size={lake.size} />
      ))}
    </group>
  );
}
