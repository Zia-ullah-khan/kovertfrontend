'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({ position, color, speed, distort, scale, shape }: {
  position: [number, number, number];
  color: string;
  speed: number;
  distort: number;
  scale: number;
  shape: 'sphere' | 'box' | 'torus' | 'icosahedron';
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
      meshRef.current.rotation.y += 0.005 * speed;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.5;
    }
  });

  const ShapeComponent = {
    sphere: Sphere,
    box: Box,
    torus: Torus,
    icosahedron: Icosahedron,
  }[shape];

  const args = shape === 'torus' ? [0.5, 0.2, 16, 32] : shape === 'box' ? [1, 1, 1] : [1, 32, 32];

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <ShapeComponent ref={meshRef} position={position} scale={scale} args={args as any}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </ShapeComponent>
    </Float>
  );
}

function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 500;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return [pos];
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
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
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function GlowingRing({ position, color, scale }: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <mesh ref={ringRef} position={position} scale={scale}>
      <torusGeometry args={[1, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3b82f6" />
      <spotLight position={[0, 10, 0]} intensity={0.5} color="#10b981" angle={0.3} />

      <ParticleField />

      {/* Main decorative shapes */}
      <FloatingShape position={[-4, 2, -5]} color="#8b5cf6" speed={1.2} distort={0.4} scale={1.5} shape="sphere" />
      <FloatingShape position={[5, -1, -8]} color="#3b82f6" speed={0.8} distort={0.3} scale={1.2} shape="icosahedron" />
      <FloatingShape position={[-6, -3, -6]} color="#10b981" speed={1} distort={0.5} scale={0.8} shape="box" />
      <FloatingShape position={[4, 3, -4]} color="#f43f5e" speed={1.5} distort={0.2} scale={1} shape="torus" />
      <FloatingShape position={[0, -4, -10]} color="#f59e0b" speed={0.6} distort={0.4} scale={2} shape="sphere" />
      <FloatingShape position={[-3, 4, -7]} color="#06b6d4" speed={1.1} distort={0.3} scale={0.7} shape="icosahedron" />
      <FloatingShape position={[6, 1, -6]} color="#a855f7" speed={0.9} distort={0.35} scale={1.1} shape="box" />

      {/* Glowing rings */}
      <GlowingRing position={[0, 0, -8]} color="#8b5cf6" scale={3} />
      <GlowingRing position={[-2, 2, -12]} color="#3b82f6" scale={2} />
      <GlowingRing position={[3, -2, -10]} color="#10b981" scale={1.5} />
    </>
  );
}

export default function FloatingCubes() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
