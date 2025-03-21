export const Float = ({ speed = 1, amplitude = 1, children, ...props }) => {
  const refRoot = useRef();
  useFrame((state, delta) => {
    refRoot.current.position.y =
      Math.sin(state.clock.getElapsedTime() * speed) * amplitude;
  });

  return <group ref={refRoot}>{children}</group>;
};
