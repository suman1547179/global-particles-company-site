import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { easeOutCubic } from "../utils/effects";

function CameraController({ gatherDuration }) {
  const { camera } = useThree();
  const startRef = useRef(null);

  useEffect(() => {
    camera.position.set(0, 0, 5.2);
  }, [camera]);

  useFrame(({ clock }) => {
    if (!startRef.current) startRef.current = clock.getElapsedTime();

    const t = clock.getElapsedTime() - startRef.current;
    const g = Math.min(1, t / gatherDuration);

    const targetZ = THREE.MathUtils.lerp(8.5, 7.9, easeOutCubic(g));
    camera.position.z += (targetZ - camera.position.z) * 0.06;
  });

  return null;
}

export default CameraController;
