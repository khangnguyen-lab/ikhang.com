"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";

const ACCENT = "#635BFF";
const TRAVEL_SEC = 6.5;
const HOVER_SEC = 1.5;
const TRAJECTORY_FADE_SEC = 2;
const TRAJECTORY_SAMPLES = 72;

type PlanetVariant = "rocky" | "gas" | "ice" | "purple" | "mars" | "earth";

type PlanetDef = {
  id: number;
  position: [number, number, number];
  radius: number;
  color: string;
  variant: PlanetVariant;
};

const PLANETS: PlanetDef[] = [
  { id: 0, position: [-4.2, 0.4, -1.5], radius: 0.3, color: "#C4A882", variant: "rocky" },
  { id: 1, position: [3.5, -0.8, -2.8], radius: 0.8, color: "#E8A87C", variant: "gas" },
  { id: 2, position: [-1.8, 2.2, 2.4], radius: 0.4, color: "#88C6E8", variant: "ice" },
  { id: 3, position: [4.1, 1.6, 1.2], radius: 0.5, color: "#9B72CF", variant: "purple" },
  { id: 4, position: [-3.2, -1.4, 1.8], radius: 0.35, color: "#C1440E", variant: "mars" },
  { id: 5, position: [0.2, -0.6, -4.5], radius: 0.45, color: "#4B9CD3", variant: "earth" },
];

type FlightApi = {
  rerouteTo: (planetId: number) => void;
};

const FlightContext = createContext<FlightApi | null>(null);

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function hoverOffset(id: number) {
  return new THREE.Vector3(0, 0.35 + (id % 3) * 0.08, 0);
}

function buildArcTrajectory(from: THREE.Vector3, to: THREE.Vector3) {
  const start = from.clone();
  const end = to.clone();
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const distance = start.distanceTo(end);
  const lift = Math.max(0.45, distance * 0.22);
  const control = mid.clone().add(new THREE.Vector3(0, lift, distance * 0.06));
  return new THREE.QuadraticBezierCurve3(start, control, end);
}

type FlightPathState = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  t: number;
  head: THREE.Vector3;
  fade: number;
  visible: boolean;
};

const ENGINE_TAIL_LOCAL = new THREE.Vector3(0, 0, -0.38);

function EarthPatches({ radius }: { radius: number }) {
  const patches = useMemo(
    () => [
      { pos: [radius * 0.45, radius * 0.25, radius * 0.15] as const, scale: 0.22 },
      { pos: [-radius * 0.35, -radius * 0.2, radius * 0.4] as const, scale: 0.18 },
      { pos: [radius * 0.1, radius * 0.55, -radius * 0.3] as const, scale: 0.15 },
    ],
    [radius],
  );

  return (
    <>
      {patches.map((patch, i) => (
        <mesh key={i} position={patch.pos} scale={patch.scale * radius}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial color="#3d8b5f" roughness={0.85} />
        </mesh>
      ))}
    </>
  );
}

function PlanetNode({ planet }: { planet: PlanetDef }) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const hoverTarget = useRef(1);
  const flight = useContext(FlightContext);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (0.18 + planet.id * 0.03);
    }
    if (groupRef.current) {
      const next = THREE.MathUtils.lerp(
        groupRef.current.scale.x,
        hoverTarget.current,
        1 - Math.pow(0.001, delta),
      );
      groupRef.current.scale.setScalar(next);
    }
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        hoverTarget.current > 1.05 ? 1.4 : 0.45,
        1 - Math.pow(0.001, delta),
      );
    }
  });

  return (
    <group ref={groupRef} position={planet.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          hoverTarget.current = 1.15;
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          hoverTarget.current = 1;
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          flight?.rerouteTo(planet.id);
        }}
      >
        <sphereGeometry args={[planet.radius, 36, 36]} />
        <meshStandardMaterial color={planet.color} roughness={0.72} metalness={0.08} />
      </mesh>

      {planet.variant === "earth" ? <EarthPatches radius={planet.radius} /> : null}

      {planet.variant === "gas" ? (
        <mesh rotation={[Math.PI / 2.4, 0.3, 0.15]}>
          <torusGeometry args={[planet.radius * 1.55, planet.radius * 0.11, 16, 64]} />
          <meshStandardMaterial
            color={planet.color}
            transparent
            opacity={0.55}
            side={THREE.DoubleSide}
            roughness={0.4}
          />
        </mesh>
      ) : null}

      <pointLight
        ref={lightRef}
        color={planet.color}
        intensity={0.45}
        distance={planet.radius * 10}
        decay={2}
      />
    </group>
  );
}

function FlightTrajectory({
  getFlightPath,
}: {
  getFlightPath: () => FlightPathState;
}) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const curveKeyRef = useRef("");
  const curveRef = useRef<THREE.QuadraticBezierCurve3 | null>(null);
  const samplePoints = useMemo(() => new THREE.Vector3(), []);

  const coreMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  const glowMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: ACCENT,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  useFrame(() => {
    const { from, to, t, head, fade, visible } = getFlightPath();
    const core = coreRef.current;
    const glow = glowRef.current;
    if (!core || !glow) return;

    if (!visible || fade <= 0.01 || t <= 0.001) {
      core.visible = false;
      glow.visible = false;
      return;
    }

    const key = `${from.x.toFixed(2)},${from.y.toFixed(2)},${from.z.toFixed(2)}-${to.x.toFixed(2)},${to.y.toFixed(2)},${to.z.toFixed(2)}`;
    if (key !== curveKeyRef.current) {
      curveRef.current = buildArcTrajectory(from, to);
      curveKeyRef.current = key;
    }

    const curve = curveRef.current;
    if (!curve) return;

    const clampedT = THREE.MathUtils.clamp(t, 0.001, 1);
    const sampleCount = Math.max(12, Math.ceil(TRAJECTORY_SAMPLES * clampedT));
    const points: THREE.Vector3[] = [];

    points.push(from.clone());
    for (let i = 1; i <= sampleCount; i++) {
      const u = (i / sampleCount) * clampedT;
      curve.getPoint(u, samplePoints);
      points.push(samplePoints.clone());
    }

    points[points.length - 1] = head.clone();

    if (points.length < 2) return;

    const pathCurve = new THREE.CatmullRomCurve3(points);
    const segments = Math.max(12, points.length * 3);

    core.geometry.dispose();
    glow.geometry.dispose();
    core.geometry = new THREE.TubeGeometry(pathCurve, segments, 0.028, 8, false);
    glow.geometry = new THREE.TubeGeometry(pathCurve, segments, 0.055, 8, false);

    coreMaterial.opacity = 0.92 * fade;
    glowMaterial.opacity = 0.2 * fade;
    core.visible = true;
    glow.visible = true;
  });

  useEffect(() => {
    return () => {
      coreMaterial.dispose();
      glowMaterial.dispose();
    };
  }, [coreMaterial, glowMaterial]);

  return (
    <>
      <mesh ref={glowRef} material={glowMaterial} visible={false} />
      <mesh ref={coreRef} material={coreMaterial} visible={false} />
    </>
  );
}

function Spacecraft({
  planetPositions,
  onReady,
}: {
  planetPositions: THREE.Vector3[];
  onReady: (api: {
    getPosition: () => THREE.Vector3;
    rerouteTo: (id: number) => void;
    getFlightPath: () => FlightPathState;
  }) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const engineLightRef = useRef<THREE.PointLight>(null);

  const state = useRef({
    mode: "hover" as "hover" | "travel" | "fade",
    atPlanet: 0,
    destination: 0,
    from: new THREE.Vector3(),
    to: new THREE.Vector3(),
    progress: 0,
    curveT: 0,
    trailHead: new THREE.Vector3(),
    arc: null as THREE.QuadraticBezierCurve3 | null,
    hoverElapsed: 0,
    fadeElapsed: 0,
  });

  const tailScratch = useMemo(() => new THREE.Vector3(), []);

  const updateTrailHead = useCallback((craft: THREE.Group) => {
    tailScratch.copy(ENGINE_TAIL_LOCAL);
    tailScratch.applyMatrix4(craft.matrixWorld);
    state.current.trailHead.copy(tailScratch);
  }, [tailScratch]);

  const getPosition = useCallback(() => {
    return groupRef.current?.position ?? new THREE.Vector3();
  }, []);

  const getFlightPath = useCallback((): FlightPathState => {
    const s = state.current;
    const fade =
      s.mode === "fade"
        ? Math.max(0, 1 - s.fadeElapsed / TRAJECTORY_FADE_SEC)
        : s.mode === "travel"
          ? 1
          : 0;

    return {
      from: s.from.clone(),
      to: s.to.clone(),
      t: s.mode === "travel" ? s.curveT : 1,
      head: s.trailHead.clone(),
      fade,
      visible: s.mode === "travel" || s.mode === "fade",
    };
  }, []);

  const rerouteTo = useCallback(
    (planetId: number) => {
      const craft = groupRef.current;
      if (!craft || planetId < 0 || planetId >= planetPositions.length) return;

      const s = state.current;
      s.from.copy(craft.position);
      s.to.copy(planetPositions[planetId]).add(hoverOffset(planetId));
      s.destination = planetId;
      s.progress = 0;
      s.curveT = 0;
      s.arc = buildArcTrajectory(s.from, s.to);
      s.mode = "travel";
      s.hoverElapsed = 0;
      s.fadeElapsed = 0;
      craft.updateMatrixWorld();
      updateTrailHead(craft);
    },
    [planetPositions, updateTrailHead],
  );

  useEffect(() => {
    const craft = groupRef.current;
    if (craft && planetPositions.length > 0) {
      craft.position.copy(planetPositions[0]).add(hoverOffset(0));
    }
    onReady({ getPosition, rerouteTo, getFlightPath });
  }, [getFlightPath, getPosition, onReady, planetPositions, rerouteTo]);

  useFrame((_, delta) => {
    const craft = groupRef.current;
    if (!craft || planetPositions.length === 0) return;

    const s = state.current;

    if (s.mode === "hover") {
      s.hoverElapsed += delta;
      craft.position.copy(planetPositions[s.atPlanet]).add(hoverOffset(s.atPlanet));

      if (s.hoverElapsed >= HOVER_SEC) {
        s.destination = (s.atPlanet + 1) % planetPositions.length;
        s.from.copy(craft.position);
        s.to.copy(planetPositions[s.destination]).add(hoverOffset(s.destination));
        s.progress = 0;
        s.curveT = 0;
        s.arc = buildArcTrajectory(s.from, s.to);
        s.mode = "travel";
        craft.updateMatrixWorld();
        updateTrailHead(craft);
      }
    } else if (s.mode === "travel") {
      s.progress += delta / TRAVEL_SEC;
      const t = easeInOutCubic(Math.min(s.progress, 1));
      s.curveT = t;
      const arc = s.arc ?? buildArcTrajectory(s.from, s.to);
      s.arc = arc;
      craft.position.copy(arc.getPoint(t));

      const ahead = arc.getPoint(Math.min(t + 0.04, 1));
      craft.lookAt(ahead);

      const tangent = arc.getTangent(t).normalize();
      craft.rotateZ(-tangent.x * 0.55 - tangent.y * 0.15);

      craft.updateMatrixWorld();
      updateTrailHead(craft);

      if (s.progress >= 1) {
        s.atPlanet = s.destination;
        s.mode = "fade";
        s.fadeElapsed = 0;
        s.hoverElapsed = 0;
        s.curveT = 1;
        updateTrailHead(craft);
      }
    } else {
      s.fadeElapsed += delta;
      craft.position.copy(planetPositions[s.atPlanet]).add(hoverOffset(s.atPlanet));
      craft.updateMatrixWorld();
      updateTrailHead(craft);

      if (s.fadeElapsed >= TRAJECTORY_FADE_SEC) {
        s.mode = "hover";
      }
    }

    if (engineLightRef.current) {
      engineLightRef.current.intensity =
        s.mode === "travel" ? 1.8 + Math.sin(Date.now() * 0.012) * 0.25 : 0.9;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.12]}>
        <cylinderGeometry args={[0.08, 0.1, 0.38, 12]} />
        <meshStandardMaterial color="#F0F2F7" metalness={0.65} roughness={0.25} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.38]}>
        <coneGeometry args={[0.1, 0.22, 12]} />
        <meshStandardMaterial color="#F0F2F7" metalness={0.7} roughness={0.2} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.22]}>
        <cylinderGeometry args={[0.05, 0.07, 0.12, 10]} />
        <meshStandardMaterial color="#c8ccd6" metalness={0.5} roughness={0.35} />
      </mesh>
      <pointLight
        ref={engineLightRef}
        color={ACCENT}
        intensity={0.9}
        distance={2}
        position={[0, 0, -0.35]}
        decay={2}
      />
    </group>
  );
}

function SceneWithFlight() {
  const craftApiRef = useRef<{
    getPosition: () => THREE.Vector3;
    rerouteTo: (id: number) => void;
    getFlightPath: () => FlightPathState;
  } | null>(null);

  const flightApi = useMemo<FlightApi>(
    () => ({
      rerouteTo: (id) => craftApiRef.current?.rerouteTo(id),
    }),
    [],
  );

  const starsRef = useRef<THREE.Group>(null);
  const planetPositions = useMemo(
    () => PLANETS.map((p) => new THREE.Vector3(...p.position)),
    [],
  );

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.015;
      starsRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <FlightContext.Provider value={flightApi}>
      <ambientLight intensity={0.2} color="#ffffff" />
      <directionalLight intensity={1.5} position={[10, 10, 5]} color="#fff8ee" />

      <group ref={starsRef}>
        <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.4} />
      </group>

      {PLANETS.map((planet) => (
        <PlanetNode key={planet.id} planet={planet} />
      ))}

      <Spacecraft
        planetPositions={planetPositions}
        onReady={(api) => {
          craftApiRef.current = api;
        }}
      />

      <FlightTrajectory
        getFlightPath={() =>
          craftApiRef.current?.getFlightPath() ?? {
            from: new THREE.Vector3(),
            to: new THREE.Vector3(),
            t: 0,
            head: new THREE.Vector3(),
            fade: 0,
            visible: false,
          }
        }
      />

      <OrbitControls
        autoRotate
        autoRotateSpeed={0.3}
        enablePan={false}
        minDistance={6}
        maxDistance={28}
        maxPolarAngle={Math.PI * 0.85}
        minPolarAngle={Math.PI * 0.12}
      />
    </FlightContext.Provider>
  );
}

function DprCanvas(props: React.ComponentProps<typeof Canvas>) {
  const dpr =
    typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1;

  return <Canvas {...props} dpr={dpr} />;
}

export function AboutSpaceScene() {
  return (
    <DprCanvas
      className="absolute inset-0 h-full w-full"
      camera={{ position: [0, 5, 15], fov: 60 }}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <Suspense fallback={null}>
        <SceneWithFlight />
      </Suspense>
    </DprCanvas>
  );
}
