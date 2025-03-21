export const useFrameFps = (cb, priority, fps) => {
  const lastTime = useRef(null);
  const minDelta = useMemo(() => {
    return 1000 / fps;
  }, [fps]);

  useFrame((state, delta) => {
    if (fps == undefined) {
      cb(state, delta);
      return;
    }

    const now = state.clock.getElapsedTime() * 1000;
    if (lastTime.current === null) {
      lastTime.current = now;
      cb(state, delta);
      return;
    }
    const elapsed = now - lastTime.current;
    // console.log(elapsed, minDelta);
    if (elapsed > minDelta) {
      cb(state, minDelta);
      lastTime.current = now;
    }
  });
};
