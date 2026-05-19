import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { easeOutCubic, easeInOutSine, createStarTexture } from "../utils/effects";

function ParticleGlobe({
  count,
  baseRadius,
  gatherDuration,
  holdDuration,
  vanishDuration,
  onGatherComplete,
  onVanishProgress,
  onVanishComplete,
}) {
  const pointsRef = useRef();
  const groupRef = useRef();
  const startRef = useRef(null);
  const gatheredRef = useRef(false);
  const finishedVanishRef = useRef(false);

  const starTex = useMemo(() => createStarTexture(), []);

  const { dirs, startR, finalR, colors, waveSpeed } = useMemo(() => {
    const dirs = new Float32Array(count * 3);
    const startR = new Float32Array(count);
    const finalR = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const ws = new Float32Array(count);

    const palette = ["#ffd97b", "#ffc54d", "#fff3c4", "#ffffff"].map(
      (c) => new THREE.Color(c)
    );

    for (let i = 0; i < count; i++) {
      const z = 2 * Math.random() - 1;
      const phi = Math.acos(z);
      const theta = Math.random() * Math.PI * 2;

      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);

      dirs[i * 3] = x;
      dirs[i * 3 + 1] = y;
      dirs[i * 3 + 2] = z;

      startR[i] = 6 + Math.random() * 14;
      finalR[i] = baseRadius * (0.9 + Math.random() * 0.15);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      ws[i] = 0.5 + Math.random() * 1.4;
    }

    return { dirs, startR, finalR, colors, waveSpeed: ws };
  }, [count, baseRadius]);

  const geometry = useMemo(() => {
  const g = new THREE.BufferGeometry();
  const pos = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    pos[i * 3] = dirs[i * 3] * startR[i];
    pos[i * 3 + 1] = dirs[i * 3 + 1] * startR[i];
    pos[i * 3 + 2] = dirs[i * 3 + 2] * startR[i];
  }

  g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;

// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  useFrame(({ clock }) => {
    if (!pointsRef.current) return;

    if (!startRef.current) startRef.current = clock.getElapsedTime();

    const t = clock.getElapsedTime() - startRef.current;
    const gather = Math.min(1, t / gatherDuration);
    const vanishStart = gatherDuration + holdDuration;
    const inVanish = t >= vanishStart;
    const vanishProgress =
      inVanish ? Math.min(1, (t - vanishStart) / vanishDuration) : 0;

    if (gather >= 1 && !gatheredRef.current) {
      gatheredRef.current = true;
      onGatherComplete();
    }

    const pos = geometry.getAttribute("position").array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const dx = dirs[i3];
      const dy = dirs[i3 + 1];
      const dz = dirs[i3 + 2];

      const wave =
        Math.sin(clock.getElapsedTime() * 2 + i * 0.07) *
        0.12 *
        waveSpeed[i];

      const ge = easeOutCubic(gather);
      let curR = startR[i] * (1 - ge) + finalR[i] * ge + wave;

      if (inVanish) {
        curR =
          finalR[i] * (1 + vanishProgress * 2.2) +
          wave * (1 - vanishProgress);
      }

      pos[i3] = dx * curR;
      pos[i3 + 1] = dy * curR;
      pos[i3 + 2] = dz * curR;
    }

    geometry.attributes.position.needsUpdate = true;

    if (groupRef.current) {
      if (inVanish) {
        groupRef.current.rotation.y =
          Math.PI * 2 * easeInOutSine(vanishProgress);
        groupRef.current.scale.setScalar(1 + vanishProgress * 0.35);
      }
    }

    if (inVanish) onVanishProgress(vanishProgress);
    if (vanishProgress >= 1 && !finishedVanishRef.current) {
      finishedVanishRef.current = true;
      onVanishComplete();
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          vertexColors
          size={0.14}
          sizeAttenuation
          transparent
          opacity={1.2}
          map={starTex}
          alphaTest={0.03}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default ParticleGlobe;
