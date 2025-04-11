import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';
import AssetService from '@/services/AssetService';

const lockedTargets = FillingECS.world.with('locked');

export const FillingConveyorBelt = ({ playing = false, children }) => {
  const refBelt = useRef(null);
  const refSprite = useRef(null);
  const s = 1.3;

  const aspect = 256 / 512;

  const t_belt = useAsset(urls.t_filling_belt);
  t_belt.anisotropy = 16;

  const [locked] = useEntities(lockedTargets);

  let fps = 48 * 2 * 0.59;
  let frame = useRef(0);

  useFrame((state, delta) => {
    if (!playing) return;
    if (!refBelt.current.locked) {
      frame.current += delta * fps * refBelt.current.speed;
      refSprite.current.frame = Math.floor(frame.current) % 47;
    }
  });

  useEffect(() => {
    if (locked) {
      AssetService.getAsset('sfx_conveyer').stop();
    } else {
      AssetService.getAsset('sfx_conveyer').play();
    }
  }, [locked]);

  return (
    <FillingECS.Entity ref={refBelt}>
      <FillingECS.Component
        name="isBelt"
        data={true}
      />

      <FillingECS.Component
        name="speed"
        data={1}
      />
      <FillingECS.Component
        name="belt"
        data={0}
      />
      {/* <FillingECS.Component
        name="locked"
        data={false}
      /> */}
      <FillingECS.Component name="three">
        <group>
          <mesh
            scale={[s, -s, s]}
            position-y={-0.8}
          >
            <planeGeometry args={[4, 1]} />
            <GBufferMaterial
              transparent
              alphaToCoverage={true}
            >
              <MaterialModuleSpriteAnimated
                ref={refSprite}
                map={t_belt}
                rows={4096 / 256}
                cols={2048 / 512}
                frames={47}
              />
            </GBufferMaterial>
          </mesh>

          <group
            name="bottles"
            position-y={1}
          >
            {children}
          </group>
        </group>
      </FillingECS.Component>
    </FillingECS.Entity>
  );
};
