import React, { useEffect, useState } from "react";

function Logo2Overlay({ onFinish }) {
  const [opacity, setOpacity] = useState(0);
  const [shineX, setShineX] = useState(-250);
  const [edgeOpacity, setEdgeOpacity] = useState(0);
  const [phase, setPhase] = useState("fadein");

  /* --------------------------
     PHASE 1: FADE IN + WARM EDGE GLOW
  ---------------------------*/
  useEffect(() => {
    let fadeIn = setInterval(() => {
      setOpacity((o) => Math.min(1, o + 0.04));
      setEdgeOpacity((e) => Math.min(0.35, e + 0.015));
    }, 40);

    setTimeout(() => {
      clearInterval(fadeIn);
      setPhase("shine");
    }, 900);

    return () => clearInterval(fadeIn);
  }, []);

  /* --------------------------
     PHASE 2: SHINE SWEEP
  ---------------------------*/
  useEffect(() => {
    if (phase !== "shine") return;

    let shine = setInterval(() => {
      setShineX((x) => x + 8);
    }, 30);

    // ✅ increased from 1200 → 1800 so shine fully travels 400px image
    setTimeout(() => {
      clearInterval(shine);
      setPhase("fadeout");
    }, 1800);

    return () => clearInterval(shine);
  }, [phase]);

  /* --------------------------
     PHASE 3: FADE OUT EVERYTHING
  ---------------------------*/
  useEffect(() => {
    if (phase !== "fadeout") return;

    let fadeAway = setInterval(() => {
      setOpacity((o) => Math.max(0, o - 0.04));
      setEdgeOpacity((e) => Math.max(0, e - 0.03));
    }, 40);

    setTimeout(() => {
      clearInterval(fadeAway);
      onFinish && onFinish();
    }, 1000);

    return () => clearInterval(fadeAway);
  }, [phase]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9999,

    
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ position: "relative", transform: "translateY(-40px)" }}>
        
        {/* WARM EDGE LIGHT */}
        <div
          style={{
            position: "absolute",
            inset: "-12px",
            borderRadius: "10px",
            background: `radial-gradient(circle,
              rgba(255,190,100,${edgeOpacity}),
              rgba(255,130,40,${edgeOpacity * 0.4}),
              rgba(0,0,0,0)
            )`,
            filter: "blur(30px)",
          }}
        />

        {/* LOGO2 */}
        <img
          src="/logo2.png"
          alt="logo2"
          style={{
            width: "600px",
            opacity,
            transition: "opacity 0.15s linear",
            position: "relative",
          }}
        />

        {/* SHINE SWEEP */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: shineX + "px",
            width: "120px",
            height: "100%",
            background:
              "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))",
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export default Logo2Overlay;
