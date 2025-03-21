import { useRef } from 'react';

import Env from '@/helpers/Env';
import { mouse } from '@/stores/mouse';
import { damp3, dampE, exp } from 'maath/easing';
import { useAppStore } from '@/stores/app';

export const HoverControls = ({
  children,
  enabled = true,
  pos = [0, 0, 0],
  rot = [0, 0, 0],
  positiveYOnly = false,
  smoothTime = 0.15,
  maxSpeed = Infinity,
  easing = exp,
  eps = 0.001,
  multiplier = { current: 1 },
  oneMinus = false,
  ...props
}) => {
  const refRoot = useRef();

  const { gl, size } = useThree();

  // const { clientX, clientY } = useMouse(gl.domElement);

  useFrame((state, delta) => {
    if (Env.mobile) return;

    // const { mouse } = useMouseStore.getState();

    let x = ((mouse.clientX || size.width / 2) / size.width) * 2 - 1;
    let y = ((mouse.clientY || size.height / 2) / size.height) * 2 - 1;
    if (positiveYOnly) {
      y = 1 - (y + 1) * 0.5;
    }

    //if (positiveYOnly) console.log(y);

    let m = multiplier.current;
    if (oneMinus) m = 1 - m;

    // console.log('hover multiplier', m);

    x *= m;
    y *= m;
    if (!enabled || useAppStore.getState().showMenu) {
      x = 0;
      y = 0;
    }

    damp3(
      refRoot.current.position,
      [x * pos[0], y * pos[1], y * pos[2]],
      smoothTime,
      delta,
      maxSpeed,
      easing,
      eps
    );
    dampE(
      refRoot.current.rotation,
      [y * degToRad(rot[0]), x * degToRad(rot[1]), x * degToRad(rot[2])],
      smoothTime,
      delta,
      maxSpeed,
      easing,
      eps
    );
  }, -1);

  return (
    <group
      ref={refRoot}
      // {...props}
    >
      {children}
    </group>
  );
};
