/**
 * Hill Climb Racing - Physics Helpers
 *
 * Matter.js vehicle creation and physics utilities.
 */

import Matter from 'matter-js';
import { PHYSICS, TERRAIN, type VehicleStats } from './constants';
import type { TerrainPoint, TerrainChunk } from './terrainGenerator';

// =============================================================================
// TYPES
// =============================================================================

export interface VehicleComposite {
  composite: Matter.Composite;
  chassis: Matter.Body;
  head: Matter.Body;
  wheelFront: Matter.Body;
  wheelRear: Matter.Body;
  axleFront: Matter.Constraint;
  axleRear: Matter.Constraint;
  headConstraint: Matter.Constraint;
}

export interface VehicleOptions {
  x: number;
  y: number;
  stats: {
    torque: number;
    grip: number;
    weight: number;
    airControl: number;
  };
}

// =============================================================================
// VEHICLE CREATION
// =============================================================================

/**
 * Create a complete vehicle composite with chassis, wheels, and head
 */
export function createVehicle(options: VehicleOptions): VehicleComposite {
  const { x, y, stats } = options;
  const composite = Matter.Composite.create({ label: 'vehicle' });

  // Collision group - negative means don't collide with each other
  const vehicleGroup = Matter.Body.nextGroup(true);

  // Calculate adjusted values based on vehicle stats
  const adjustedMass = PHYSICS.CHASSIS_MASS * stats.weight;
  const adjustedFriction = PHYSICS.WHEEL_FRICTION * stats.grip;

  // Chassis (main body)
  const chassis = Matter.Bodies.rectangle(
    x,
    y,
    PHYSICS.CHASSIS_WIDTH,
    PHYSICS.CHASSIS_HEIGHT,
    {
      label: 'chassis',
      collisionFilter: { group: vehicleGroup },
      mass: adjustedMass,
      friction: 0.5,
      frictionAir: 0.01,
      render: {
        fillStyle: '#FF6B35',
      },
    }
  );

  // Driver head (death detection)
  const head = Matter.Bodies.circle(
    x,
    y + PHYSICS.HEAD_OFFSET_Y,
    PHYSICS.HEAD_RADIUS,
    {
      label: 'driverHead',
      collisionFilter: { group: vehicleGroup },
      mass: PHYSICS.HEAD_MASS,
      friction: 0.3,
      render: {
        fillStyle: '#FFE4C4',
      },
    }
  );

  // Front wheel (right side - vehicle faces right)
  const wheelFront = Matter.Bodies.circle(
    x + PHYSICS.WHEEL_BASE / 2,
    y + PHYSICS.CHASSIS_HEIGHT / 2,
    PHYSICS.WHEEL_RADIUS,
    {
      label: 'wheel',
      collisionFilter: { group: vehicleGroup },
      mass: PHYSICS.WHEEL_MASS,
      friction: adjustedFriction,
      frictionStatic: PHYSICS.WHEEL_FRICTION_STATIC * stats.grip,
      restitution: PHYSICS.WHEEL_RESTITUTION,
      render: {
        fillStyle: '#333333',
      },
    }
  );

  // Rear wheel (left side)
  const wheelRear = Matter.Bodies.circle(
    x - PHYSICS.WHEEL_BASE / 2,
    y + PHYSICS.CHASSIS_HEIGHT / 2,
    PHYSICS.WHEEL_RADIUS,
    {
      label: 'wheel',
      collisionFilter: { group: vehicleGroup },
      mass: PHYSICS.WHEEL_MASS,
      friction: adjustedFriction,
      frictionStatic: PHYSICS.WHEEL_FRICTION_STATIC * stats.grip,
      restitution: PHYSICS.WHEEL_RESTITUTION,
      render: {
        fillStyle: '#333333',
      },
    }
  );

  // Wheel constraints (axles with suspension)
  const axleFront = Matter.Constraint.create({
    bodyA: chassis,
    pointA: { x: PHYSICS.WHEEL_BASE / 2, y: PHYSICS.CHASSIS_HEIGHT / 2 },
    bodyB: wheelFront,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: PHYSICS.SUSPENSION_STIFFNESS,
    damping: PHYSICS.SUSPENSION_DAMPING,
    render: {
      strokeStyle: '#666666',
      lineWidth: 3,
    },
  });

  const axleRear = Matter.Constraint.create({
    bodyA: chassis,
    pointA: { x: -PHYSICS.WHEEL_BASE / 2, y: PHYSICS.CHASSIS_HEIGHT / 2 },
    bodyB: wheelRear,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: PHYSICS.SUSPENSION_STIFFNESS,
    damping: PHYSICS.SUSPENSION_DAMPING,
    render: {
      strokeStyle: '#666666',
      lineWidth: 3,
    },
  });

  // Head constraint (attached to chassis)
  const headConstraint = Matter.Constraint.create({
    bodyA: chassis,
    pointA: { x: 0, y: PHYSICS.HEAD_OFFSET_Y },
    bodyB: head,
    pointB: { x: 0, y: 0 },
    length: 0,
    stiffness: 1,
    damping: 0.1,
    render: {
      strokeStyle: '#8B4513',
      lineWidth: 2,
    },
  });

  // Add all to composite
  Matter.Composite.add(composite, [
    chassis,
    head,
    wheelFront,
    wheelRear,
    axleFront,
    axleRear,
    headConstraint,
  ]);

  return {
    composite,
    chassis,
    head,
    wheelFront,
    wheelRear,
    axleFront,
    axleRear,
    headConstraint,
  };
}

/**
 * Apply gas/brake to vehicle wheels
 */
export function applyWheelTorque(
  vehicle: VehicleComposite,
  gas: boolean,
  brake: boolean,
  torqueMultiplier: number = 1
): void {
  const { wheelFront, wheelRear } = vehicle;
  const baseTorque = PHYSICS.WHEEL_TORQUE * torqueMultiplier;

  if (gas) {
    // Spin wheels clockwise (forward motion to the right)
    if (wheelFront.angularVelocity < PHYSICS.MAX_WHEEL_SPEED) {
      Matter.Body.setAngularVelocity(
        wheelFront,
        wheelFront.angularVelocity + baseTorque
      );
    }
    if (wheelRear.angularVelocity < PHYSICS.MAX_WHEEL_SPEED) {
      Matter.Body.setAngularVelocity(
        wheelRear,
        wheelRear.angularVelocity + baseTorque
      );
    }
  }

  if (brake) {
    // Spin wheels counter-clockwise (reverse/brake)
    const brakeTorque = baseTorque * PHYSICS.BRAKE_MULTIPLIER;
    if (wheelFront.angularVelocity > -PHYSICS.MAX_WHEEL_SPEED) {
      Matter.Body.setAngularVelocity(
        wheelFront,
        wheelFront.angularVelocity - brakeTorque
      );
    }
    if (wheelRear.angularVelocity > -PHYSICS.MAX_WHEEL_SPEED) {
      Matter.Body.setAngularVelocity(
        wheelRear,
        wheelRear.angularVelocity - brakeTorque
      );
    }
  }
}

/**
 * Apply lean torque to chassis
 */
export function applyLeanTorque(
  vehicle: VehicleComposite,
  leanBack: boolean,
  leanForward: boolean,
  airControlMultiplier: number = 1
): void {
  const { chassis } = vehicle;
  const leanForce = PHYSICS.LEAN_FORCE * airControlMultiplier;

  if (leanBack) {
    if (Math.abs(chassis.angularVelocity) < PHYSICS.MAX_LEAN_VELOCITY) {
      Matter.Body.setAngularVelocity(
        chassis,
        chassis.angularVelocity - leanForce
      );
    }
  }

  if (leanForward) {
    if (Math.abs(chassis.angularVelocity) < PHYSICS.MAX_LEAN_VELOCITY) {
      Matter.Body.setAngularVelocity(
        chassis,
        chassis.angularVelocity + leanForce
      );
    }
  }
}

/**
 * Reset vehicle position and velocity
 */
export function resetVehicle(
  vehicle: VehicleComposite,
  x: number,
  y: number
): void {
  const { chassis, head, wheelFront, wheelRear } = vehicle;

  const bodies = [chassis, head, wheelFront, wheelRear];

  // Calculate offsets
  const headOffset = { x: 0, y: PHYSICS.HEAD_OFFSET_Y };
  const wheelFrontOffset = {
    x: PHYSICS.WHEEL_BASE / 2,
    y: PHYSICS.CHASSIS_HEIGHT / 2,
  };
  const wheelRearOffset = {
    x: -PHYSICS.WHEEL_BASE / 2,
    y: PHYSICS.CHASSIS_HEIGHT / 2,
  };

  // Reset chassis
  Matter.Body.setPosition(chassis, { x, y });
  Matter.Body.setVelocity(chassis, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(chassis, 0);
  Matter.Body.setAngle(chassis, 0);

  // Reset head
  Matter.Body.setPosition(head, { x: x + headOffset.x, y: y + headOffset.y });
  Matter.Body.setVelocity(head, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(head, 0);
  Matter.Body.setAngle(head, 0);

  // Reset front wheel
  Matter.Body.setPosition(wheelFront, {
    x: x + wheelFrontOffset.x,
    y: y + wheelFrontOffset.y,
  });
  Matter.Body.setVelocity(wheelFront, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(wheelFront, 0);

  // Reset rear wheel
  Matter.Body.setPosition(wheelRear, {
    x: x + wheelRearOffset.x,
    y: y + wheelRearOffset.y,
  });
  Matter.Body.setVelocity(wheelRear, { x: 0, y: 0 });
  Matter.Body.setAngularVelocity(wheelRear, 0);
}

// =============================================================================
// TERRAIN PHYSICS
// =============================================================================

/**
 * Create terrain bodies from terrain points
 */
export function createTerrainBodies(
  chunk: TerrainChunk,
  friction: number = PHYSICS.GROUND_FRICTION
): Matter.Body[] {
  const bodies: Matter.Body[] = [];
  const { points } = chunk;

  // Create a series of angled rectangles for each segment
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    const body = Matter.Bodies.rectangle(
      (p1.x + p2.x) / 2,
      (p1.y + p2.y) / 2 + 10, // Slight offset down for better collision
      length,
      20, // Thickness
      {
        isStatic: true,
        angle: angle,
        friction: friction,
        restitution: PHYSICS.GROUND_RESTITUTION,
        label: 'terrain',
        render: {
          fillStyle: TERRAIN.GRASS_COLOR,
        },
      }
    );

    bodies.push(body);
  }

  return bodies;
}

/**
 * Create a fuel can body
 */
export function createFuelCanBody(x: number, y: number): Matter.Body {
  return Matter.Bodies.rectangle(x, y, 30, 40, {
    isStatic: true,
    isSensor: true,
    label: 'fuelCan',
    render: {
      fillStyle: '#FF0000',
    },
  });
}

/**
 * Create a coin body
 */
export function createCoinBody(x: number, y: number): Matter.Body {
  return Matter.Bodies.circle(x, y, 15, {
    isStatic: true,
    isSensor: true,
    label: 'coin',
    render: {
      fillStyle: '#FFD700',
    },
  });
}

// =============================================================================
// PHYSICS UTILITIES
// =============================================================================

/**
 * Check if vehicle is airborne
 */
export function isVehicleAirborne(
  engine: Matter.Engine,
  vehicle: VehicleComposite
): boolean {
  const { wheelFront, wheelRear } = vehicle;

  // Raycast down from each wheel
  const rayLength = PHYSICS.WHEEL_RADIUS + 5;

  const frontRay = Matter.Query.ray(
    Matter.Composite.allBodies(engine.world),
    wheelFront.position,
    { x: wheelFront.position.x, y: wheelFront.position.y + rayLength },
    rayLength
  );

  const rearRay = Matter.Query.ray(
    Matter.Composite.allBodies(engine.world),
    wheelRear.position,
    { x: wheelRear.position.x, y: wheelRear.position.y + rayLength },
    rayLength
  );

  // Filter out vehicle parts (Matter.js ray types are incomplete - they have .body property)
  type RayHit = { body: Matter.Body };
  const frontHits = (frontRay as unknown as RayHit[]).filter(
    (hit) =>
      hit.body.label === 'terrain' ||
      hit.body.label === 'ground'
  );
  const rearHits = (rearRay as unknown as RayHit[]).filter(
    (hit) =>
      hit.body.label === 'terrain' ||
      hit.body.label === 'ground'
  );

  return frontHits.length === 0 && rearHits.length === 0;
}

/**
 * Get vehicle speed in pixels per second
 */
export function getVehicleSpeed(vehicle: VehicleComposite): number {
  const vel = vehicle.chassis.velocity;
  return Math.sqrt(vel.x * vel.x + vel.y * vel.y) * 60; // Assuming 60fps
}

/**
 * Get vehicle rotation in degrees
 */
export function getVehicleRotation(vehicle: VehicleComposite): number {
  return (vehicle.chassis.angle * 180) / Math.PI;
}

/**
 * Get vehicle X position (distance)
 */
export function getVehicleDistance(vehicle: VehicleComposite): number {
  return Math.max(0, vehicle.chassis.position.x);
}
