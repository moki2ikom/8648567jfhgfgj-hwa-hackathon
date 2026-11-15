'use client';

import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Html,
  OrbitControls,
  RoundedBox,
  Text,
  Environment,
  Stage,
  ContactShadows,
} from '@react-three/drei';
import { Group, Mesh, MeshStandardMaterial } from 'three';

const MODULE_COLORS: Record<string, string> = {
  'scent-maze': '#E8A87C',
  'treat-tumble': '#F4C542',
  'flip-find': '#8FC1E3',
  'snuffle-spiral': '#D4A5D8',
  'scent-tubes': '#A8D5BA',
  'paw-press': '#F0A0A0',
};

const MODULE_LABELS: Record<string, string> = {
  'scent-maze': 'Scent\nMaze',
  'treat-tumble': 'Treat\nTumble',
  'flip-find': 'Flip &\nFind',
  'snuffle-spiral': 'Snuffle\nSpiral',
  'scent-tubes': 'Scent\nTubes',
  'paw-press': 'Paw\nPress',
};

const moduleOrder = [
  'scent-maze',
  'treat-tumble',
  'flip-find',
  'snuffle-spiral',
  'scent-tubes',
  'paw-press',
];

function BaseStation() {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        // @ts-expect-error - args type inference issue with drei
        args={[24, 2.5, 18, 0.5, 4]}
        position={[0, 1.25, 0]}
        color="#2D2D2D"
        roughness={0.4}
        metalness={0.2}
        castShadow
        receiveShadow
      >
        <Html
          center
          position={[0, -1.5, 9.5] as const}
          rotation={[-Math.PI / 2, 0, 0]}
          style={{
            fontSize: '0.5rem',
            color: '#888',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          SNIFF & SOLVE
        </Html>
      </RoundedBox>

      <RoundedBox
        // @ts-expect-error - args type inference issue with drei
        args={[24, 0.4, 18, 0.2, 4]}
        position={[0, 0.2, 0]}
        color="#1A1A1A"
        roughness={0.6}
        metalness={0.1}
        receiveShadow
      />

      {moduleOrder.map((moduleId, index) => {
        const x = (index - 2.5) * 3.8;
        const isHovered = hovered === moduleId;
        const moduleColor = MODULE_COLORS[moduleId];

        return (
          <ModuleSlot
            key={moduleId}
            position={[x, 3.2, 0] as const}
            color={moduleColor}
            label={MODULE_LABELS[moduleId]}
            isHovered={isHovered}
            onHover={() => setHovered(moduleId)}
            onLeave={() => setHovered(null)}
          />
        );
      })}
    </group>
  );
}

interface ModuleSlotProps {
  position: [number, number, number];
  color: string;
  label: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function ModuleSlot({
  position,
  color,
  label,
  isHovered,
  onHover,
  onLeave,
}: ModuleSlotProps) {
  const meshRef = useRef<Mesh>(null);
  const [isPressed, setIsPressed] = useState(false);

  return (
    <group position={position} onPointerOver={onHover} onPointerOut={onLeave}>
      <RoundedBox
        ref={meshRef}
        // @ts-expect-error - args type inference issue with drei
        args={[3.2, 2.8, 3.2, 0.3, 4]}
        color={color}
        roughness={0.5}
        metalness={0.05}
        castShadow
        receiveShadow
        scale={isHovered ? 1.08 : 1}
        position={[0, 1.4, 0]}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        style={{ transition: 'transform 0.2s ease, scale 0.2s ease' }}
      >
        <Html
          center
          position={[0, -2.2, 0] as const}
          rotation={[-Math.PI / 2, 0, 0]}
          style={{
            fontSize: '0.35rem',
            color: '#333',
            fontWeight: 600,
            lineHeight: 1.1,
            textAlign: 'center',
            whiteSpace: 'pre-line',
          }}
        >
          {label}
        </Html>
      </RoundedBox>

      <ContactShadows
        position={[0, -0.2, 0] as const}
        scale={isHovered ? 1.2 : 1}
        opacity={0.15}
        blur={isHovered ? 4 : 2}
      />
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.05;
      particlesRef.current.rotation.x += delta * 0.02;
    }
  });

  const particles = Array.from({ length: 30 }, (_, i) => {
    const radius = 18 + Math.random() * 6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) + 5;
    const z = radius * Math.cos(phi);
    const size = 0.1 + Math.random() * 0.2;
    const colors = ['#E8A87C', '#F4C542', '#8FC1E3', '#D4A5D8', '#A8D5BA', '#F0A0A0'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return (
      <mesh
        key={i}
        position={[x, y, z] as const}
        scale={size}
        onPointerOver={(e: any) => e.stopPropagation()}
      >
        // @ts-expect-error - args type inference issue with drei
        <cylinderGeometry args={[0.5, 0, 0.5, 6]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.6}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>
    );
  });

  return <group ref={particlesRef}>{particles}</group>;
}

function Scene() {
  return (
    <>
      <Environment preset="studio" background={false} />
      <Stage
        shadows
        preset="rembrandt"
        intensity={1.2}
        environment="studio"
      >
        <BaseStation />
        <FloatingParticles />
      </Stage>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        minAzimuthAngle={-Math.PI / 4}
        maxAzimuthAngle={Math.PI / 4}
      />
    </>
  );
}

export function Product3D() {
  return (
    <div className="relative w-full h-full min-h-[500px] max-w-4xl mx-auto">
      <Canvas
        camera={{ position: [0, 6, 28], fov: 35 }}
        style={{ outline: 'none' }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-gray-500 font-medium">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading 3D view...</p>
      </div>
    </div>
  );
}