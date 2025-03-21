import Env from '@/helpers/Env';

import { useGesture } from '@use-gesture/react';
import {
  damp,
  rsqw,
  exp,
  linear,
  sine,
  cubic,
  quint,
  circ,
  quart,
  expo,
} from 'maath/easing';
import { createContext, useContext } from 'react';
import { gsap } from 'gsap';
import { useAppStore } from '@/stores/app';
import {
  scenes,
  offsetMap,
  totalLength,
} from '@/components/webgl/scenes/config';
import { check } from 'prettier';

export const ScrollContext = createContext();

export const ScrollProvider = ({ children, start = 0 }) => {
  // SCROLL STATE
  const scroll = useRef({
    to: start,
    current: start,
    isPaused: false,
    velocity: 0,
    direction: 0,
  });

  // LIMIT
  const checkLimit = (evt) => {
    const dir = scroll.current.direction;

    const currS = scroll.current.current % totalLength;
    const currSceneIdx = offsetMap.findIndex((o) => o > currS) - 1;
    const currP = currS - offsetMap[currSceneIdx];

    const limits = scenes[currSceneIdx]?.scroll?.limits || [];
    // if (scenes[currSceneIdx]?.scroll?.limits) {
    //   console.log(scenes[currSceneIdx].scroll.limits);
    // }
    const currLimit = limits.find((l) => l >= currP);

    let limited = false;

    if (currLimit && dir == 1) {
      limited = scroll.current.current >= offsetMap[currSceneIdx] + currLimit;
      scroll.current.current = Math.min(
        scroll.current.current,
        offsetMap[currSceneIdx] + currLimit
      );

      scroll.current.to = Math.min(
        scroll.current.to,
        offsetMap[currSceneIdx] + currLimit
      );
    }

    return limited;
  };

  const checkBackwards = (evt) => {
    const dir = scroll.current.direction;

    const currS = scroll.current.current % totalLength;
    const currSceneIdx = offsetMap.findIndex((o) => o > currS) - 1;
    const currP = currS - offsetMap[currSceneIdx];

    // Limits
    let limited = false;
    if (dir == -1) {
      limited = scroll.current.current <= offsetMap[currSceneIdx];
      scroll.current.current = Math.max(
        scroll.current.current,
        offsetMap[currSceneIdx]
      );

      scroll.current.to = Math.max(scroll.current.to, offsetMap[currSceneIdx]);
    }

    return limited;
  };

  // SNAP
  const checkSnap = (evt) => {
    if (useAppStore.getState().showMenu) return;

    const dir = evt.direction[1];

    const currS = scroll.current.current % totalLength;
    const s = scroll.current.to % totalLength;
    const currSceneIdx = offsetMap.findIndex((o) => o > s) - 1;
    const nextSceneIdx = currSceneIdx + 1;
    const transition = scenes[currSceneIdx]?.transition || {};
    const p = s - offsetMap[currSceneIdx];
    const currP = currS - offsetMap[currSceneIdx];

    // Snaps
    const snaps = scenes[currSceneIdx]?.scroll?.snaps || [];
    const currSnap = snaps.find((s) => currP >= s.start && currP <= s.end);

    // Transition to next scene
    if (dir == 1 && p > transition.start && transition.snap != false) {
      scroll.current.to = offsetMap[nextSceneIdx];
      return;
    }

    // Transition back to previous scene
    if (dir == -1 && p > transition.start && p < transition.end) {
      scroll.current.to = offsetMap[currSceneIdx] + transition.start;
      return;
    }

    // Forward direction, snap
    if (currSnap && dir == 1) {
      if (currP < currSnap.to) {
        scroll.current.to = offsetMap[currSceneIdx] + currSnap.to;
      } else {
        scroll.current.to = offsetMap[currSceneIdx] + currSnap.end;
      }
    }

    // Backward direction, snap
    if (currSnap && dir == -1) {
      if (currP > currSnap.to) {
        scroll.current.to = offsetMap[currSceneIdx] + currSnap.to;
      } else {
        scroll.current.to = offsetMap[currSceneIdx] + currSnap.start;
      }
    }
  };

  // GESTURE
  const viewport = useThree((state) => state.viewport);
  useGesture(
    {
      onDrag: ({ delta, velocity, direction }) => {
        if (Env.desktop) return;
        if (useAppStore.getState().showMenu) return;
        if (scroll.current.isPaused) return;
        let amount = (delta[1] / viewport.dpr) * 80;
        let dir = Math.sign(amount);
        amount = Math.min(Math.abs(amount), 0.04); // limit amount
        scroll.current.to -= amount * dir;
        scroll.current.velocity = velocity[1];
        scroll.current.direction = direction[1] * -1;
        if (scroll.current.to < 0) scroll.current.to = 0; // Can't go backwards the first time
        // checkLimit({ direction });
      },
      onWheel: ({ delta, velocity, direction }) => {
        if (useAppStore.getState().showMenu) return;
        if (scroll.current.isPaused) return;
        let amount = (delta[1] / viewport.dpr) * -250;
        let dir = Math.sign(amount);
        amount = Math.min(Math.abs(amount), 0.02); // limit amount
        scroll.current.to -= amount * dir;
        scroll.current.velocity = velocity[1];
        scroll.current.direction = direction[1];
        if (scroll.current.to < 0) scroll.current.to = 0; // Can't go backwards the first time
        // checkLimit({ direction });
      },
      onDragEnd: checkSnap,
      onWheelEnd: checkSnap,
    },
    {
      target: document.body,
    }
  );

  // DAMP
  useFrame((state, delta) => {
    if (scroll.current.isPaused) return;

    if (checkLimit()) return;
    // if (checkBackwards()) return;

    damp(
      scroll.current,
      'current',
      scroll.current.to, // target
      // 0.25, // smoothTime
      0.1, // smoothTime
      delta, // delta
      Infinity, // maxSpeed
      exp, // easing
      0.001 // eps
    );
  });

  // METHODS
  const scrollTo = useCallback(
    (to = 0, duration = 1, ease = 'power2.inOut') => {
      gsap.to(scroll.current, { current: to, to, duration, ease });
    },
    []
  );

  window.scrollTo = scrollTo;

  return (
    <ScrollContext.Provider value={{ scroll, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroller = () => useContext(ScrollContext);
