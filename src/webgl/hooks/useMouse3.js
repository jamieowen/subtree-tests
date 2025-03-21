import { mouse } from '@/stores/mouse';
import { damp2, damp3 } from 'maath/easing';

import { useCallback, useMemo } from 'react';
import { Vector2 } from 'three';

import { delta } from '@/webgl/utils/GsapSync';

export const useMouse3 = ({ out = [Infinity, Infinity, Infinity] } = {}) => {
  const size = useThree((state) => state.size);
  const camera = useThree((state) => state.camera);

  const vector = useMemo(() => new Vector3(0, 0, 0.5), []);
  const camWorldPos = useMemo(() => new Vector3(), []);

  const mouse3 = useMemo(() => new Vector3(...out), []);
  const damped = useMemo(() => new Vector3().copy(mouse3), []);

  return useCallback(
    (alpha = 0.1, d = delta.getState().d, ...dampArgs) => {
      const down = mouse.isDown ? 1 : 0;

      damp3(damped, mouse3, alpha, d, ...dampArgs);

      // Mouse left window
      if (isNaN(mouse.clientX)) {
        mouse3.set(...out);
        return { mouse3: damped, down };
      }

      // Calc
      const x = (mouse.clientX / size.width) * 2 - 1;
      const y = -(mouse.clientY / size.height) * 2 + 1;

      vector.x = x;
      vector.y = y;

      vector.unproject(camera);

      camera.getWorldPosition(camWorldPos);
      const dir = vector.sub(camWorldPos).normalize();
      const distance = -camWorldPos.z / dir.z;
      const pos = camWorldPos.clone().add(dir.multiplyScalar(distance));

      mouse3.set(pos.x, pos.y, pos.z, down);

      return { mouse3: damped, down };
    },
    [camWorldPos, camera, out, size.height, size.width, vector]
  );
};
