'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Lightformer,
  OrbitControls,
  RoundedBox,
} from '@react-three/drei';
import {
  CanvasTexture,
  CatmullRomCurve3,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  PCFShadowMap,
  PerspectiveCamera,
  SRGBColorSpace,
  Vector3,
} from 'three';

const DECK_Y = 2.56;

export const MODULE_COLORS: Record<string, string> = {
  'scent-maze': '#B96A4C',
  'treat-tumble': '#C58F2E',
  'flip-find': '#5E7F9C',
  'snuffle-spiral': '#946F8A',
  'scent-tubes': '#6E8A77',
  'paw-press': '#C47968',
};

const DEEP: Record<string, string> = {
  'scent-maze': '#8F4632',
  'treat-tumble': '#926718',
  'flip-find': '#3F5C75',
  'snuffle-spiral': '#6B4C63',
  'scent-tubes': '#4C6654',
  'paw-press': '#985542',
};

const LIGHT: Record<string, string> = {
  'scent-maze': '#D98E70',
  'treat-tumble': '#E3B155',
  'flip-find': '#7FA2BE',
  'snuffle-spiral': '#B58FAA',
  'scent-tubes': '#92AE99',
  'paw-press': '#E09C88',
};

const BONE = '#E8DDC8';
const METAL = '#BDB29B';
const RUBBER = '#17150F';

const SLOTS: Record<string, [number, number]> = {
  'scent-maze': [-7.6, -4.1],
  'treat-tumble': [0, -4.1],
  'flip-find': [7.6, -4.1],
  'snuffle-spiral': [-7.6, 4.1],
  'scent-tubes': [0, 4.1],
  'paw-press': [7.6, 4.1],
};

const ORDER = ['scent-maze', 'treat-tumble', 'flip-find', 'snuffle-spiral', 'scent-tubes', 'paw-press'];

function useNameplateTexture() {
  const texture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.clearRect(0, 0, 1024, 160);
    ctx.fillStyle = '#E8D9BE';
    ctx.font = '600 54px Georgia, "Times New Roman", serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('SNIFF & SOLVE', 44, 74);
    ctx.font = '500 22px ui-monospace, Menlo, monospace';
    ctx.fillStyle = '#B9A57E';
    ctx.fillText('STATION  /  01', 640, 78);
    ctx.strokeStyle = '#B9A57E';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(44, 116);
    ctx.lineTo(300, 116);
    ctx.stroke();
    const tex = new CanvasTexture(canvas);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);
  return texture;
}

function Base() {
  const texture = useNameplateTexture();
  const feet: Array<[number, number]> = [
    [-10.3, -7.4],
    [10.3, -7.4],
    [-10.3, 7.4],
    [10.3, 7.4],
  ];

  return (
    <group>
      {feet.map(([x, z]) => (
        <group key={`${x}-${z}`} position={[x, 0, z]}>
          <mesh position={[0, 0.24, 0]} castShadow>
            <cylinderGeometry args={[0.44, 0.5, 0.48, 28]} />
            <meshStandardMaterial color={RUBBER} roughness={0.95} metalness={0.02} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.06, 28]} />
            <meshStandardMaterial color={METAL} roughness={0.34} metalness={1} />
          </mesh>
        </group>
      ))}

      <RoundedBox
        args={[23.6, 1.5, 17.6]}
        radius={0.4}
        smoothness={5}
        bevelSegments={4}
        position={[0, 1.25, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#242427" roughness={0.48} metalness={0.18} />
      </RoundedBox>

      <RoundedBox
        args={[23.82, 0.16, 17.82]}
        radius={0.08}
        smoothness={3}
        position={[0, 2.06, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#B9A57E" roughness={0.3} metalness={1} />
      </RoundedBox>

      <RoundedBox
        args={[23.2, 0.4, 17.2]}
        radius={0.22}
        smoothness={4}
        position={[0, 2.28, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#19191C" roughness={0.42} metalness={0.24} />
      </RoundedBox>

      {ORDER.map((id) => {
        const [x, z] = SLOTS[id];
        return (
          <RoundedBox
            key={id}
            args={[5.9, 0.12, 5.9]}
            radius={0.14}
            smoothness={3}
            position={[x, 2.49, z]}
            receiveShadow
          >
            <meshStandardMaterial color="#0D0D0F" roughness={0.62} metalness={0.15} />
          </RoundedBox>
        );
      })}

      {[
        [-10.6, 0.55, 6],
        [-10.6, 0.55, 2],
        [10.6, 0.55, -2],
        [10.6, 0.55, -6],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.06, 0.5, 1.4]} />
          <meshStandardMaterial color="#101012" roughness={0.7} />
        </mesh>
      ))}

      {texture && (
        <mesh position={[0, 1.26, 8.815]}>
          <planeGeometry args={[7.4, 1.156]} />
          <meshBasicMaterial map={texture} transparent toneMapped={false} />
        </mesh>
      )}

      {[-3.6, 3.6].map((x) => (
        <mesh key={x} position={[x, 1.26, 8.83]} rotation={[0, 0, 0]}>
          <circleGeometry args={[0.09, 20]} />
          <meshStandardMaterial color={METAL} metalness={1} roughness={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function Screws({ color = METAL }: { color?: string }) {
  const positions: Array<[number, number]> = [
    [-2.42, -2.42],
    [2.42, -2.42],
    [-2.42, 2.42],
    [2.42, 2.42],
  ];
  return (
    <group>
      {positions.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.02, z]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 14]} />
          <meshStandardMaterial color={color} metalness={1} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function Treat({ position, scale = 0.23 }: { position: [number, number, number]; scale?: number }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <sphereGeometry args={[1, 18, 14]} />
      <meshStandardMaterial color="#E9CFA4" roughness={0.72} />
    </mesh>
  );
}

function ScentMaze() {
  const walls: Array<{ p: [number, number, number]; s: [number, number, number] }> = [
    { p: [-1.2, 0.3, -1.45], s: [2.6, 0.42, 0.28] },
    { p: [1.55, 0.3, -0.6], s: [0.28, 0.42, 1.9] },
    { p: [-0.4, 0.3, 0.25], s: [2.4, 0.42, 0.28] },
    { p: [-1.85, 0.3, 1.15], s: [0.28, 0.42, 1.8] },
    { p: [1.1, 0.3, 1.5], s: [2.1, 0.42, 0.28] },
    { p: [2.1, 0.3, 0.45], s: [0.28, 0.42, 1.6] },
  ];
  return (
    <group>
      <RoundedBox args={[5.6, 0.8, 5.6]} radius={0.2} smoothness={4} position={[0, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={MODULE_COLORS['scent-maze']} roughness={0.45} metalness={0.06} />
      </RoundedBox>
      <RoundedBox args={[5.02, 0.14, 5.02]} radius={0.1} smoothness={3} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={DEEP['scent-maze']} roughness={0.55} />
      </RoundedBox>
      {walls.map((wall, i) => (
        <mesh key={i} position={[wall.p[0], 0.98, wall.p[2]]} castShadow>
          <boxGeometry args={wall.s} />
          <meshStandardMaterial color={BONE} roughness={0.5} />
        </mesh>
      ))}
      <Treat position={[-2.05, 1.02, -2.0]} scale={0.19} />
      <Treat position={[0.2, 1.02, -0.9]} scale={0.2} />
      <Treat position={[2.06, 1.02, 1.95]} scale={0.19} />
      <mesh position={[0.1, 0.9, 2.42]}>
        <boxGeometry args={[0.5, 0.12, 0.2]} />
        <meshStandardMaterial color={METAL} metalness={1} roughness={0.35} />
      </mesh>
      <Screws />
    </group>
  );
}

function TreatTumble() {
  const treats: Array<[number, number, number]> = [
    [-0.8, 1.65, 0.4],
    [-0.2, 1.45, -0.2],
    [0.5, 1.7, 0.1],
    [0.9, 1.4, -0.5],
    [-0.5, 1.35, -0.6],
  ];
  return (
    <group>
      <RoundedBox args={[5.6, 0.42, 5.6]} radius={0.16} smoothness={3} position={[0, 0.21, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={DEEP['treat-tumble']} roughness={0.5} />
      </RoundedBox>
      {[-2.36, 2.36].map((x) => (
        <RoundedBox
          key={x}
          args={[0.5, 2.2, 4.7]}
          radius={0.18}
          smoothness={4}
          position={[x, 1.5, 0]}
          castShadow
        >
          <meshStandardMaterial color={MODULE_COLORS['treat-tumble']} roughness={0.42} metalness={0.05} />
        </RoundedBox>
      ))}
      <mesh position={[0, 1.75, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[1.72, 1.72, 3.15, 48, 1, true]} />
        <meshPhysicalMaterial
          color="#F3F6F4"
          roughness={0.12}
          metalness={0}
          transmission={0.92}
          thickness={0.55}
          ior={1.48}
          transparent
          opacity={0.55}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, 1.75, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.13, 0.13, 4.75, 16]} />
        <meshStandardMaterial color={METAL} metalness={1} roughness={0.26} />
      </mesh>
      {[-1.62, 1.62].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[1.78, 1.78, 0.14, 40]} />
            <meshStandardMaterial color={MODULE_COLORS['treat-tumble']} roughness={0.4} />
          </mesh>
          <mesh position={[x * 1.06, 1.75, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.42, 0.42, 0.1, 28]} />
            <meshStandardMaterial color="#1B1710" roughness={0.6} />
          </mesh>
        </group>
      ))}
      {treats.map((p, i) => (
        <Treat key={i} position={p} scale={0.21} />
      ))}
      <Screws />
    </group>
  );
}

function FlipFind() {
  const lids: Array<{ x: number; open: number }> = [
    { x: -1.6, open: -0.62 },
    { x: 0, open: -0.5 },
    { x: 1.6, open: -0.7 },
  ];
  return (
    <group>
      <RoundedBox args={[5.6, 0.92, 5.6]} radius={0.2} smoothness={4} position={[0, 0.46, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={MODULE_COLORS['flip-find']} roughness={0.44} metalness={0.06} />
      </RoundedBox>
      <RoundedBox args={[4.9, 0.16, 4.9]} radius={0.1} smoothness={3} position={[0, 0.92, 0]}>
        <meshStandardMaterial color={DEEP['flip-find']} roughness={0.55} />
      </RoundedBox>
      {lids.map(({ x, open }) => (
        <group key={x} position={[x, 1.02, -1.15]} rotation={[open, 0, 0]}>
          <RoundedBox
            args={[1.42, 0.16, 2.2]}
            radius={0.07}
            smoothness={3}
            position={[0, 0.06, 1.08]}
            castShadow
          >
            <meshStandardMaterial color={LIGHT['flip-find']} roughness={0.4} />
          </RoundedBox>
          <mesh position={[0, 0.14, 1.08]}>
            <boxGeometry args={[0.5, 0.05, 0.72]} />
            <meshStandardMaterial color={BONE} roughness={0.55} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 1.5, 14]} />
            <meshStandardMaterial color={METAL} metalness={1} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <Treat position={[-1.6, 1.12, -0.2]} scale={0.2} />
      <Treat position={[0.35, 1.12, 0.3]} scale={0.19} />
      <Treat position={[1.6, 1.12, -0.15]} scale={0.21} />
      <Screws />
    </group>
  );
}

function SnuffleSpiral() {
  const curve = useMemo(() => {
    const points: Vector3[] = [];
    const turns = 2.4;
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = t * Math.PI * 2 * turns;
      const radius = 0.72 + t * 1.62;
      points.push(new Vector3(Math.cos(angle) * radius, 0.34 + t * 0.34, Math.sin(angle) * radius));
    }
    return new CatmullRomCurve3(points, false, 'centripetal');
  }, []);

  const treats = useMemo(
    () =>
      [0.18, 0.34, 0.52, 0.66, 0.82].map((t) => {
        const p = curve.getPointAt(t);
        return [p.x, p.y + 0.32, p.z] as [number, number, number];
      }),
    [curve]
  );

  return (
    <group>
      <RoundedBox args={[5.6, 0.44, 5.6]} radius={0.16} smoothness={3} position={[0, 0.22, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={DEEP['snuffle-spiral']} roughness={0.52} />
      </RoundedBox>
      <mesh position={[0, 0.46, 0]}>
        <cylinderGeometry args={[2.62, 2.62, 0.1, 56]} />
        <meshStandardMaterial color={MODULE_COLORS['snuffle-spiral']} roughness={0.6} />
      </mesh>
      <mesh castShadow receiveShadow>
        <tubeGeometry args={[curve, 200, 0.34, 12, false]} />
        <meshPhysicalMaterial
          color={MODULE_COLORS['snuffle-spiral']}
          roughness={0.94}
          sheen={1}
          sheenRoughness={0.7}
          sheenColor="#E9CFDF"
        />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.55, 0.62, 0.32, 28]} />
        <meshStandardMaterial color={DEEP['snuffle-spiral']} roughness={0.6} />
      </mesh>
      {treats.map((p, i) => (
        <Treat key={i} position={[p[0], p[1] + 0.1, p[2]]} scale={0.16} />
      ))}
    </group>
  );
}

function ScentTubes() {
  const tubes: Array<{ x: number; z: number; h: number }> = [
    { x: -1.55, z: -1.35, h: 2.5 },
    { x: 0, z: -1.55, h: 1.7 },
    { x: 1.55, z: -1.25, h: 2.9 },
    { x: -1.45, z: 1.15, h: 1.5 },
    { x: 0.15, z: 1.35, h: 2.2 },
    { x: 1.6, z: 1.1, h: 1.1 },
  ];
  return (
    <group>
      <RoundedBox args={[5.6, 0.76, 5.6]} radius={0.2} smoothness={4} position={[0, 0.38, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={MODULE_COLORS['scent-tubes']} roughness={0.46} metalness={0.05} />
      </RoundedBox>
      <RoundedBox args={[4.95, 0.12, 4.95]} radius={0.1} smoothness={3} position={[0, 0.76, 0]}>
        <meshStandardMaterial color={DEEP['scent-tubes']} roughness={0.55} />
      </RoundedBox>
      {tubes.map((tube, i) => (
        <group key={i} position={[tube.x, 0.76, tube.z]}>
          <mesh position={[0, tube.h / 2, 0]} castShadow>
            <cylinderGeometry args={[0.44, 0.44, tube.h, 26, 1, true]} />
            <meshStandardMaterial color={LIGHT['scent-tubes']} roughness={0.55} side={DoubleSide} />
          </mesh>
          <mesh position={[0, tube.h / 2, 0]}>
            <cylinderGeometry args={[0.34, 0.34, tube.h - 0.04, 22, 1, true]} />
            <meshStandardMaterial color="#2A3A30" roughness={0.7} side={DoubleSide} />
          </mesh>
          <mesh position={[0, tube.h, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.055, 10, 28]} />
            <meshStandardMaterial color={METAL} metalness={1} roughness={0.3} />
          </mesh>
          {i % 2 === 0 && <Treat position={[0, tube.h * 0.6, 0]} scale={0.16} />}
        </group>
      ))}
      <Screws />
    </group>
  );
}

function PawPress() {
  const pads: Array<[number, number]> = [
    [-1.2, -1.2],
    [1.2, -1.2],
    [-1.2, 1.2],
    [1.2, 1.2],
  ];
  return (
    <group>
      <RoundedBox args={[5.6, 0.8, 5.6]} radius={0.2} smoothness={4} position={[0, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={MODULE_COLORS['paw-press']} roughness={0.44} metalness={0.06} />
      </RoundedBox>
      <RoundedBox args={[4.95, 0.1, 4.95]} radius={0.1} smoothness={3} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={DEEP['paw-press']} roughness={0.55} />
      </RoundedBox>
      {pads.map(([x, z], i) => (
        <group key={i} position={[x, 0.86, z]}>
          <mesh rotation={[0, 0, 0]} castShadow>
            <sphereGeometry args={[0.72, 28, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshPhysicalMaterial
              color={LIGHT['paw-press']}
              roughness={0.3}
              clearcoat={0.7}
              clearcoatRoughness={0.25}
            />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.74, 0.055, 10, 36]} />
            <meshStandardMaterial color={METAL} metalness={1} roughness={0.32} />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.5, 0.58, 40]} />
            <meshStandardMaterial
              color="#F2C57C"
              emissive="#C8892F"
              emissiveIntensity={i === 0 ? 2.4 : 0.7}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <Screws />
    </group>
  );
}

const MODULE_BODIES: Record<string, () => React.ReactElement> = {
  'scent-maze': ScentMaze,
  'treat-tumble': TreatTumble,
  'flip-find': FlipFind,
  'snuffle-spiral': SnuffleSpiral,
  'scent-tubes': ScentTubes,
  'paw-press': PawPress,
};

interface ModuleUnitProps {
  id: string;
  index: number;
  active: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}

function ModuleUnit({ id, index, active, hovered, onHover, onSelect }: ModuleUnitProps) {
  const group = useRef<Group>(null);
  const [x, z] = SLOTS[id];
  const Body = MODULE_BODIES[id];

  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    const lift = active || hovered ? 0.18 : 0;
    group.current.position.y = MathUtils.damp(group.current.position.y, DECK_Y + lift, 7, delta);
    const appear = MathUtils.clamp((time - 0.25 - index * 0.08) / 0.6, 0, 1);
    const eased = 1 - Math.pow(1 - appear, 3);
    group.current.scale.setScalar(0.86 + eased * 0.14);
  });

  return (
    <group ref={group} position={[x, DECK_Y - 1.2, z]}>
      <Body />
      <mesh
        position={[0, 1.4, 0]}
        onPointerOver={(event) => {
          event.stopPropagation();
          onHover(id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(event) => {
          event.stopPropagation();
          onSelect(id);
        }}
      >
        <boxGeometry args={[5.6, 3.6, 5.6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}

function ScentDust() {
  const group = useRef<Group>(null);
  const dots = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const radius = 11 + (i % 4) * 2.1;
        return {
          x: Math.cos(angle) * radius,
          y: 3.4 + (i % 5) * 1.05,
          z: Math.sin(angle) * radius * 0.7,
          s: 0.035 + (i % 3) * 0.015,
          speed: 0.06 + (i % 4) * 0.012,
        };
      }),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const dot = dots[i];
      if (!dot) return;
      child.position.y = 3.4 + ((state.clock.elapsedTime * dot.speed + i * 0.9) % 6);
    });
  });

  return (
    <group ref={group}>
      {dots.map((dot, i) => (
        <mesh key={i} position={[dot.x, dot.y, dot.z]} scale={dot.s}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshBasicMaterial color="#C8892F" transparent opacity={0.42} />
        </mesh>
      ))}
    </group>
  );
}

function StudioEnvironment() {
  return (
    <Environment resolution={256} frames={1} environmentIntensity={0.9}>
      <color attach="background" args={['#0D0C0A']} />
      <Lightformer
        form="rect"
        intensity={4.2}
        scale={[13, 7]}
        position={[0, 10, 0]}
        rotation-x={-Math.PI / 2}
        color="#FFF3DF"
      />
      <Lightformer
        form="rect"
        intensity={2.6}
        scale={[2.5, 8]}
        position={[-10, 4, 4]}
        rotation-y={Math.PI / 2}
        color="#FFD8AF"
      />
      <Lightformer
        form="circle"
        intensity={1.9}
        scale={5}
        position={[9, 6, -7]}
        color="#CFE0FF"
      />
      <Lightformer form="ring" intensity={1.2} scale={7} position={[0, 3, 10]} color="#FFFFFF" />
    </Environment>
  );
}

function CameraRig() {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;
    const aspect = size.width / Math.max(1, size.height);
    if (aspect < 0.95) {
      camera.position.set(18, 15, 27);
    } else {
      camera.position.set(15, 12.5, 20.5);
    }
    camera.lookAt(0, 3, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

function Station({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const root = useRef<Group>(null);
  const ring = useRef<Group>(null);

  useFrame((state, delta) => {
    if (root.current) {
      root.current.position.y = MathUtils.damp(root.current.position.y, 0, 2.8, delta);
    }
    if (ring.current) {
      const target = selected || hovered ? 1 : 0;
      ring.current.children.forEach((child) => {
        const material = (child as Mesh).material as { opacity: number };
        material.opacity = MathUtils.damp(material.opacity, target * 0.85, 8, delta);
      });
    }
  });

  return (
    <group ref={root} position={[0, -1.1, 0]}>
      <Base />
      {ORDER.map((id, index) => (
        <ModuleUnit
          key={id}
          id={id}
          index={index}
          active={selected === id}
          hovered={hovered === id}
          onHover={setHovered}
          onSelect={onSelect}
        />
      ))}
      <group ref={ring}>
        {ORDER.map((id) => {
          const [x, z] = SLOTS[id];
          return (
            <mesh key={id} position={[x, DECK_Y + 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.72, 2.86, 64]} />
              <meshBasicMaterial
                color={MODULE_COLORS[id]}
                transparent
                opacity={0}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
      <ScentDust />
    </group>
  );
}

function Scene({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <StudioEnvironment />
      <ambientLight intensity={0.22} />
      <directionalLight
        position={[12, 19, 11]}
        intensity={1.55}
        color="#FFF4E4"
        castShadow
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
        shadow-camera-near={2}
        shadow-camera-far={60}
        shadow-camera-left={-19}
        shadow-camera-right={19}
        shadow-camera-top={19}
        shadow-camera-bottom={-19}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-12, 8, -8]} intensity={0.45} color="#F2D8B0" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[36, 64]} />
        <meshStandardMaterial color="#EDE4D4" roughness={0.95} metalness={0} />
      </mesh>
      <Station selected={selected} onSelect={onSelect} />
      <ContactShadows
        position={[0, 0.02, 0]}
        opacity={0.5}
        scale={44}
        blur={2.6}
        far={12}
        resolution={512}
        frames={60}
        color="#2B2115"
      />
      <CameraRig />
      <OrbitControls
        target={[0, 3.1, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={0.55}
        zoomSpeed={0.6}
        minDistance={19}
        maxDistance={44}
        minPolarAngle={Math.PI / 3.6}
        maxPolarAngle={Math.PI / 2.05}
        minAzimuthAngle={-Math.PI / 4.5}
        maxAzimuthAngle={Math.PI / 4.5}
      />
    </>
  );
}

interface Product3DProps {
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

export function Product3D({ selected = null, onSelect, className }: Product3DProps) {
  const [contextLost, setContextLost] = useState(false);

  return (
    <div className={className ?? 'relative h-full w-full'}>
      {contextLost ? (
        <div className="flex h-full w-full items-center justify-center bg-bone-100">
          <p className="max-w-xs px-6 text-center font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50">
            3D preview needs WebGL. The station is shown in the diagram below.
          </p>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-bone-100">
              <div className="text-center">
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border border-ink/15 border-t-ochre" />
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink/45">
                  Calibrating station
                </p>
              </div>
            </div>
          }
        >
          <Canvas
            dpr={[1, 1.75]}
            shadows={{ type: PCFShadowMap }}
            camera={{ position: [15, 12.5, 20.5], fov: 32 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (event) => {
                event.preventDefault();
                setContextLost(true);
              });
            }}
          >
            <Scene
              selected={selected}
              onSelect={(id) => {
                onSelect?.(id);
              }}
            />
          </Canvas>
        </Suspense>
      )}
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ink/40">
        <span className="inline-block h-1 w-1 rounded-full bg-ochre" />
        Drag to orbit · Scroll to zoom
      </div>
    </div>
  );
}
