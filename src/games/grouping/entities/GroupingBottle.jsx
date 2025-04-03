import { urls } from '@/config/assets';
import { GroupingECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const GroupingBottle = (entity) => {
  const refSprite = useRef(null);
  const refAlpha = useRef(null);

  const [
    //
    t_grouping_bottle_c,
    t_grouping_bottle_cc,
  ] = useAsset([
    //
    urls.t_grouping_bottle_c,
    urls.t_grouping_bottle_cc,
  ]);

  const textures = {
    clockwise: t_grouping_bottle_c,
    counterclockwise: t_grouping_bottle_cc,
  };

  useFrame(() => {
    refAlpha.current.alpha = entity.opacity;
    refSprite.current.progress = Math.min(entity.progress, 1);
  });

  return (
    <GroupingECS.Entity entity={entity}>
      <GroupingECS.Component name="three">
        <group name="bottle">
          <Billboard
            lockX={true}
            lockZ={true}
          >
            <group position-y={1}>
              {/* <mesh>
                <planeGeometry args={[aspect * 2, 2]} />
                <meshBasicMaterial
                  color={0x0000ff}
                  transparent
                  opacity={0.5}
                />
              </mesh> */}

              <mesh
                position={[0, 0, 0]}
                scale-y={-1}
                name="bottleSprite"
              >
                <planeGeometry args={[2, 2]} />
                {/* <meshBasicMaterial
                  transparent
                  map={t_bottle}
                  alphaTest={0.001}
                /> */}
                <GBufferMaterial transparent>
                  <MaterialModuleSpriteAnimated
                    ref={refSprite}
                    map={textures[entity.rotationDirection]}
                    rows={4096 / 512}
                    cols={4096 / 512}
                    frames={48}
                    fps={12}
                  />
                  <MaterialModuleAlphaTest />
                  <MaterialModuleAlpha ref={refAlpha} />
                </GBufferMaterial>
              </mesh>
            </group>
          </Billboard>
        </group>
      </GroupingECS.Component>

      <GroupingECS.Component
        name="sprite"
        data={refSprite}
      />
    </GroupingECS.Entity>
  );
};
