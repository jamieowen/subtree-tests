import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';

const lockedTargets = FillingECS.world.with('locked');

export const FillingConveyorBelt = ({ children }) => {
  const refBelt = useRef(null);
  const refSprite = useRef(null);
  const s = 1.7;

  const aspect = 256 / 512;

  const t_belt = useAsset(urls.t_filling_belt);
  t_belt.anisotropy = 16;

  const [locked] = useEntities(lockedTargets);

  let fps = 24;
  let frame = useRef(0);

  useFrame((state, delta) => {
    if (!refBelt.current.locked) {
      frame.current += delta * fps * refBelt.current.speed;
      refSprite.current.frame = Math.floor(frame.current) % 47;
    }
  });

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
            <planeGeometry args={[2, 2 * aspect]} />
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
