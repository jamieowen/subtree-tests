import { urls } from '@/config/assets';
import { CleaningECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const CleaningBottle = (entity) => {
  const refSprite = useRef(null);

  const texture = useAsset(urls.t_cleaning_bottle);

  texture.anisotropy = 16;

  const aspect = 256 / 1024;

  const s = 1.15;

  const [t_hanger_back, t_hanger_front] = useAsset([
    urls.t_hanger_back,
    urls.t_hanger_front,
  ]);

  useEffect(() => {
    if (entity.precleaned) {
      refSprite.current.progress = 1;
    }
  }, []);

  return (
    <>
      <CleaningECS.Entity entity={entity}>
        <CleaningECS.Component name="three">
          <group name="bottle">
            <mesh
              position-y={1.4}
              renderOrder={-1}
              scale={s}
              scale-y={-s}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                transparent
                map={t_hanger_back}
              />
            </mesh>
            <mesh
              position-y={1.4}
              renderOrder={3}
              scale={s}
              scale-y={-s}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                transparent
                map={t_hanger_front}
              />
            </mesh>

            <group position-y={0.5}>
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
                      map={texture}
                      rows={4096 / 1024}
                      cols={4096 / 256}
                      frames={48}
                      fps={12}
                      blend="pc_fragColor.rgb = blendHardLight(vec3(132. / 255., 183. / 255., 146. / 255.), frameColor.rgb, frameColor.a);"
                    />
                  </GBufferMaterial>
                </mesh>
              </Billboard>
            </group>
          </group>
        </CleaningECS.Component>

        <CleaningECS.Component
          name="sprite"
          data={refSprite}
        />
      </CleaningECS.Entity>
    </>
  );
};
