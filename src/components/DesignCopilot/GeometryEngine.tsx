"use client";

import { useMemo, useRef, useEffect } from "react";
import { BoxGeometry, CylinderGeometry, Mesh, MeshStandardMaterial, Group as ThreeGroup, type Group } from "three";

export interface CarParams {
  length: number;
  height: number;
  wheelbase: number;
  trackWidth: number;
  wheelDiameter: number;
  bodyWidth?: number;
}

interface CarModelProps {
  params: CarParams;
  bodyColor?: string;
  wireframe?: boolean;
  rimColor?: string;
}

const createWheel = (position: [number, number, number], diameter: number, rimColor: string = "#c0c0c0"): Group => {
  const wheelGroup = new ThreeGroup();
  const radius = diameter / 2;
  const tireWidth = radius * 0.25;

  const tire = new Mesh(
    new CylinderGeometry(radius, radius, tireWidth, 24),
    new MeshStandardMaterial({ color: "#111111", roughness: 0.8, metalness: 0.2 })
  );
  tire.rotation.x = Math.PI / 2;
  tire.castShadow = true;
  wheelGroup.add(tire);

  const rimRadius = radius * 0.6;
  const rim = new Mesh(
    new CylinderGeometry(rimRadius, rimRadius, tireWidth * 1.1, 16),
    new MeshStandardMaterial({ color: rimColor, roughness: 0.3, metalness: 0.8 })
  );
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = true;
  wheelGroup.add(rim);

  wheelGroup.position.set(position[0], position[1], position[2]);
  return wheelGroup;
};

const generateCarMesh = (params: CarParams, bodyColor: string, rimColor: string): Group => {
  const { length, height, wheelbase, trackWidth, wheelDiameter, bodyWidth = trackWidth * 1.1 } = params;
  const carGroup = new ThreeGroup();
  const wheelRadius = wheelDiameter / 2;
  const isTruck = length > 5;

  const bodyHeight = height * 0.6;
  const cabinHeight = height * 0.4;
  const bodyWidthVal = bodyWidth;

  if (isTruck) {
    const segmentCount = 3;
    const segmentLength = length / segmentCount;
    for (let i = 0; i < segmentCount; i++) {
      const px = -length / 2 + segmentLength / 2 + i * segmentLength;
      const segment = new Mesh(
        new BoxGeometry(segmentLength * 0.9, bodyHeight * 0.9, bodyWidthVal * 0.9),
        new MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.6 })
      );
      segment.position.set(px, bodyHeight / 2, 0);
      segment.castShadow = true;
      segment.receiveShadow = true;
      carGroup.add(segment);
    }
  } else {
    const body = new Mesh(
      new BoxGeometry(length * 0.95, bodyHeight, bodyWidthVal * 0.95),
      new MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.6 })
    );
    body.position.set(0, bodyHeight / 2, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    carGroup.add(body);
  }

  const cabinLength = length * 0.4;
  const cabinX = -length / 2 + wheelbase - cabinLength / 2;
  const cabin = new Mesh(
    new BoxGeometry(cabinLength, cabinHeight, bodyWidthVal * 0.7),
    new MeshStandardMaterial({ color: bodyColor, roughness: 0.4, metalness: 0.5 })
  );
  cabin.position.set(cabinX, bodyHeight + cabinHeight / 2, 0);
  cabin.castShadow = true;
  cabin.receiveShadow = true;
  carGroup.add(cabin);

  const wheelPositions: [number, number, number][] = [
    [-wheelbase / 2, wheelRadius, trackWidth / 2],
    [-wheelbase / 2, wheelRadius, -trackWidth / 2],
    [wheelbase / 2, wheelRadius, trackWidth / 2],
    [wheelbase / 2, wheelRadius, -trackWidth / 2],
  ];

  wheelPositions.forEach((pos) => {
    const wheel = createWheel(pos, wheelDiameter, rimColor);
    carGroup.add(wheel);
  });

  return carGroup;
};

export function CarModel({ params, bodyColor = "#00ffff", wireframe = false, rimColor = "#c0c0c0" }: CarModelProps) {
  const prevMeshRef = useRef<Group | null>(null);

  const mesh = useMemo(() => {
    if (prevMeshRef.current) {
      prevMeshRef.current.traverse((child) => {
        if (child instanceof Mesh) {
          child.geometry.dispose();
          const material = child.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });
    }
    prevMeshRef.current = generateCarMesh(params, bodyColor, rimColor);
    return prevMeshRef.current;
  }, [params, bodyColor, rimColor]);

  useEffect(() => {
    mesh.traverse((child) => {
      if (child instanceof Mesh) {
        child.material.wireframe = wireframe;
      }
    });
  }, [mesh]);

  return <primitive object={mesh} />;
}

export { generateCarMesh, createWheel };
export default CarModel;