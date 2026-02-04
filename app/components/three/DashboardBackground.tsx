'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function GridPlane() {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1;
    }
  });

  return (
    <gridHelper
      ref={gridRef}
      args={[50, 50, '#8b5cf6', '#1e293b']}
      position={[0, -5, 0]}
      rotation={[0, 0, 0]}
    />
  );
}

function DataStream({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.02, 0.02, 10, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </mesh>
  );
}

function HexGrid() {
  const groupRef = useRef<THREE.Group>(null);

  const hexagons = useMemo(() => {
    const hexes = [];
    for (let i = 0; i < 20; i++) {
      hexes.push({
        position: [
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 10,
          -15 - Math.random() * 10,
        ] as [number, number, number],
        scale: 0.3 + Math.random() * 0.5,
        speed: 0.5 + Math.random() * 1,
      });
    }
    return hexes;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {hexagons.map((hex, i) => (
        <Float key={i} speed={hex.speed} floatIntensity={0.5}>
          <mesh position={hex.position} scale={hex.scale}>
            <circleGeometry args={[1, 6]} />
            <meshBasicMaterial
              color={i % 3 === 0 ? '#8b5cf6' : i % 3 === 1 ? '#3b82f6' : '#10b981'}
              transparent
              opacity={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function CentralOrb() {
  const orbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      orbRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    }
  });

  return (
    <Float speed={1} floatIntensity={0.3}>
      <mesh ref={orbRef} position={[8, 2, -10]}>
        <icosahedronGeometry args={[2, 1]} />
        <MeshDistortMaterial
          color="#8b5cf6"
          distort={0.3}
          speed={2}
          roughness={0.2}
          metalness={0.9}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -5 - Math.random() * 20;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#8b5cf6"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#8b5cf6" />
      <pointLight position={[-10, -5, 5]} intensity={0.3} color="#3b82f6" />

      <FloatingParticles />
      <HexGrid />
      <CentralOrb />
      <DataStream position={[-8, 0, -10]} color="#8b5cf6" />
      <DataStream position={[-6, 0, -12]} color="#3b82f6" />
      <DataStream position={[10, 0, -8]} color="#10b981" />
    </>
  );
}

export default function DashboardBackground() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
