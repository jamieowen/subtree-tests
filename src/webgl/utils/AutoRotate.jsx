export const AutoRotate = ({ x = 0, y = 1, z = 0, children, ...props }) => {
  const refRoot = useRef(null);

  useFrame((state, delta) => {
    refRoot.current.rotation.x += x * delta;
    refRoot.current.rotation.y += y * delta;
    refRoot.current.rotation.z += z * delta;
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
