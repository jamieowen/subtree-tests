import { urls } from '@/config/assets';
import { FillingECS } from '../state';
import { gsap } from 'gsap';

const pouringTargets = FillingECS.world.with('pouring', 'isNozzle');

export const FillingNozzle = () => {
  const t_filling_nozzle = useAsset(urls.t_filling_nozzle);
  const t_filling_pour = useAsset(urls.t_filling_pour);

  const refSprite = useRef();

  const fps = 24;

  let tween = useRef(null);

  const pourStart = async () => {
    if (tween.current) tween.current.kill();
    tween.current = gsap.fromTo(
      refSprite.current,
      { frame: 0 },
      { frame: 19, duration: 19 / fps, onComplete: pourLoop }
    );

    await tween.current.then();
  };

  const pourLoop = async () => {
    if (tween.current) tween.current.kill();
    tween.current = gsap.fromTo(
      refSprite.current,
      { frame: 20 },
      {
        frame: 38,
        duration: (38 - 20) / fps,
        repeat: -1,
      }
    );
  };

  const pourEnd = async () => {
    const current = refSprite.current.frame;
    const target = 48;

    if (tween.current) tween.current.kill();
    tween.current = gsap.to(refSprite.current, {
      frame: target,
      duration: 0.3,
    });
    await tween.current.then();
  };

  // useEffect(() => {
  //   (async () => {
  //     await pourStart();
  //     await pourLoop();
  //     await pourEnd();
  //   })();
  // }, []);

  const [pouring] = useEntities(pouringTargets);

  useEffect(() => {
    if (pouring) {
      pourStart();
    } else {
      pourEnd();
    }
  }, [pouring]);

  return (
    <FillingECS.Entity>
      <FillingECS.Component
        name="isNozzle"
        data={true}
      />
      <FillingECS.Component name="three">
        <group position-y={1.1}>
          <mesh
            position-y={2}
            position-x={-0.01}
            scale={[2, -2, 2]}
          >
            <planeGeometry args={[0.5, 1, 32]} />
            <meshBasicMaterial
              map={t_filling_nozzle}
              transparent
              alphaTest={0.5}
            />
          </mesh>

          <mesh
            position-y={0}
            scale={[1, -1, 1]}
          >
            <planeGeometry args={[1, 4]} />
            <GBufferMaterial
              transparent
              alphaToCoverage={false}
            >
              <MaterialModuleSpriteAnimated
                ref={refSprite}
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
