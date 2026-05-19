import * as THREE from "three";

export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

export const easeInOutSine = (x) =>
  -(Math.cos(Math.PI * x) - 1) / 2;

export function createStarTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  const grd = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  );

  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.15, "rgba(255,255,255,0.95)");
  grd.addColorStop(0.35, "rgba(160,200,255,0.6)");
  grd.addColorStop(1, "rgba(0,0,0,0)");

  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}
