import React, { useState, useEffect, useRef } from "react";
import { Text } from "@react-three/drei";
import { useLoader, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";

function HeaderLogoWithText() {
  const logoTexture = useLoader(TextureLoader, "/logo.png");

  const [phase, setPhase] = useState("logo");
  const [opacity, setOpacity] = useState(0); // start hidden

  const ref = useRef();
  const glowRef = useRef();

  // FADE LOGIC --------------------------------------------------
  useEffect(() => {
    let timer;

    fadeIn(() => {
      timer = setTimeout(() => {
        fadeOut(() => {
          setPhase(phase === "logo" ? "text" : "logo");
        });
      }, 1800);
    });

    return () => clearTimeout(timer);
  }, [phase]);

  function fadeIn(callback) {
    let fade = setInterval(() => {
      setOpacity(o => {
        if (o >= 0.95) {
          clearInterval(fade);
          callback && callback();
          return 1;
        }
        return o + 0.04;
      });
    }, 40);
  }

  function fadeOut(callback) {
    let fade = setInterval(() => {
      setOpacity(o => {
        if (o <= 0.05) {
          clearInterval(fade);
          callback && callback();
          return 0;
        }
        return o - 0.04;
      });
    }, 40);
  }

  // GLOW PULSE ANIMATION ----------------------------------------
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    const scale = 1 + Math.sin(t * 1.2) * 0.12;
    const glowOpacity = 0.16 + Math.sin(t * 1.2) * 0.12;

    if (glowRef.current) {
      glowRef.current.scale.set(scale, scale, scale);
      glowRef.current.material.opacity = Math.max(glowOpacity, 0);
    }
  });

  return (
    <group ref={ref} scale={[2.1, 2.1, 2.1]}>

      {/* GLOW BEHIND LOGO */}
      {phase === "logo" && (
        <mesh ref={glowRef} position={[0, 0, -0.12]}>
          <planeGeometry args={[2.2, 2.2]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {phase === "logo" && (
        <mesh>
          <planeGeometry args={[1.55, 1.55]} />
          <meshBasicMaterial
            map={logoTexture}
            transparent
            opacity={opacity}
          />
        </mesh>
      )}

      
      {phase === "text" && (
        <Text
          color="black"
          fontSize={0.32}
          anchorX="center"
          anchorY="middle"
          position={[0, 0.1, 0]}
          opacity={opacity}
          outlineWidth={0.015}
          outlineColor="black"
        >
          EXCELLENCE
        </Text>
      )}
    </group>
  );
}

export default HeaderLogoWithText;
