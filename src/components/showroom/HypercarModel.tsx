"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

export function HypercarModel() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.22;
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.035;
  });

  return (
    <group ref={groupRef} rotation={[0, -0.3, 0]}>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.7, 0.42, 1.38]} />
        <meshStandardMaterial color="#d9362f" metalness={0.62} roughness={0.28} />
      </mesh>
      <mesh position={[0.22, 0.56, -0.05]} castShadow>
        <boxGeometry args={[1.6, 0.38, 1.02]} />
        <meshStandardMaterial color="#111827" metalness={0.2} roughness={0.16} />
      </mesh>
      <mesh position={[-1.7, 0.2, 0]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.8, 0.22, 1.42]} />
        <meshStandardMaterial color="#bcc4c9" metalness={0.8} roughness={0.22} />
      </mesh>
      <mesh position={[1.72, 0.18, 0]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.58, 0.18, 1.34]} />
        <meshStandardMaterial color="#050609" metalness={0.5} roughness={0.34} />
      </mesh>
      {[-1.12, 1.16].map((x) =>
        [-0.68, 0.68].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, -0.12, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.33, 0.33, 0.22, 48]} />
            <meshStandardMaterial color="#050609" metalness={0.5} roughness={0.38} />
          </mesh>
        )),
      )}
    </group>
  );
}
