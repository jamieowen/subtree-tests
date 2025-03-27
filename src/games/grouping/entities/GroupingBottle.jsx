import { urls } from '@/config/assets';
import { GroupingECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const GroupingBottle = (entity) => {
  const refSprite = useRef(null);

  const t_bottle = useAsset(urls.t_grouping_bottle);

  const aspect = 1080 / 1920;

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
                <planeGeometry args={[aspect * 2, 2]} />
                <meshBasicMaterial
                  transparent
                  map={t_bottle}
                  alphaTest={0.001}
                />
              </mesh>
            </group>
          </Billboard>
        </group>
      </GroupingECS.Component>
    </GroupingECS.Entity>
  );
};
