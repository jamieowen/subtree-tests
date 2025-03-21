import { mouse } from '@/stores/mouse';
import { damp2, damp3 } from 'maath/easing';

import { useCallback, useMemo } from 'react';
import { Vector2 } from 'three';

import { delta } from '@/webgl/utils/GsapSync';

export const useMouse2 = (out) => {
  const vector = useMemo(() => new Vector2(out, out), []);

  // const _out = useMemo(() => {
  //   if (out != undefined) {
  //     return out;
  //   } else {
  //     return [-1, -1];
  //   }
  // }, []);

  let wasOut = useMemo(() => false, []);

  return useCallback(
    (alpha = 0.1, d = delta.getState().d) => {
      const x = mouse.x;
      const y = mouse.y;

      if (out == undefined && isNaN(mouse.clientX)) {
        vector.set(-1, -1);
        wasOut = true;
      } else if (wasOut) {
        vector.set(x, y);
      } else {
        damp2(vector, [x || out, y || out], alpha, d);
      }

      return vector;
    },
    [out, vector]
  );
};
