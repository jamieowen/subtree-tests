import { DataTexture, FloatType, RGBAFormat } from 'three';

export const cache = [];
const sizes = [1, 2, 4, 8, 16, 32, 64, 128];
const count = 20;

for (let size of sizes) {
  for (let i = 0; i < count; i++) {
    const data = new Float32Array(size * size * 4);
    let dt = new DataTexture(data, size, size, RGBAFormat, FloatType);
    dt.needsUpdate = true;
    dt.userData = {
      size,
      inUse: false,
    };
    cache.push(dt);
  }
}

export const getDataTexture = (size) => {
  let dt = cache.find((dt) => dt.userData.size == size && !dt.userData.inUse);
  // console.log('getDataTexture', size, dt);
  if (!dt) {
    console.error('cache.getDataTexture size not available', size);
    return null;
  }
  dt.userData.inUse = true;
  return dt;
};

export const initDataTextures = (gl) => {
  for (let dt of cache) {
    gl.initTexture(dt);
  }
};
