import { urls } from '@/config/assets';

export const CleaningHanger = () => {
  const [t_hanger_railback, t_hanger_railfront] = useAsset([
    urls.t_hanger_railback,
    urls.t_hanger_railfront,
  ]);

  const s = 1.75;

  return (
    <group scale={1}>
      <mesh
        renderOrder={-2}
        position-y={2.45}
        scale={s}
        scale-y={-s}
      >
        <planeGeometry args={[4, 1]} />
        <GBufferMaterial transparent>
          <MaterialModuleMap map={t_hanger_railback} />
        </GBufferMaterial>
      </mesh>
      <mesh
        renderOrder={4}
        position-y={2.5}
        scale={s}
        scale-y={-s}
      >
        <planeGeometry args={[4, 1]} />
        <GBufferMaterial transparent>
          <MaterialModuleMap map={t_hanger_railfront} />
        </GBufferMaterial>
      </mesh>
    </group>
  );
};
