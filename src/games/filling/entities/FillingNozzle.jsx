import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { gsap } from 'gsap';
import * as config from '@/config/games/filling';
import AssetService from '@/services/AssetService';
import { randomIntRange } from '@/helpers/MathUtils';

const pouringTargets = FillingECS.world.with('pouring', 'isNozzle');
const cappingTargets = FillingECS.world.with('capping', 'isNozzle');

const fps = 24;

export const FillingNozzle = () => {
  // ***************************************************************************
  //
  // POURING
  //
  // ***************************************************************************
  const t_filling_pour = useAsset(urls.t_filling_pour);

  const refPour = useRef();

  let tweenPour = useRef(null);

  const playSpoutSound = () => {
    let sfx = AssetService.getAsset(`sfx_spout0${randomIntRange(1, 3)}`);
    sfx.loop = true;
    sfx.play();
    return sfx;
  };

  let spoutSfx = useRef(null);

  const pourStart = async () => {
    if (tweenPour.current) tweenPour.current.kill();
    tweenPour.current = gsap.fromTo(
      refPour.current,
      { frame: 0 },
      { frame: 19, duration: 19 / fps, onComplete: pourLoop }
    );

    spoutSfx.current = playSpoutSound();

    await tweenPour.current.then();
  };

  const pourLoop = async () => {
    if (tweenPour.current) tweenPour.current.kill();
    tweenPour.current = gsap.fromTo(
      refPour.current,
      { frame: 20 },
      {
        frame: 38,
        duration: (38 - 20) / fps,
        repeat: -1,
      }
    );
  };

  const pourEnd = async () => {
    const current = refPour.current.frame;
    const target = 48;

    if (tweenPour.current) tweenPour.current.kill();
    tweenPour.current = gsap.to(refPour.current, {
      frame: target,
      duration: 0.3,
    });

    await tweenPour.current.then();

    if (spoutSfx.current) spoutSfx.current.stop();
  };

  const [pouring] = useEntities(pouringTargets);

  useEffect(() => {
    if (pouring) {
      pourStart();
    } else {
      pourEnd();
    }
  }, [pouring]);

  // ***************************************************************************
  //
  // NOZZLE
  //
  // ***************************************************************************
  const t_filling_capping = useAsset(urls.t_filling_capping);

  const refNozzle = useRef();

  let tweenCapping = useRef(null);

  const animateCapping = async () => {
    if (tweenCapping.current) tweenCapping.current.kill();

    let endFrame = 25;

    tweenCapping.current = gsap.timeline();
    tweenCapping.current.fromTo(
      refNozzle.current,
      { frame: 0 },
      { frame: endFrame, duration: endFrame / config.cappingFps, ease: 'none' }
    );
    await tweenCapping.current.then();

    AssetService.getAsset('sfx_bottlecap').play();

    tweenCapping.current.to(refNozzle.current, {
      frame: 47,
      duration: (48 - endFrame) / config.cappingFps,
      ease: 'none',
    });
    await tweenCapping.current.then();
  };

  const [capping] = useEntities(cappingTargets);

  useEffect(() => {
    if (capping) {
      animateCapping();
    }
  }, [capping]);

  const s = 1;

  return (
    <FillingECS.Entity>
      <FillingECS.Component
        name="isNozzle"
        data={true}
      />
      <FillingECS.Component name="three">
        <group position-y={0.95}>
          <mesh
            position-y={0.9}
            scale={[s, -s, s]}
            renderOrder={2}
          >
            <planeGeometry args={[1, 4]} />
            <GBufferMaterial
              transparent
              alphaToCoverage={false}
            >
              <MaterialModuleSpriteAnimated
                ref={refNozzle}
                map={t_filling_capping}
                rows={4}
                cols={16}
                frames={48}
                frame={0}
              />
            </GBufferMaterial>
          </mesh>

          <mesh
            position-y={0}
            scale={[1, -1, 1]}
            renderOrder={-1}
          >
            <planeGeometry args={[1, 4]} />
            <GBufferMaterial
              transparent
              alphaToCoverage={false}
            >
              <MaterialModuleSpriteAnimated
                ref={refPour}
                map={t_filling_pour}
                rows={4}
                cols={16}
                frames={48}
                frame={0}
              />
            </GBufferMaterial>
          </mesh>
        </group>
      </FillingECS.Component>
    </FillingECS.Entity>
  );
};
