export const FillingLines = () => {
  return (
    <mesh
      position-y={0.8}
      position-z={0.0001}
    >
      <planeGeometry args={[1, 0.01]} />
      <meshBasicMaterial
        color={0x000000}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
};
