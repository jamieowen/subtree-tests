import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { Billboard } from '@react-three/drei';

export const FillingBottle = (entity) => {
  const refBottle = useRef(null);

  useFrame(() => {
    if (!entity?.progress) {
      return;
    }
    refBottle.current.progress = entity.progress;
    refBottle.current.filling = entity.filling || false;
  });

  return (
    <FillingECS.Entity entity={entity}>
      <FillingECS.Component name="three">
        <group
          name="bottle"
          position-y={0.5}
        >
          <Billboard
            lockX={true}
            lockZ={true}
          >
            <mesh scale={[1, -1, 1]}>
              <planeGeometry args={[1, 4]} />
              <GBufferMaterial
                transparent
                alphaToCoverage={false}
              >
                <MaterialModuleFillingBottle ref={refBottle} />
              </GBufferMaterial>
            </mesh>
          </Billboard>
        </group>
      </FillingECS.Component>
    </FillingECS.Entity>
  );
};
