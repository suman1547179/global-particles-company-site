import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { easeOutCubic } from "../utils/effects";

function LogoAndText({ showLogo, vanishProgress, vanishDuration }) {
  const logoRef = useRef();
  const glowRef = useRef();
  const milestoneRef = useRef();
  const comintRef = useRef();

  const startLogoRef = useRef(null);
  const startTextRef = useRef(null);
  const shineOffset = useRef(0);


  const loader = useMemo(() => new THREE.TextureLoader(), []);
  const logoTex = useMemo(() => loader.load("/logo.png"), [loader]);

  
  const glowTex = useMemo(() => {
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");

    const center = size / 2;
    const radius = size / 2;

    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, "rgba(255,210,120,1)");
    gradient.addColorStop(0.3, "rgba(255,180,80,0.5)");
    gradient.addColorStop(0.55, "rgba(255,150,60,0.15)");
    gradient.addColorStop(1, "rgba(255,120,40,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }, []);

  /* ------------------------------------------------
      INITIAL OPACITY & SCALE (MOUNT EVERYTHING)
  ------------------------------------------------ */
  useEffect(() => {
    logoRef.current.material.opacity = 0;
    glowRef.current.material.opacity = 0;

    comintRef.current.material.opacity = 0;
    milestoneRef.current.material.opacity = 0;

    comintRef.current.scale.set(0.001, 0.001, 1);
    milestoneRef.current.scale.set(0.001, 0.001, 1);
  }, []);

  useEffect(() => {
    if (showLogo) {
      const now = performance.now() / 1000;
      startLogoRef.current = now;
      startTextRef.current = now;
    }
  }, [showLogo]);

  /* ------------------------------------------------
      MAIN ANIMATION LOOP — NO FREEZE
  ------------------------------------------------ */
  useFrame(({ clock }) => {

    if (showLogo && startLogoRef.current != null) {
      const elapsed = clock.getElapsedTime() - startLogoRef.current;
      const p = Math.min(1, elapsed / 2.2);
      const eased = easeOutCubic(p);

      // Logo
      logoRef.current.material.opacity = eased;
      logoRef.current.scale.set(1 + eased * 0.03, 1 + eased * 0.03, 1);

      // Glow
      glowRef.current.material.opacity = eased * 0.6;
      glowRef.current.scale.set(1.3 + eased, 1.3 + eased, 1);

      
    }

    /* ---------------- MILESTONE TEXT ---------------- */
    if (showLogo && milestoneRef.current && startTextRef.current != null) {
      const elapsed = clock.getElapsedTime() - startTextRef.current;

      const fadeIn = Math.min(1, elapsed / 2.5);
      const fadeOutStart = 5;

      const fadeOut =
        elapsed > fadeOutStart
          ? Math.max(0, 1 - (elapsed - fadeOutStart) / 1.1)
          : 1;

      milestoneRef.current.material.opacity = fadeIn * fadeOut;

      const scale = 0.7 + easeOutCubic(fadeIn) * 0.3;
      milestoneRef.current.scale.set(scale, scale, 1);

      const pulse = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.03;
      milestoneRef.current.scale.multiplyScalar(pulse);

      shineOffset.current += 0.012;
      milestoneRef.current.material.color.setHSL(
        0.12 + Math.sin(shineOffset.current) * 0.05,
        0.65,
        0.58
      );
    }

    /* ---------------- VANISH ---------------- */
    if (vanishProgress > 0) {
      const delay = 5;
      const v = vanishProgress * vanishDuration;

      if (v > delay) {
        const remain = vanishDuration - delay;
        const p = Math.min(1, (v - delay) / remain);
        const fade = Math.max(0, 1 - p);

        logoRef.current.material.opacity = fade;
        glowRef.current.material.opacity = fade;
        milestoneRef.current.material.opacity = fade;
        comintRef.current.material.opacity = fade * 0.3;
      }
    }
  });

  return (
    <group>

      {/* Glow */}
      <sprite ref={glowRef} position={[0, 0.28, -0.02]}>
        <spriteMaterial
          map={glowTex}
          transparent
          depthTest={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      {/* COMINT (Always mounted) */}
      <Text
        ref={comintRef}
        position={[0, 0.29, -0.4]}
        fontSize={0.75}
        color="#e6c17a"
        anchorX="center"
        anchorY="middle"
        transparent
      >
      
      </Text>

      {/* LOGO */}
      <mesh ref={logoRef} position={[0, 0.3, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial map={logoTex} transparent depthWrite={false} />
      </mesh>

      {/* MILESTONE TEXT */}
      <Text
        ref={milestoneRef}
        position={[0, -1.20, 0]}
        fontSize={0.35}
        color="gold"
        anchorX="center"
        anchorY="middle"
        transparent
      >
        CELEBRATING MILESTONE
      </Text>

    </group>
  );
}

export default LogoAndText;
