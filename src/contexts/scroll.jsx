import { createContext, useContext, useEffect } from 'react';
import { useAppStore } from '@/stores/app';

import Lenis from 'lenis';
import { getUrlBoolean, getUrlFloat } from '@/helpers/UrlParam';
import Env from '@/helpers/Env';

export const ScrollContext = createContext();

const maxVelocity = 20; // 10px per sec

export const ScrollProvider = ({ children, start = 0 }) => {
  // SCROLL STATE
  const scroll = useRef({
    current: start,
    isPaused: false,
    velocity: 0,
    direction: 0,
    isAnimating: false,
    isLoop: false,
  });

  const isScrolling = useRef(false);

  // LENIS
  const lenis = useMemo(
    () =>
      new Lenis({
        normalizeWheel: true,
        infinite: true,
        syncTouch: Env.mobile,
      })
  );

  useEffect(() => {
    window.lenis = lenis;
    return () => {
      lenis.destroy();
    };
  }, [lenis]);

  const update = useCallback((time, delta, frame) => {
    lenis.raf(time * 1000);

    if (lenis.isScrolling && !isScrolling.current) {
      isScrolling.current = true;
    } else if (!lenis.isScrolling && isScrolling.current) {
      isScrolling.current = false;
    }

    if (scroll.current.current < 0) {
      scroll.current.current = 0;
    }

    const velocity =
      Math.min(Math.abs(lenis.velocity), maxVelocity) *
      Math.sign(lenis.velocity);

    scroll.current.velocity = velocity;
    scroll.current.direction = lenis.direction;

    if (scroll.current.isPaused) return;

    scroll.current.current += velocity / scrollLengthPx;

    if (scroll.current.current <= 0) {
      scroll.current.current = 0;
    }

    scroll.current.isLoop = scroll.current.current >= totalLength;
  });

  // useFrame();
  useEffect(() => {
    gsap.ticker.add(update);
    return () => {
      gsap.ticker.remove(update);
    };
  }, [update]);

  // METHODS
  const pause = useCallback(() => {
    scroll.current.isPaused = true;
    // lenis.stop();
  }, [lenis]);

  const unpause = useCallback(() => {
    scroll.current.isPaused = false;
    // lenis.start();
  }, [lenis]);

  const scrollTo = useCallback(
    async ({ to = 0, duration = 1, ease, lock = false }) => {
      scroll.current.isAnimating = true;
      if (lock) pause();

      await gsap.to(scroll.current, { current: to, duration, ease }).then();

      scroll.current.isAnimating = false;
      if (lock) unpause();
    },
    [lenis]
  );

  const ctx = useMemo(
    () => ({ scroll, pause, unpause, scrollTo }),
    [scroll, pause, unpause, scrollTo]
  );

  return (
    <ScrollContext.Provider value={ctx}>
      <div
        className="scroll-spacer"
        style={{ height: `${totalLength * scrollLengthPx}px` }}
      />

      {children}
    </ScrollContext.Provider>
  );
};

export const useScroller = () => useContext(ScrollContext);
