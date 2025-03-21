export const useObjSpeed = (ref) => {
  const speed = useRef(new Vector3());
  const prevPosition = useRef(null);
  const tempVector = new Vector3(); // Reusable vector for world position

  useFrame(({ clock }, delta) => {
    if (!ref.current) return;

    // Get world position
    const currentPosition = ref.current.getWorldPosition(tempVector).clone();

    if (prevPosition.current) {
      // Calculate velocity vector (change in position over time)
      speed.current
        .copy(currentPosition)
        .sub(prevPosition.current)
        .divideScalar(delta);

      if (speed.current.x == NaN) {
        speed.current.x = 0;
      }

      if (speed.current.y == NaN) {
        speed.current.y = 0;
      }

      if (speed.current.z == NaN) {
        speed.current.z = 0;
      }
    }

    // Store current position for next frame
    prevPosition.current = currentPosition;
  });

  return speed;
};
