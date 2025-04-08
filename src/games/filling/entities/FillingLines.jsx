import { urls } from '@/config/assets';

export const FillingLines = () => {
  const [t_filling_line_vertical] = useAsset([urls.t_filling_line_vertical]);

  return (
    <mesh
      position-y={1.64}
      scale={0.4}
      renderOrder={-1}
    >
      <planeGeometry args={[4 / 128, 1]} />
      <meshBasicMaterial
        color={0x000000}
        transparent
        map={t_filling_line_vertical}
      />
    </mesh>
  );
};
