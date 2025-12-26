'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { DESTRUCTIBLES, WORLD } from '../lib/constants';
import { useGameStore } from '../lib/store';
import { sounds } from '../lib/sounds';
import { getTerrainHeight } from '../lib/terrainUtils';

// Generate positions for destructibles ON THE TERRAIN
function generateDestructiblePositions(
  count: number,
  minDist = 8,
  heightOffset = 0.5
): [number, number, number][] {
  const positions: [number, number, number][] = [];
  const maxAttempts = count * 20;
  let attempts = 0;

  while (positions.length < count && attempts < maxAttempts) {
    attempts++;

    const angle = Math.random() * Math.PI * 2;
    const distance = 30 + Math.random() * (WORLD.HALF_SIZE - 50);
    const x = Math.cos(angle) * distance;
    const z = Math.sin(angle) * distance;

    const tooClose = positions.some(
      (p) => Math.sqrt((p[0] - x) ** 2 + (p[2] - z) ** 2) < minDist
    );

    if (!tooClose) {
      // FIXED: Sample terrain height and add offset
      const terrainY = getTerrainHeight(x, z);
      const y = terrainY + heightOffset;
      positions.push([x, y, z]);
    }
  }

  return positions;
}

// Crate component
function Crate({
  position,
  onDestroy,
}: {
  position: [number, number, number];
  onDestroy: () => void;
}) {
  const bodyRef = useRef<RapierRigidBody>(null);
  const [destroyed, setDestroyed] = useState(false);
  const [pieces, setPieces] = useState<{ pos: THREE.Vector3; rot: THREE.Euler; vel: THREE.Vector3 }[]>([]);
  const isProcessing = useRef(false);

  const handleCollision = useCallback((force: number) => {
    if (destroyed || isProcessing.current || force < 50) return;
    isProcessing.current = true;

    setDestroyed(true);
    onDestroy();

    // Create explosion pieces
    const newPieces = Array.from({ length: 6 }, () => ({
      pos: new THREE.Vector3(
        position[0] + (Math.random() - 0.5) * 0.5,
        position[1] + Math.random() * 0.5,
        position[2] + (Math.random() - 0.5) * 0.5
      ),
      rot: new THREE.Euler(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 8,
        Math.random() * 6 + 2,
        (Math.random() - 0.5) * 8
      ),
    }));
    setPieces(newPieces);
  }, [destroyed, onDestroy, position]);

  // Animate pieces
  const groupRef = useRef<THREE.Group>(null);
  const [showPieces, setShowPieces] = useState(true);
  const time = useRef(0);

  useFrame((_, delta) => {
    if (!destroyed || !showPieces || !groupRef.current) return;

    time.current += delta;
    if (time.current > 2) {
      setShowPieces(false);
      return;
    }

    groupRef.current.children.forEach((child, i) => {
      const piece = pieces[i];
      if (!piece) return;

      piece.vel.y -= delta * 15; // gravity
      piece.pos.add(piece.vel.clone().multiplyScalar(delta));
      piece.rot.x += delta * 3;
      piece.rot.z += delta * 2;

      child.position.copy(piece.pos);
      child.rotation.copy(piece.rot);
      child.scale.setScalar(Math.max(0, 1 - time.current * 0.5));
    });
  });

  if (destroyed) {
    if (!showPieces) return null;

    return (
      <group ref={groupRef}>
        {pieces.map((piece, i) => (
          <mesh key={i} position={piece.pos} rotation={piece.rot}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        ))}
      </group>
    );
  }

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      type="dynamic"
      mass={50}
      onContactForce={(e) => handleCollision(e.totalForceMagnitude)}
    >
      <mesh castShadow>
        <boxGeometry args={[DESTRUCTIBLES.CRATE.SIZE, DESTRUCTIBLES.CRATE.SIZE, DESTRUCTIBLES.CRATE.SIZE]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>
      {/* Crate markings */}
      <mesh position={[0, 0, DESTRUCTIBLES.CRATE.SIZE / 2 + 0.01]}>
        <planeGeometry args={[DESTRUCTIBLES.CRATE.SIZE * 0.8, DESTRUCTIBLES.CRATE.SIZE * 0.8]} />
        <meshBasicMaterial color="#654321" />
      </mesh>
    </RigidBody>
  );
}

// Barrel component
function Barrel({
  position,
  onDestroy,
}: {
  position: [number, number, number];
  onDestroy: () => void;
}) {
  const [destroyed, setDestroyed] = useState(false);
  const isProcessing = useRef(false);

  const handleCollision = useCallback((force: number) => {
    if (destroyed || isProcessing.current || force < 40) return;
    isProcessing.current = true;
    setDestroyed(true);
    onDestroy();
  }, [destroyed, onDestroy]);

  if (destroyed) return null;

  return (
    <RigidBody
      position={position}
      type="dynamic"
      mass={30}
      onContactForce={(e) => handleCollision(e.totalForceMagnitude)}
    >
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[
            DESTRUCTIBLES.BARREL.RADIUS,
            DESTRUCTIBLES.BARREL.RADIUS,
            DESTRUCTIBLES.BARREL.HEIGHT,
            16,
          ]}
        />
        <meshStandardMaterial color="#2c3e50" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Barrel rings */}
      <mesh position={[0, DESTRUCTIBLES.BARREL.HEIGHT * 0.3, 0]}>
        <torusGeometry args={[DESTRUCTIBLES.BARREL.RADIUS + 0.02, 0.03, 8, 16]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.8} />
      </mesh>
      <mesh position={[0, -DESTRUCTIBLES.BARREL.HEIGHT * 0.3, 0]}>
        <torusGeometry args={[DESTRUCTIBLES.BARREL.RADIUS + 0.02, 0.03, 8, 16]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.8} />
      </mesh>
    </RigidBody>
  );
}

// Old car to smash
function OldCar({
  position,
  onDestroy,
}: {
  position: [number, number, number];
  onDestroy: () => void;
}) {
  const [destroyed, setDestroyed] = useState(false);
  const [crushed, setCrushed] = useState(false);
  const isProcessing = useRef(false);

  const handleCollision = useCallback((force: number) => {
    if (destroyed || crushed || isProcessing.current || force < 100) return;
    isProcessing.current = true;
    setCrushed(true);
    setTimeout(() => {
      setDestroyed(true);
      onDestroy();
    }, 500);
  }, [destroyed, crushed, onDestroy]);

  if (destroyed) return null;

  const [width, height, length] = DESTRUCTIBLES.CAR.SIZE;
  const scale = crushed ? [1, 0.3, 1] : [1, 1, 1];

  return (
    <RigidBody
      position={position}
      type="dynamic"
      mass={200}
      onContactForce={(e) => handleCollision(e.totalForceMagnitude)}
    >
      <group scale={scale as [number, number, number]}>
        {/* Car body */}
        <mesh castShadow position={[0, height / 2, 0]}>
          <boxGeometry args={[width, height, length]} />
          <meshStandardMaterial color="#c0392b" roughness={0.6} />
        </mesh>
        {/* Roof */}
        <mesh castShadow position={[0, height + 0.3, -0.3]}>
          <boxGeometry args={[width - 0.2, 0.6, length * 0.5]} />
          <meshStandardMaterial color="#c0392b" roughness={0.6} />
        </mesh>
        {/* Windows */}
        <mesh position={[0, height + 0.3, 0.5]}>
          <boxGeometry args={[width - 0.3, 0.5, 0.1]} />
          <meshStandardMaterial color="#34495e" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>
    </RigidBody>
  );
}

// All destructibles manager
export function Destructibles() {
  const addCoins = useGameStore((s) => s.addCoins);
  const addDestruction = useGameStore((s) => s.addDestruction);
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const cratePositions = useMemo(
    () => generateDestructiblePositions(DESTRUCTIBLES.CRATE.COUNT, 10),
    []
  );
  const barrelPositions = useMemo(
    () => generateDestructiblePositions(DESTRUCTIBLES.BARREL.COUNT, 8),
    []
  );
  const carPositions = useMemo(
    () => generateDestructiblePositions(DESTRUCTIBLES.CAR.COUNT, 20),
    []
  );

  const handleCrateDestroy = useCallback(() => {
    addCoins(DESTRUCTIBLES.CRATE.COINS);
    addDestruction();
    if (soundEnabled) sounds.playDestroy();
  }, [addCoins, addDestruction, soundEnabled]);

  const handleBarrelDestroy = useCallback(() => {
    addCoins(DESTRUCTIBLES.BARREL.COINS);
    addDestruction();
    if (soundEnabled) sounds.playDestroy();
  }, [addCoins, addDestruction, soundEnabled]);

  const handleCarDestroy = useCallback(() => {
    addCoins(DESTRUCTIBLES.CAR.COINS);
    addDestruction();
    if (soundEnabled) {
      sounds.playCrash();
      setTimeout(() => sounds.playDestroy(), 200);
    }
  }, [addCoins, addDestruction, soundEnabled]);

  return (
    <group>
      {cratePositions.map((pos, i) => (
        <Crate key={`crate-${i}`} position={pos} onDestroy={handleCrateDestroy} />
      ))}
      {barrelPositions.map((pos, i) => (
        <Barrel key={`barrel-${i}`} position={pos} onDestroy={handleBarrelDestroy} />
      ))}
      {carPositions.map((pos, i) => (
        <OldCar key={`car-${i}`} position={pos} onDestroy={handleCarDestroy} />
      ))}
    </group>
  );
}
