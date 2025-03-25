import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const FillingBottle = (entity) => {
  const refSprite = useRef(null);

  const t_bottle = useAsset(urls.t_filling_bottle);
  t_bottle.anisotropy = 16;

  const t_shadow = useAsset(urls.t_filling_shadow);
  t_shadow.anisotropy = 16;

  const aspect = 256 / 1024;
  const s = 1.7;

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
              <GBufferMaterial
                transparent
                alphaToCoverage={true}
              >
                <MaterialModuleSpriteAnimated
                  ref={refSprite}
                  map={t_bottle}
                  rows={4096 / 1024}
                  cols={4096 / 256}
                  frames={47}
                  fps={12}
                />
              </GBufferMaterial>
            </mesh>

            <mesh position-y={-1.6}>
              <planeGeometry args={[2, 1]} />
              <meshBasicMaterial
                map={t_shadow}
                transparent
              />
            </mesh>
          </Billboard>
        </group>
      </FillingECS.Component>

      <FillingECS.Component
        name="sprite"
        data={refSprite}
      />
    </FillingECS.Entity>
  );
};
