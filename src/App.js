import React, { useState } from "react";
import PerfectIntroAnimation from "./components/PerfectIntroAnimation";
import HeaderLogoWithText from "./components/HeaderLogoWithText";
import { Canvas } from "@react-three/fiber";

function App() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
    
      {!introDone && (
        <PerfectIntroAnimation onFinish={() => setIntroDone(true)} />
      )}

   <header
  style={{
    width: "100%",
    height: 90,
    display: "flex",
    alignItems: "center",
    paddingLeft: 0,
    background: "white",
    position: "relative",
    zIndex: 10,
    opacity: introDone ? 1 : 0,
    transition: "opacity 1s ease-out",
  }}
>
  {/* LEFT SIDE — CANVAS LOGO */}
  <div
    style={{
      width: 130,
      height: 90,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
    }}
  >
    <Canvas camera={{ position: [0, 0, 3.2], fov: 55 }}>
      <ambientLight intensity={1.2} />
      <pointLight position={[1, 1, 3]} intensity={0.4} />

      {introDone && <HeaderLogoWithText />}
    </Canvas>
  </div>


  <img
    src="/logo3.png"
    alt="logo3"
    style={{
      height: 60,
      marginLeft: 10,
    }}
  />
</header>



     
      <div style={{ padding: 40, background: "violet" }}>
        <h1>Welcome to  main website</h1>
      </div>
    </>
  );
}

export default App;
