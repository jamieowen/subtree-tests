import { urls } from '@/config/assets';
import { ECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const CleaningBottle = (entity) => {
  const refSprite = useRef(null);

  const texture = useAsset(urls.t_cleaning_bottle);

  const aspect = 256 / 1024;

  const s = 1.7;

  return (
    <ECS.Entity entity={entity}>
      <ECS.Component name="three">
        <group
          name="bottle"
          position-y={0.5}
        >
          <Billboard
            lockX={true}
            lockZ={true}
          >
            {/* <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.5, 2]} />
              <meshBasicMaterial
                color="black"
                transparent
                opacity={0.2}
              />
            </mesh> */}

            <mesh scale={[s, -s, s]}>
              <planeGeometry args={[2 * aspect, 2]} />
              <GBufferMaterial>
                <MaterialModuleSpriteAnimated
                  ref={refSprite}
                  map={texture}
                  rows={4096 / 1024}
                  cols={4096 / 256}
                  frames={47}
                  fps={12}
                />
                {/* <MaterialModuleColor
                  color={0xff00ff}
                  blend="*"
                /> */}
                <MaterialModuleAlphaTest />
              </GBufferMaterial>
            </mesh>
          </Billboard>
        </group>
      </ECS.Component>

      <ECS.Component
        name="sprite"
        data={refSprite}
      />
    </ECS.Entity>
  );
};
