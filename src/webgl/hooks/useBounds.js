import { Box3 } from 'three';

export const useBounds = (ref) => {
  let size;

  if (ref?.current) {
    let bb = new Box3().setFromObject(ref.current);
    size = bb.getSize(new Vector3());
    size.x = Math.round(size.x);
    size.y = Math.round(size.y);
    size.z = Math.round(size.z);
  }

  return { size };
};
