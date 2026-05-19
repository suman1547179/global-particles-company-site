import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import ParticleGlobe from "./ParticleGlobe";
import LogoAndText from "./LogoAndText";
import CameraController from "./CameraController";
import Logo2Overlay from "./Logo2Overlay";

function PerfectIntroAnimation({ onFinish }) {
  const gatherDuration = 3.6;
  const holdDuration = 5;
  const vanishDuration = 1.6;

  const [showLogo, setShowLogo] = useState(false);
  const [vanishProgress, setVanishProgress] = useState(0);
  const [overlayEnded, setOverlayEnded] = useState(false);
  const [runLogo2, setRunLogo2] = useState(false);

  const handleGatherComplete = () => {
    setTimeout(() => setShowLogo(true), 1000);
  };

  return (
    <>
      
      {!overlayEnded && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            transition: "opacity 1.1s ease",
            pointerEvents: "none",
            zIndex: 20,
          }}
        >
          <Canvas
            camera={{ position: [0, 0, 8.5], fov: 58 }}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ scene }) => {
              scene.background = null;
            }}
          >
            <ambientLight intensity={0.9} />
            <pointLight position={[10, 10, 10]} intensity={0.12} />

            <ParticleGlobe
              count={4000}
              baseRadius={3.2}
              gatherDuration={gatherDuration}
              holdDuration={holdDuration}
              vanishDuration={vanishDuration}
              onGatherComplete={handleGatherComplete}
              onVanishProgress={setVanishProgress}
              onVanishComplete={() => {
                setOverlayEnded(true);
                setRunLogo2(true); 
              }}
            />

            <LogoAndText
              showLogo={showLogo}
              vanishProgress={vanishProgress}
              vanishDuration={vanishDuration}
            />

            <CameraController gatherDuration={gatherDuration} />

            <OrbitControls
              enablePan={false}
              enableRotate={false}
              enableZoom={false}
            />
          </Canvas>
        </div>
      )}

      
      {runLogo2 && (
        <Logo2Overlay
          onFinish={() => {
            setRunLogo2(false);
            onFinish && onFinish();
          }}
        />
      )}
    </>
  );
}

export default PerfectIntroAnimation;
