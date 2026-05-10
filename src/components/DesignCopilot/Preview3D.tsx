"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import CarModel from "./GeometryEngine";
import type { ParamState } from "./types";

interface Preview3DProps {
  params: ParamState;
  bodyColor?: string;
}

export function Preview3D({ params, bodyColor = "#06b6d4" }: Preview3DProps) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
      <Canvas
        camera={{ position: [5, 2.5, 5], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050609"]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <spotLight position={[2.5, 5, 3]} angle={0.4} penumbra={0.7} intensity={8} castShadow shadow-mapSize={[1024, 1024]} />
        <CarModel params={params} bodyColor={bodyColor} />
        <ContactShadows position={[0, -0.5, 0]} opacity={0.6} scale={10} blur={2.5} far={3} />
        <Environment preset="studio" environmentIntensity={0.15} />
        <OrbitControls enablePan={false} minDistance={4} maxDistance={10} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white/60 backdrop-blur-sm">
        Real-time preview
      </div>
    </div>
  );
}
