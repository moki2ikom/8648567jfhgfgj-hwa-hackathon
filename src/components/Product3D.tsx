'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  Html,
  OrbitControls,
  RoundedBox,
  Environment,
  Stage,
  ContactShadows,
  PerspectiveCamera,
} from '@react-three/drei';
import { Group, Mesh, MeshStandardMaterial, Vector3, Clock } from 'three';

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
  const clock = useRef(new Clock());

  useFrame(() => {
    if (groupRef.current) {
      const elapsed = clock.current.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(elapsed * 0.15) * 0.15;
      groupRef.current.position.y = Math.sin(elapsed * 0.8) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <RoundedBox
        // @ts-expect-error - args type inference issue with drei
        args={[24, 2.5, 18, 0.5, 4]}
        position={[0, 1.25, 0] as const}
        color="#1E1E1E"
        roughness={0.3}
        metalness={0.25}
        castShadow
        receiveShadow
      >
        <Html
          center
          position={[0, -1.5, 9.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          style={{
            fontSize: '0.5rem',
            color: '#FBBF24',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          SNIFF & SOLVE
        </Html>
      </RoundedBox>

      <RoundedBox
        // @ts-expect-error - args type inference issue with drei
        args={[24, 0.4, 18, 0.2, 4]}
        position={[0, 0.2, 0] as const}
        color="#0F0F0F"
        roughness={0.5}
        metalness={0.15}
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
            index={index}
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
  index: number;
}

function ModuleSlot({
  position,
  color,
  label,
  isHovered,
  onHover,
  onLeave,
  index,
}: ModuleSlotProps) {
  const meshRef = useRef<Mesh>(null);
  const [isPressed, setIsPressed] = useState(false);
  const clock = useRef(new Clock());

  useFrame(() => {
    if (meshRef.current && !isHovered && !isPressed) {
      const elapsed = clock.current.getElapsedTime();
      const offset = index * 0.5;
      meshRef.current.position.y = 1.4 + Math.sin(elapsed * 1.2 + offset) * 0.02;
      meshRef.current.rotation.z = Math.sin(elapsed * 0.8 + offset) * 0.01;
    }
  });

  return (
    <group position={position} onPointerOver={onHover} onPointerOut={onLeave}>
      <RoundedBox
        ref={meshRef}
        // @ts-expect-error - args type inference issue with drei
        args={[3.2, 2.8, 3.2, 0.3, 4]}
        color={color}
        roughness={0.4}
        metalness={0.08}
        castShadow
        receiveShadow
        scale={isHovered ? 1.12 : 1}
        position={[0, 1.4, 0] as const}
        onPointerDown={() => setIsPressed(true)}
        onPointerUp={() => setIsPressed(false)}
        onPointerLeave={() => setIsPressed(false)}
        style={{ transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), scale 0.2s ease' }}
      >
        <Html
          center
          position={[0, -2.2, 0] as const}
          rotation={[-Math.PI / 2, 0, 0]}
          style={{
            fontSize: '0.35rem',
            color: '#1F2937',
            fontWeight: 700,
            lineHeight: 1.1,
            textAlign: 'center',
            whiteSpace: 'pre-line',
            textShadow: '0 1px 2px rgba(255,255,255,0.3)',
          }}
        >
          {label}
        </Html>
      </RoundedBox>

      <ContactShadows
        position={[0, -0.2, 0] as const}
        scale={isHovered ? 1.3 : 1}
        opacity={0.18}
        blur={isHovered ? 5 : 3}
        color={color}
      />
    </group>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<Group>(null);
  const clock = useRef(new Clock());

  useFrame(() => {
    if (particlesRef.current) {
      const elapsed = clock.current.getElapsedTime();
      particlesRef.current.rotation.y = elapsed * 0.02;
      particlesRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.05;
    }
  });

  const particles = Array.from({ length: 40 }, (_, i) => {
    const radius = 16 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta) + 4;
    const z = radius * Math.cos(phi);
    const size = 0.08 + Math.random() * 0.18;
    const colors = ['#E8A87C', '#F4C542', '#8FC1E3', '#D4A5D8', '#A8D5BA', '#F0A0A0'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const delay = Math.random() * Math.PI * 2;

    return (
      <mesh
        key={i}
        position={[x, y, z] as const}
        scale={size}
        onPointerOver={(e: any) => e.stopPropagation()}
      >
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.5}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    );
  });

  return <group ref={particlesRef}>{particles}</group>;
}

function AmbientLighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#FFF8E7" />
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        color="#FFFAE5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <directionalLight
        position={[-10, 8, -10]}
        intensity={0.5}
        color="#FDE68A"
      />
      <hemisphereLight intensity={0.4} groundColor="#FEF3C7" />
    </>
  );
}

function Scene() {
  return (
    <>
      <Environment
        preset="studio"
        background={false}
        files={['/studio.hdr']}
      />
      <AmbientLighting />
      <Stage
        shadows
        preset="rembrandt"
        intensity={1.0}
        environment="studio"
      >
        <BaseStation />
        <FloatingParticles />
      </Stage>
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minZoom={0.8}
        maxZoom={2.5}
        autoRotate={false}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI / 1.7}
        minAzimuthAngle={-Math.PI / 3.5}
        maxAzimuthAngle={Math.PI / 3.5}
        dampingFactor={0.08}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-50 to-white rounded-2xl">
      <div className="text-center">
        <div className="w-14 h-14 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium text-lg">Loading 3D experience...</p>
        <p className="text-gray-400 text-sm mt-1">Initializing modules</p>
      </div>
    </div>
  );
}

export function Product3D() {
  return (
    <div className="relative w-full h-full min-h-[550px] max-w-4xl mx-auto">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 5.5, 26], fov: 32 }}
          style={{ outline: 'none' }}
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }}
        >
          <Scene />
        </Canvas>
      </Suspense>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-1">
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Drag</kbd>
        <span>to rotate</span>
        <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 font-mono text-[10px]">Scroll</kbd>
        <span>to zoom</span>
      </div>
    </div>
  );
}