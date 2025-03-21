export const Spin = ({ speed = 1, children, ...props }) => {
  const refRoot = useRef();

  useFrame((state, delta) => {
    refRoot.current.rotation.y += delta * speed;
  });

  return (
    <group
      ref={refRoot}
      {...props}
    >
      {children}
    </group>
  );
};
