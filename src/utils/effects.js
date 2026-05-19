import * as THREE from "three";

export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

export const easeInOutSine = (x) =>
  -(Math.cos(Math.PI * x) - 1) / 2;

export function createStarTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;

  const ctx = canvas.getContext("2d");

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.2, "rgba(255,255,255,0.8)");
  grad.addColorStop(0.4, "rgba(255,210,100,0.45)");
  grad.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);


  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;

  return tex;
}
