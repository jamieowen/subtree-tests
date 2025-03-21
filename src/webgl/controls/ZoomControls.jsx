import { useRef } from 'react';

import Env from '@/helpers/Env';
import { mouse } from '@/stores/mouse';
import { damp, damp3, dampE, exp } from 'maath/easing';
import { useAppStore } from '@/stores/app';
import { clamp, map } from '@/helpers/MathUtils';
import { PinchGesture } from '@use-gesture/vanilla';

export const ZoomControls = ({
  children,
  enabled = { current: true },

  range = [-1, 1],
  multiplier = 1,

  smoothTime = 0.15,
  maxSpeed = Infinity,
  easing = exp,
  eps = 0.001,
  ...props
}) => {
  const { gl, size } = useThree();
  const refRoot = useRef();
  const zoom = useRef(0);

  // MOUSE WHEEL
  useEffect(() => {
    const updateScroll = (evt) => {
      zoom.current += evt.deltaY * multiplier;
      zoom.current = clamp(zoom.current, range[0], range[1]);
    };
    window.addEventListener('wheel', updateScroll);

    return () => {
      window.removeEventListener('wheel', updateScroll);
    };
  });

  // PINCH GESTURE
  useEffect(() => {
    const gesture = new PinchGesture(
      gl.domElement,
      (state) => {
        zoom.current = map(state.offset[0], 0.5, 2, range[1], range[0]);
      },
      {
        scaleBounds: {
          min: 0.5,
          max: 2,
        },
      }
    );

    const prevent = (e) => e.preventDefault();
    document.addEventListener('gesturestart', prevent);
    document.addEventListener('gesturechange', prevent);

    return () => {
      gesture.destroy();
      document.removeEventListener('gesturestart', prevent);
      document.removeEventListener('gesturechange', prevent);
    };
  });

  // DAMP
  useFrame((state, delta) => {
    damp(
      refRoot.current.position,
      'z',
      zoom.current,
      smoothTime,
      delta,
      maxSpeed,
      easing,
      eps
    );
  }, -1);

  // WRAPPER
  return (
    <group
      ref={refRoot}
      {...props}
    >
      {children}
    </group>
  );
};
