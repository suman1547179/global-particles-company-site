import React, { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text, OrbitControls } from "@react-three/drei";

/* -------------------------------- GLOW CANVAS -------------------------------- */
function createGlowCanvas() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d");

  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(0,200,255,1)");
  g.addColorStop(0.4, "rgba(0,200,255,0.3)");
  g.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);

  return c;
}

/* -------------------------------- PARTICLE SPHERE -------------------------------- */
function ParticleSphere({ onFinish }) {
  const points = useRef();
  const count = 4000;
  const radius = 2.5;

  const { positions, colors, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const spd = new Float32Array(count);

    const palette = [
      new THREE.Color("#00ff66"),
      new THREE.Color("#ffa500"),
      new THREE.Color("#00ccff"),
      new THREE.Color("#ff6600"),
      new THREE.Color("#ffffff"),
    ];

    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = radius * (0.6 + Math.random() * 0.4);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;

      spd[i] = 0.2 + Math.random() * 0.8;
    }
    return { positions: pos, colors: col, speeds: spd };
  }, []);

  const speedsRef = useRef(speeds);

  useEffect(() => {
    const t = setTimeout(() => onFinish && onFinish(), 5000);
    return () => clearTimeout(t);
  }, [onFinish]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!points.current) return;

    const arr = points.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 2] += Math.sin(t * 0.5 + i) * 0.002 * speedsRef.current[i];

      if (t > 3) {
        arr[i3] *= 1.0015;
        arr[i3 + 1] *= 1.0015;
        arr[i3 + 2] += 0.01 * speedsRef.current[i];
      }
    }

    points.current.geometry.attributes.position.needsUpdate = true;
    points.current.rotation.y = t * 0.2;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial vertexColors size={0.05} transparent opacity={0.9} />
    </points>
  );
}

/* -------------------------------- LOGO + TEXT -------------------------------- */
function Logo() {
  const textRef = useRef();
  const logoRef = useRef();
  const glowRef = useRef();

  const logoTexture = new THREE.TextureLoader().load("/logo.png");
  const glowTexture = new THREE.CanvasTexture(createGlowCanvas());

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const fade = Math.min(1, t / 2);

    if (logoRef.current) {
      logoRef.current.material.opacity = fade;
      logoRef.current.scale.set(1 + fade * 0.05, 1 + fade * 0.05, 1);
    }

    if (glowRef.current) {
      glowRef.current.material.opacity = fade * 0.9;
      glowRef.current.scale.set(1.5 + fade, 1.5 + fade, 1);
    }

    if (textRef.current) {
      textRef.current.material.opacity = fade;
    }
  });

  return (
    <group>
      <sprite ref={glowRef} position={[0, 0.3, -0.2]}>
        <spriteMaterial map={glowTexture} transparent opacity={0} />
      </sprite>

      <mesh ref={logoRef} position={[0, 0.3, 0]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial
          map={logoTexture}
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>

      <Text
        ref={textRef}
        position={[0, -1.5, 0]}
        fontSize={0.35}
        color="#ffffff"
        transparent
        opacity={0}
      >
      
      </Text>
    </group>
  );
}

/* -------------------------------- INTRO WRAPPER -------------------------------- */
function IntroAnimation() {
  const [fadeOut, setFadeOut] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000015",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 20,
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 1.5s ease-out",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <ParticleSphere onFinish={() => setFadeOut(true)} />
        <Logo />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}

/* -------------------------------- APP -------------------------------- */
export default function App() {
  return (
    <>
      <IntroAnimation />

      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "#000",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "2rem",
          flexDirection: "column",
        }}
      >
        <h1>Welcome to My Website</h1>
      
      </div>
    </>
  );
}
