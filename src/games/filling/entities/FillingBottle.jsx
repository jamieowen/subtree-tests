import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { Billboard } from '@react-three/drei';

export const FillingBottle = (entity) => {
  const refSprite = useRef(null);

  const textures = useAsset([
    urls.t_filling_bottle25,
    urls.t_filling_bottle50,
    urls.t_filling_bottle75,
    urls.t_filling_bottle100,
  ]);
  textures.forEach((t) => {
    t.anisotropy = 16;
  });

  const t_shadow = useAsset(urls.t_filling_shadow);
  t_shadow.anisotropy = 16;

  const aspect = 256 / 1024;
  const s = 1.7;

  console.log('FillingBottle.re-render');

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
            <mesh scale={[s, -s, s]}>
              <planeGeometry args={[2 * aspect, 2]} />
              <GBufferMaterial
                transparent
                alphaToCoverage={true}
              >
                <MaterialModuleSpriteAnimated
                  ref={refSprite}
                  map={textures[3]}
                  rows={4096 / 1024}
                  cols={4096 / 256}
                  frames={48}
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
