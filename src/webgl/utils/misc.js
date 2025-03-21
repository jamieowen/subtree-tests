import { BufferAttribute, BufferGeometry, PlaneGeometry } from 'three';

let cache;

export const fullscreenTriangle = () => {
  if (cache) return cache;

  let geometry = new BufferGeometry();

  const vertices = new Float32Array([-1, -1, 3, -1, -1, 3]);
  const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);

  geometry.setAttribute('position', new BufferAttribute(vertices, 2));
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2));

  // HINT: Fixes bounding sphere error because for some reason
  // the latest version of THREE does not like position attributes
  // with a count of 2 (center.z and radius are NaN in this case)
  geometry.boundingSphere = {
    center: new Vector3(1, 1, 0),
    radius: 0,
  };

  // geometry = new PlaneGeometry(2, 2); // Debug: Click events only work when using quad

  cache = geometry;
  return geometry;
};

export const fsTriangle = fullscreenTriangle();

const isFloat = (n) => Number(n) === n && n % 1 !== 0;
export const ensureShaderFloat = (num) => (isFloat(num) ? num : `${num}.0`);
