import { forwardRef, useImperativeHandle, useRef } from 'react';

import Env from '@/helpers/Env';
import { mouse } from '@/stores/mouse';
import { damp, damp3, dampE, exp } from 'maath/easing';
import { useAppStore } from '@/stores/app';
import { clamp, map } from '@/helpers/MathUtils';
import { PinchGesture } from '@use-gesture/vanilla';
import { throttle } from 'lodash';
import gsap from 'gsap';

export const ZoomStepControls = forwardRef(
  (
    {
      children,

      steps = [-1, 0, 1],
      pinchAmount = 0.5,

      ...props
    },
    ref
  ) => {
    const { gl, size } = useThree();
    const refRoot = useRef();
    const zoom = useRef(0);
    const setZoomLevel = useAppStore((state) => state.setZoomLevel);
    const zoomLevel = useAppStore((state) => state.zoomLevel);
    const isAnimating = useRef(false);

    // useEffect(() => {
    //   console.log('zoomLevel', zoomLevel);
    // }, [zoomLevel]);

    const _zoomOut = useCallback(async () => {
      if (isAnimating.current) return;
      if (zoomLevel == steps.length - 1) return;
      setZoomLevel(zoomLevel + 1);

      // let currIdx = steps.indexOf(zoom.current);

      // if (currIdx == steps.length - 1) return;
      // zoom.current = steps[currIdx + 1];
      // setZoomLevel(currIdx + 1);

      // isAnimating.current = true;
      // await gsap
      //   .to(refRoot.current.position, {
      //     z: zoom.current,
      //     duration: 0.8,
      //     ease: 'power1.inOut',
      //   })
      //   .then();

      // isAnimating.current = false;
    }, [zoomLevel, setZoomLevel]);

    const _zoomIn = useCallback(async () => {
      if (isAnimating.current) return;
      if (zoomLevel == 0) return;
      setZoomLevel(zoomLevel - 1);

      // let currIdx = steps.indexOf(zoom.current);
      // if (currIdx == 0) return;
      // zoom.current = steps[currIdx - 1];

      // isAnimating.current = true;
      // await gsap
      //   .to(refRoot.current.position, {
      //     z: zoom.current,
      //     duration: 0.8,
      //     ease: 'power1.inOut',
      //   })
      //   .then();
      // isAnimating.current = false;
    }, [zoomLevel, setZoomLevel]);

    const zoomIn = useMemo(() => throttle(_zoomIn, 0.8), [_zoomIn]);
    const zoomOut = useMemo(() => throttle(_zoomOut, 0.8), [_zoomOut]);

    useEffect(() => {
      if (isAnimating.current) return;
      isAnimating.current = true;
      // console.log(zoomLevel, steps[zoomLevel]);
      gsap.to(refRoot.current.position, {
        z: steps[zoomLevel],
        duration: 0.8,
        ease: 'power1.inOut',
        onComplete: () => {
          isAnimating.current = false;
        },
      });
    }, [zoomLevel]);

    // MOUSE WHEEL
    useEffect(() => {
      const updateScroll = (evt) => {
        if (evt.deltaY > 0) {
          zoomOut();
        } else if (evt.deltaY < 0) {
          zoomIn();
        }
      };
      window.addEventListener('wheel', updateScroll);

      return () => {
        window.removeEventListener('wheel', updateScroll);
      };
    }, [zoomOut, zoomIn]);

    // PINCH GESTURE
    let lastPinchScale = useRef(1);
    useEffect(() => {
      const gesture = new PinchGesture(gl.domElement, (state) => {
        let pinchScale = state.offset[0];
        let diff = pinchScale - lastPinchScale.current;
        if (diff > 0) {
          zoomIn();
        } else if (diff < 0) {
          zoomOut();
        }
        lastPinchScale.current = pinchScale;
      });

      const prevent = (e) => e.preventDefault();
      document.addEventListener('gesturestart', prevent);
      document.addEventListener('gesturechange', prevent);

      return () => {
        gesture.destroy();
        document.removeEventListener('gesturestart', prevent);
        document.removeEventListener('gesturechange', prevent);
      };
    }, [gl, zoomOut, zoomIn]);

    useImperativeHandle(
      ref,
      () => ({
        zoomIn,
        zoomOut,
      }),
      [ref, zoomIn, zoomOut]
    );

    // WRAPPER
    return (
      <group
        ref={refRoot}
        {...props}
      >
        {children}
      </group>
    );
  }
);
