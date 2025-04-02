import { urls } from '@/config/assets';

export const CleaningNozzle = () => {
  const texture = useAsset(urls.t_cleaning_nozzle);
  const s = 0.005;

  return (
    // <mesh position-y={-1}>
    //   <coneGeometry args={[0.3, 1, 32]} />
    //   <meshBasicMaterial color="green" />
    // </mesh>

    <mesh
      scale={[s, -s, s]}
      position-y={-1.2}
    >
      <planeGeometry args={[102, 312]} />
      <meshBasicMaterial
        map={texture}
        transparent
      />
    </mesh>
  );
};
