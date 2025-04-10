import { urls } from '@/config/assets';

export const CleaningNozzle = () => {
  const texture = useAsset(urls.t_cleaning_nozzle);
  const s = 0.0035;

  return (
    <mesh
      scale={[s, -s, s]}
      position-x={0.015}
      position-y={-0.2}
    >
      <planeGeometry args={[102, 312]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.8}
      />
    </mesh>
  );
};
