"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { HypercarModel } from "./HypercarModel";

export function ShowroomCanvas() {
  return (
    <Canvas camera={{ position: [4.4, 2.4, 4.8], fov: 42 }} shadows dpr={[1, 2]}>
      <color attach="background" args={["#050609"]} />
      <ambientLight intensity={0.75} />
      <spotLight position={[2.5, 5, 3]} angle={0.4} penumbra={0.7} intensity={8} castShadow />
      <HypercarModel />
      <ContactShadows position={[0, -0.48, 0]} opacity={0.55} scale={7} blur={2.2} far={2} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={4} maxDistance={8} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05} />
    </Canvas>
  );
}
