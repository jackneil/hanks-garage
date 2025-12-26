'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import type { RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { CAMERA } from '../lib/constants';

interface FollowCameraProps {
  target: React.RefObject<RapierRigidBody | null>;
}

export function FollowCamera({ target }: FollowCameraProps) {
  const { camera } = useThree();
  const currentPosition = useRef(new THREE.Vector3(0, CAMERA.HEIGHT, CAMERA.DISTANCE));
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!target.current) return;

    const body = target.current;
    const pos = body.translation();
    const rot = body.rotation();

    // Target position (where the truck is)
    const targetPos = new THREE.Vector3(pos.x, pos.y, pos.z);

    // Extract ONLY yaw rotation (ignore pitch/roll so camera stays level)
    const quat = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);
    const euler = new THREE.Euler().setFromQuaternion(quat, 'YXZ');
    const yawOnly = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0, euler.y, 0)
    );

    // Get truck's horizontal forward direction (ignoring tilt)
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(yawOnly);

    // Calculate ideal camera position (behind and above truck)
    // Camera stays level - doesn't follow pitch/roll
    const idealPosition = new THREE.Vector3()
      .copy(targetPos)
      .add(forward.clone().multiplyScalar(-CAMERA.DISTANCE))
      .add(new THREE.Vector3(0, CAMERA.HEIGHT, 0));

    // Smoothly interpolate camera position
    currentPosition.current.lerp(idealPosition, CAMERA.LERP_POSITION);

    // Look at truck center (slightly above ground level)
    const lookTarget = targetPos.clone().add(new THREE.Vector3(0, 1.5, 0));
    currentLookAt.current.lerp(lookTarget, CAMERA.LERP_LOOK);

    // Apply to camera
    camera.position.copy(currentPosition.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Alternative: Fixed camera for debugging
export function DebugCamera({ position = [0, 50, 50] }: { position?: [number, number, number] }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.set(...position);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Minimap camera (top-down view rendered to texture)
export function MinimapCamera() {
  const cameraRef = useRef<THREE.OrthographicCamera>(null);

  return (
    <orthographicCamera
      ref={cameraRef}
      position={[0, 200, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
      left={-100}
      right={100}
      top={100}
      bottom={-100}
      near={1}
      far={500}
    />
  );
}
