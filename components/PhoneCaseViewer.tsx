"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei/core/OrbitControls";
import { ContactShadows } from "@react-three/drei/core/ContactShadows";
import { Float } from "@react-three/drei/core/Float";
import { RoundedBox } from "@react-three/drei/core/RoundedBox";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PhoneCaseViewerProps {
  caseColor?: string;
  phoneColor?: string;
  caseName?: string;
  onColorChange?: (color: string) => void;
}

// ---------------------------------------------------------------------------
// Color palette
// ---------------------------------------------------------------------------

const CASE_COLORS = [
  { hex: "#e05c00", label: "Cosmic Orange" },
  { hex: "#1c1c1e", label: "Midnight" },
  { hex: "#f5f5f0", label: "Clear" },
  { hex: "#0a4f6e", label: "Ocean" },
  { hex: "#7b2d8b", label: "Violet" },
] as const;

// ---------------------------------------------------------------------------
// Phone + Case scene (rendered *inside* Canvas)
// ---------------------------------------------------------------------------

interface PhoneSceneProps {
  caseColor: string;
  phoneColor: string;
  targetCaseColor: string;
}

/** MagSafe ring on the back of the case — sits flush on the back surface */
function MagSafeRing({ color }: { color: string }) {
  const lighterColor = new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.15).getHexString();
  return (
    <group position={[0, -0.15, -0.069]}>
      {/* Outer ring — torus in XY plane faces ±Z by default, which is correct for the back face */}
      <mesh>
        <torusGeometry args={[0.2, 0.008, 16, 64]} />
        <meshStandardMaterial color={`#${lighterColor}`} roughness={0.6} metalness={0.15} />
      </mesh>
      {/* Inner subtle disc */}
      <mesh position={[0, 0, 0.001]} rotation={[Math.PI, 0, 0]}>
        <circleGeometry args={[0.19, 64]} />
        <meshStandardMaterial
          color={color}
          roughness={0.85}
          metalness={0}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

/** Side button bumps on the case */
function SideButtons({ color }: { color: string }) {
  const darkerColor = new THREE.Color(color).multiplyScalar(0.8).getHexString();
  // Positions relative to case half-width (0.38) 
  const xRight = 0.39;
  const xLeft = -0.39;
  const zMid = -0.01; // centred on case depth
  return (
    <group>
      {/* Right side: power button */}
      <RoundedBox args={[0.012, 0.1, 0.04]} smoothness={4} radius={0.005} position={[xRight, 0.18, zMid]}>
        <meshStandardMaterial color={`#${darkerColor}`} roughness={0.65} metalness={0.12} />
      </RoundedBox>

      {/* Left side: volume up */}
      <RoundedBox args={[0.012, 0.065, 0.04]} smoothness={4} radius={0.005} position={[xLeft, 0.28, zMid]}>
        <meshStandardMaterial color={`#${darkerColor}`} roughness={0.65} metalness={0.12} />
      </RoundedBox>

      {/* Left side: volume down */}
      <RoundedBox args={[0.012, 0.065, 0.04]} smoothness={4} radius={0.005} position={[xLeft, 0.14, zMid]}>
        <meshStandardMaterial color={`#${darkerColor}`} roughness={0.65} metalness={0.12} />
      </RoundedBox>

      {/* Left side: mute / action button */}
      <RoundedBox args={[0.012, 0.03, 0.03]} smoothness={4} radius={0.005} position={[xLeft, 0.42, zMid]}>
        <meshStandardMaterial color={`#${darkerColor}`} roughness={0.65} metalness={0.12} />
      </RoundedBox>
    </group>
  );
}

function PhoneScene({ caseColor, phoneColor, targetCaseColor }: PhoneSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRefs = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const targetColor = useRef(new THREE.Color(targetCaseColor));
  const startTime = useRef<number | null>(null);

  // Collect material refs for color lerp
  const addMaterialRef = useCallback((el: THREE.MeshPhysicalMaterial | null) => {
    if (el && !materialRefs.current.includes(el)) materialRefs.current.push(el);
  }, []);

  useEffect(() => {
    targetColor.current.set(targetCaseColor);
  }, [targetCaseColor]);

  useFrame((state, delta) => {
    // Smooth color transition on ALL case materials
    for (const mat of materialRefs.current) {
      mat.color.lerp(targetColor.current, 4 * delta);
    }

    // Auto-rotate intro: start from back view, settle at slight angle showing back
    if (groupRef.current) {
      if (startTime.current === null) {
        startTime.current = state.clock.elapsedTime;
        groupRef.current.rotation.y = Math.PI * 0.85;
      }
      const elapsed = state.clock.elapsedTime - startTime.current;
      if (elapsed < 1.5) {
        const t = Math.min(elapsed / 1.5, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(
          Math.PI * 0.85,
          Math.PI * 0.12,
          ease
        );
      }
    }
  });

  // ---- Shared case material props ----
  const caseMat = {
    color: caseColor,
    roughness: 0.6,
    metalness: 0.05,
    clearcoat: 0.35,
    clearcoatRoughness: 0.35,
  } as const;

  // iPhone 17 Pro approximate proportions (scaled)
  const W = 0.72;   // width
  const H = 1.54;   // height
  const D = 0.085;  // phone depth
  const WALL = 0.02; // case wall thickness
  const CASE_W = W + WALL * 2;
  const CASE_H = H + WALL * 2;
  const CASE_D = D + WALL;
  const BACK_Z = -(D / 2 + WALL / 2); // z of the back plate centre

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.2}>
      <group ref={groupRef}>

        {/* ======== PHONE BODY (sits inside the case) ======== */}
        <RoundedBox args={[W, H, D]} smoothness={8} radius={0.045}>
          <meshPhysicalMaterial
            color={phoneColor}
            metalness={0.85}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.05}
          />
        </RoundedBox>

        {/* Screen */}
        <mesh position={[0, 0, D / 2 + 0.001]}>
          <planeGeometry args={[W - 0.06, H - 0.1]} />
          <meshPhysicalMaterial color="#0a0a0f" roughness={0.03} metalness={0} clearcoat={1} />
        </mesh>

        {/* Dynamic Island */}
        <RoundedBox args={[0.1, 0.026, 0.002]} smoothness={4} radius={0.009} position={[0, 0.63, D / 2 + 0.002]}>
          <meshStandardMaterial color="#000000" />
        </RoundedBox>

        {/* ======== CASE SHELL ======== */}
        {/* Back plate — one solid piece */}
        <RoundedBox
          args={[CASE_W, CASE_H, WALL]}
          smoothness={8}
          radius={0.055}
          position={[0, 0, BACK_Z]}
          castShadow
        >
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>

        {/* Left wall */}
        <RoundedBox
          args={[WALL, CASE_H, CASE_D]}
          smoothness={4}
          radius={0.009}
          position={[-(CASE_W / 2 - WALL / 2), 0, -WALL / 2]}
        >
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>

        {/* Right wall */}
        <RoundedBox
          args={[WALL, CASE_H, CASE_D]}
          smoothness={4}
          radius={0.009}
          position={[CASE_W / 2 - WALL / 2, 0, -WALL / 2]}
        >
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>

        {/* Top wall */}
        <RoundedBox
          args={[CASE_W, WALL, CASE_D]}
          smoothness={4}
          radius={0.009}
          position={[0, CASE_H / 2 - WALL / 2, -WALL / 2]}
        >
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>

        {/* Bottom wall */}
        <RoundedBox
          args={[CASE_W, WALL, CASE_D]}
          smoothness={4}
          radius={0.009}
          position={[0, -(CASE_H / 2 - WALL / 2), -WALL / 2]}
        >
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>

        {/* Front lip — subtle raised edge all around the screen */}
        {/* Top lip */}
        <RoundedBox args={[CASE_W - 0.04, 0.012, 0.008]} smoothness={4} radius={0.003} position={[0, CASE_H / 2 - 0.015, D / 2 - 0.004]}>
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>
        {/* Bottom lip */}
        <RoundedBox args={[CASE_W - 0.04, 0.012, 0.008]} smoothness={4} radius={0.003} position={[0, -(CASE_H / 2 - 0.015), D / 2 - 0.004]}>
          <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
        </RoundedBox>

        {/* ======== CAMERA ISLAND ======== */}
        {/* Raised platform — large rounded square on back surface */}
        <group position={[-0.14, 0.42, BACK_Z - WALL / 2]}>
          {/* Raised island body */}
          <RoundedBox args={[0.36, 0.36, 0.022]} smoothness={6} radius={0.06}>
            <meshPhysicalMaterial ref={addMaterialRef} {...caseMat} />
          </RoundedBox>

          {/* Lens ring 1 (top-left) */}
          <group position={[-0.075, 0.075, -0.012]}>
            <mesh>
              <torusGeometry args={[0.044, 0.006, 16, 32]} />
              <meshPhysicalMaterial color="#222" roughness={0.15} metalness={0.9} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.038, 32]} />
              <meshPhysicalMaterial color="#0a0a12" roughness={0} metalness={0.3} clearcoat={1} envMapIntensity={2} />
            </mesh>
          </group>

          {/* Lens ring 2 (top-right) */}
          <group position={[0.075, 0.075, -0.012]}>
            <mesh>
              <torusGeometry args={[0.044, 0.006, 16, 32]} />
              <meshPhysicalMaterial color="#222" roughness={0.15} metalness={0.9} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.038, 32]} />
              <meshPhysicalMaterial color="#0a0a12" roughness={0} metalness={0.3} clearcoat={1} envMapIntensity={2} />
            </mesh>
          </group>

          {/* Lens ring 3 (bottom-left) */}
          <group position={[-0.075, -0.075, -0.012]}>
            <mesh>
              <torusGeometry args={[0.044, 0.006, 16, 32]} />
              <meshPhysicalMaterial color="#222" roughness={0.15} metalness={0.9} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.038, 32]} />
              <meshPhysicalMaterial color="#0a0a12" roughness={0} metalness={0.3} clearcoat={1} envMapIntensity={2} />
            </mesh>
          </group>

          {/* Flash / LiDAR (bottom-right — smaller) */}
          <group position={[0.075, -0.075, -0.012]}>
            <mesh>
              <torusGeometry args={[0.02, 0.005, 16, 32]} />
              <meshPhysicalMaterial color="#222" roughness={0.15} metalness={0.9} />
            </mesh>
            <mesh>
              <circleGeometry args={[0.015, 32]} />
              <meshStandardMaterial color="#1a1520" roughness={0.4} />
            </mesh>
          </group>
        </group>

        {/* MagSafe ring */}
        <MagSafeRing color={caseColor} />

        {/* Side buttons */}
        <SideButtons color={caseColor} />

        {/* Bottom port cutout */}
        <RoundedBox
          args={[0.1, WALL + 0.004, 0.04]}
          smoothness={4}
          radius={0.005}
          position={[0, -(CASE_H / 2), -WALL / 2]}
        >
          <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
        </RoundedBox>
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Skeleton Loader
// ---------------------------------------------------------------------------

function ViewerSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-48 w-28 animate-pulse rounded-3xl bg-zinc-700" />
        <p className="animate-pulse text-sm text-zinc-400">
          Loading 3D viewer…
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------

export default function PhoneCaseViewer({
  caseColor = "#e05c00",
  phoneColor = "#2c2c2e",
  caseName,
  onColorChange,
}: PhoneCaseViewerProps) {
  const [activeCaseColor, setActiveCaseColor] = useState(caseColor);

  const handleColorChange = useCallback(
    (hex: string) => {
      setActiveCaseColor(hex);
      onColorChange?.(hex);
    },
    [onColorChange]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* 3D Canvas */}
      <div className="relative h-[500px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800">
        <Suspense fallback={<ViewerSkeleton />}>
          <Canvas
            shadows
            camera={{ position: [0, 0, 4], fov: 45 }}
            gl={{
              alpha: true,
              antialias: true,
              powerPreference: "high-performance",
            }}
            onCreated={({ gl }) => {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.shadowMap.enabled = true;
              gl.shadowMap.type = THREE.PCFSoftShadowMap;
            }}
          >
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={1.8}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight position={[-5, 8, -3]} intensity={0.8} color="#c8d8ff" />
            <pointLight position={[-5, 5, -5]} intensity={0.8} color="#ffffff" />
            <pointLight position={[3, -2, 4]} intensity={0.4} color="#ffe8d0" />

            {/* Phone Scene */}
            <PhoneScene
              caseColor={activeCaseColor}
              phoneColor={phoneColor}
              targetCaseColor={activeCaseColor}
            />

            {/* Shadows */}
            <ContactShadows
              position={[0, -1, 0]}
              opacity={0.3}
              blur={2.5}
              far={4}
            />

            {/* Controls */}
            <OrbitControls
              enableDamping
              dampingFactor={0.05}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={(3 * Math.PI) / 4}
              minDistance={2.5}
              maxDistance={6}
            />
          </Canvas>
        </Suspense>

        {/* Optional product label */}
        {caseName && (
          <div className="pointer-events-none absolute bottom-4 left-4">
            <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              {caseName}
            </span>
          </div>
        )}
      </div>

      {/* Color picker */}
      <div className="flex items-center justify-center gap-3">
        {CASE_COLORS.map(({ hex, label }) => (
          <button
            key={hex}
            type="button"
            aria-label={`Select ${label} color`}
            title={label}
            onClick={() => handleColorChange(hex)}
            className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${
              activeCaseColor === hex
                ? "ring-2 ring-white ring-offset-2 ring-offset-zinc-900"
                : ""
            }`}
            style={{ backgroundColor: hex }}
          />
        ))}
      </div>
    </div>
  );
}
