import { useMemo } from 'react';

export const getDistanceForPerfectProjection = ({
  fov = 75,
  height = window.innerHeight,
}) => {
  const vFov = fov * (Math.PI / 180);
  const z = height / (2 * Math.tan(vFov / 2));
  return z;
};

export const useScreenDistance = function (h, fov) {
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);

  const z = useMemo(() => {
    return getDistanceForPerfectProjection({
      fov: fov || camera.fov,
      height: h || size.height,
    });
  }, [size.height, camera.fov, h, fov]);

  return z;
};
