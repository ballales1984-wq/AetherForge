"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { HypercarModel } from "./HypercarModel";

export function ShowroomCanvas() {
  return (
    <Canvas camera={{ position: [4.4, 2.4, 4.8], fov: 42 }} shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance", toneMappingExposure: 1.5, toneMapping: "ReinhardToneMapping" }}>
      <color attach="background" args={["#050609"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} castShadow shadow-mapSize={[512, 512]} />
      <spotLight position={[2.5, 5, 3]} angle={0.4} penumbra={0.7} intensity={6} castShadow shadow-mapSize={[512, 512]} />
      <HypercarModel />
      <ContactShadows position={[0, -0.48, 0]} opacity={0.4} scale={6} blur={1.8} far={1.5} />
      <Environment preset="studio" environmentIntensity={0.05} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={8} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  );
}
