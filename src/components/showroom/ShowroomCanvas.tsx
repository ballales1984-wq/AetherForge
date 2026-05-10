"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { HypercarModel } from "./HypercarModel";

export function ShowroomCanvas() {
  return (
    <Canvas camera={{ position: [4.4, 2.4, 4.8], fov: 42 }} shadows dpr={[1, 1]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
      <color attach="background" args={["#050609"]} />
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow shadow-mapSize={[128, 128]} />
      <spotLight position={[2.5, 5, 3]} angle={0.3} penumbra={0.5} intensity={2} castShadow shadow-mapSize={[128, 128]} />
      <HypercarModel />
      <ContactShadows position={[0, -0.3, 0]} opacity={0.2} scale={3} blur={1} far={0.5} />
      <Environment preset="studio" environmentIntensity={0.005} />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={6} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2.2} />
    </Canvas>
  );
}
