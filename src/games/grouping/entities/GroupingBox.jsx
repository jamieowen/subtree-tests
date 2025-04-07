import { urls } from '@/config/assets';
import { GroupingECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';
import { useGroupingStore } from '@/stores/grouping';
import { gsap } from 'gsap';
import AssetService from '@/services/AssetService';
import { randomIntRange } from '@/helpers/MathUtils';

export const GroupingBox = () => {
  const texture = useAsset(urls.t_grouping_box);

  const count = useGroupingStore((state) => state.count);

  const refSprite = useRef(null);
  const refMesh = useRef(null);

  useEffect(() => {
    refSprite.current.frame = count % 21;

    let tl = gsap.timeline();
    tl.add('start');
    tl.to(
      refMesh.current.position,
      {
        y: 0.07,
        duration: 0.1,
        ease: 'power2.inOut',
        repeat: 1,
        yoyo: true,
      },
      'start'
    );
    // tl.to(
    //   refMesh.current.scale,
    //   {
    //     x: 1.1,
    //     duration: 0.1,
    //     ease: 'power2.inOut',
    //     repeat: 1,
    //     yoyo: true,
    //   },
    //   'start'
    // );

    AssetService.getAsset(`sfx_cratecatch0${randomIntRange(1, 5)}`).play();
  }, [count]);

  const s = 2.5;

  return (
    <GroupingECS.Entity>
      <GroupingECS.Component
        name="isBox"
        data={true}
      />
      <GroupingECS.Component
        name="position"
        data={[0, -0.5, 0]}
      />
      <GroupingECS.Component name="three">
        {/* <mesh scale={1}>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial
            color={0x00ff00}
            transparent
            opacity={0.5}
          />
        </mesh> */}
        <group scale={[s, -s, s]}>
          <mesh ref={refMesh}>
            <planeGeometry args={[1, 1]} />
            <GBufferMaterial transparent>
              <MaterialModuleSpriteAnimated
                ref={refSprite}
                map={texture}
                rows={2048 / 512}
                cols={4096 / 512}
                frames={21}
                fps={12}
              />
              <MaterialModuleAlphaTest />
            </GBufferMaterial>
          </mesh>
        </group>
      </GroupingECS.Component>
    </GroupingECS.Entity>
  );
};
