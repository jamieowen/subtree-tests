import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';

export const FillingConveyorBelt = ({ children }) => {
  const refSprite = useRef(null);
  const s = 1.7;

  const aspect = 256 / 512;

  const t_belt = useAsset(urls.t_filling_belt);
  t_belt.anisotropy = 16;

  return (
    <FillingECS.Entity>
      <FillingECS.Component
        name="isBelt"
        data={true}
      />

      <FillingECS.Component
        name="speed"
        data={1.5}
      />
      <FillingECS.Component
        name="belt"
        data={0}
      />
      <FillingECS.Component
        name="locked"
        data={false}
      />
      <FillingECS.Component name="three">
        <group>
          {/* <mesh
            name="belt"
            position={[0, 0, 0]}
            rotation-x={degToRad(-90)}
          >
            <planeGeometry args={[10, 3]} />
            <meshBasicMaterial color="grey" />
          </mesh> */}

          <mesh
            scale={[s, -s, s]}
            position-y={-0.8}
            visible={false}
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
                fps={12}
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

      <FillingECS.Component
        name="sprite"
        data={refSprite}
      />
    </FillingECS.Entity>
  );
};
