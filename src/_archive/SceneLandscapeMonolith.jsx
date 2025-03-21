import { OrthographicCamera } from '@react-three/drei';
import { folder, useControls } from 'leva';
import { urls } from '@/config/assets';
import * as Ease from '@/helpers/Ease';
import { map, randomIntRange } from '@/helpers/MathUtils';
import { hud } from '@/tunnels';
import { Power1, Power2 } from 'gsap';

export const ON_MONOLITH_ENV_DOWN = 'SceneMonolithEnv:OnDown';

const sceneIds = ['winter', 'creatures', 'forest'];
let sceneIdx = randomIntRange(0, 2);
sceneIdx = 2;

export function SceneMonolithEnv({
  prevScene = scenes.find((s) => s.component == 'SceneMonolith2'),
  scene = scenes.find((s) => s.component == 'SceneMonolithEnv'),
  enabled = true,
  idx,
  ...props
}) {
  const { emitter } = useMitt();
  const assets = useAssetManifest('monolithEnv');
  const { scroll } = useScroller();

  useControls(scene.component, {}, { collapsed: true });

  const hover = useControls(scene.component, {
    hover: folder({
      //pos: [0.2, -0.2, 1],
      // rot: [0.05, 0.0666, -0.05],
      rot: [0, 0.001, 0],
      smoothTime: 0.025,
    }),
  });

  const cameraProps = {
    position: [23.569, 3.45, 45.27],
    rotation: [-0.033, 0.453, 0.014],
    fov: 26,
    near: 0.1,
    far: 150,
  };

  const outlineProps = useMemo(() => {
    return {};
  }, []);

  // *****************************************************************
  //
  // SCROLL
  //
  // *****************************************************************
  const refWinter = useRef(null);
  const refCreatures = useRef(null);
  const refForest = useRef(null);

  const refWinterOutline = useRef(null);
  const refCreaturesOutline = useRef(null);
  const refForestOutline = useRef(null);

  useFrame(() => {
    // CAMERA ZOOM
    let cameras = [
      refWinter.current?.refCamera?.current,
      refCreatures.current?.refCamera?.current,
      refForest.current?.refCamera?.current,
    ];

    let pos = (scroll.current.current % totalLength) - scene.offset;

    let p = map(
      pos,
      -(prevScene.transition.end - prevScene.transition.end),
      scene.transition.start - 0.25,
      0,
      1,
      true
    );
    // p = Ease.outExpo(p);
    p = Power2.easeOut(p);

    cameras.forEach((camera, i) => {
      if (!camera) return;
      let pos = cameraProps.position;
      camera.position.x = map(p, 0, 1, pos[0] - 1, pos[0]);
      camera.position.z = map(p, 0, 1, pos[2] - 2, pos[2]);
    });

    // OUTLINE IN
    // let outlines = [
    //   refWinterOutline.current,
    //   refCreaturesOutline.current,
    //   refForestOutline.current,
    // ];

    // let pPrev =
    //   (scroll.current.current % totalLength) - (prevScene?.offset || 0);
    // let pIn = map(
    //   pPrev,
    //   prevScene.transition.start,
    //   prevScene.transition.end,
    //   0,
    //   1,
    //   true
    // );
    // if (pIn > 0 && pIn < 1) {
    //   let thickness = map(pIn, 0.85, 1, 0, 1, true);

    //   outlines.forEach((outline, i) => {
    //     if (!outline) return;
    //     outline.thickness = thickness;
    //   });
    // }

    // OUTLINE OUT
    // let pOut = map(
    //   pos,
    //   scene.transition.start,
    //   scene.transition.end,
    //   0,
    //   1,
    //   true
    // );
    // if (pOut > 0 && pOut < 1) {
    //   let thickness = 1 - map(pOut, 0, 0.15, 0, 1, true);
    //   outlines.forEach((outline, i) => {
    //     if (!outline) return;
    //     outline.thickness = thickness;
    //   });
    // }
  });

  const refTextureWinter = useRef(null);
  const refTextureCreatures = useRef(null);
  const refTextureForest = useRef(null);
  const fboCurr = useRef(null);
  const fboNext = useRef(null);
  const refMat = useRef(null);
  const mixRatio = useRef(0);

  const [curr, setCurr] = useState(sceneIds[sceneIdx]);
  const [next, setNext] = useState(sceneIds[(sceneIdx + 1) % 3]);

  const fsTriangle = useMemo(() => {
    return fullscreenTriangle();
  }, []);

  useEffect(() => {
    fboCurr.current = refTextureWinter.current;
    fboNext.current = refTextureCreatures.current;
  }, []);

  const [isAnimating, setIsAnimating] = useState(false);

  // *****************************************************************
  //
  // CLICK EVENT
  //
  // *****************************************************************
  // useEffect(() => {
  //   const onPointerDown = (evt) => {
  //     console.log('down', enabled, isAnimating.current);
  //     if (isAnimating.current) return;
  //     emitter.emit(ON_MONOLITH_ENV_DOWN, evt);
  //   };

  //   window.addEventListener('pointerdown', onPointerDown);
  //   return () => {
  //     window.removeEventListener('pointerdown', onPointerDown);
  //   };
  // }, [emitter]);
  const onMonolithClick = useCallback(() => {
    if (isAnimating) return;
    emitter.emit(ON_MONOLITH_ENV_DOWN);
  }, []);

  // *****************************************************************
  //
  // CHANGE SCENE
  //
  // *****************************************************************
  const onSceneChangeUpdate = (v) => {
    mixRatio.current = v;
  };
  const onSceneChangeComplete = useCallback(() => {
    switch (next) {
      case 'winter':
        setCurr('winter');
        setNext('creatures');
        break;
      case 'creatures':
        setCurr('creatures');
        setNext('forest');
        break;
      case 'forest':
        setCurr('forest');
        setNext('winter');
        break;
    }
  }, [curr, next]);

  useEffect(() => {
    switch (curr) {
      case 'winter':
        fboCurr.current = refTextureWinter.current;
        break;
      case 'creatures':
        fboCurr.current = refTextureCreatures.current;
        break;
      case 'forest':
        fboCurr.current = refTextureForest.current;
        break;
    }
    switch (next) {
      case 'winter':
        fboNext.current = refTextureWinter.current;
        break;
      case 'creatures':
        fboNext.current = refTextureCreatures.current;
        break;
      case 'forest':
        fboNext.current = refTextureForest.current;
        break;
    }
    mixRatio.current = 0;

    setIsAnimating(false);
  }, [curr, next]);

  useToggleEventAnimation(
    {
      inParams: {
        event: ON_MONOLITH_ENV_DOWN,
        ease: 'power2.inOut',
        duration: 1.5,
        onStart: () => {
          setIsAnimating(true);
        },
        onUpdate: onSceneChangeUpdate,
        onComplete: onSceneChangeComplete,
      },
    },
    [onSceneChangeComplete]
  );

  const maxDpr = scene.renderTargetProps?.maxDpr;

  return (
    <group>
      <mesh geometry={fsTriangle}>
        <MaterialMixRadialPosition
          fboCurr={fboCurr}
          fboNext={fboNext}
          mixRatio={mixRatio}
          range={70}
        />
      </mesh>

      <Subtitles scene={scene} />

      <RenderTextureDeferred
        fboProps={{ count: 3 }}
        ref={refTextureWinter}
        enabled={curr === 'winter' || next == 'winter'}
        maxDpr={
          curr == 'winter' || (next == 'winter' && isAnimating)
            ? maxDpr
            : 0.0001
        }
      >
        <DeferredWorldPos />
        {/* <DeferredLighting /> */}
        <DeferredMenuFilter />
        <DeferredOutline
          ref={refWinterOutline}
          normalThreshold={0}
          thickness={0.5}
          color={'#1a2d5a'}
        />
        <SceneWinterEnv
          ref={refWinter}
          hover={hover}
          scene={scene}
          enabled={curr === 'winter' || next == 'winter'}
          cameraProps={cameraProps}
          onMonolithClick={onMonolithClick}
        />
      </RenderTextureDeferred>

      <RenderTextureDeferred
        fboProps={{ count: 3 }}
        ref={refTextureCreatures}
        enabled={curr === 'creatures' || next == 'creatures'}
        maxDpr={
          curr == 'creatures' || (next == 'creatures' && isAnimating)
            ? maxDpr
            : 0.0001
        }
      >
        <DeferredMenuFilter />
        <DeferredOutline
          ref={refCreaturesOutline}
          normalThreshold={0}
          thickness={0.5}
          // color={'#a54e59'}
        />
        <DeferredWorldPos />
        <SceneCreaturesEnv
          ref={refCreatures}
          hover={hover}
          scene={scene}
          cameraProps={cameraProps}
          enabled={curr === 'creatures' || next == 'creatures'}
          onMonolithClick={onMonolithClick}
        />
      </RenderTextureDeferred>

      <RenderTextureDeferred
        fboProps={{ count: 3 }}
        ref={refTextureForest}
        enabled={curr === 'forest' || next == 'forest'}
        maxDpr={
          curr == 'swamp' || (next == 'swamp' && isAnimating) ? maxDpr : 0.0001
        }
      >
        <DeferredMenuFilter />
        <DeferredOutline
          ref={refForestOutline}
          normalThreshold={0.5}
          thickness={0.5}
          color={'#211a1b'}
        />
        <DeferredWorldPos />

        <SceneForestEnv
          ref={refForest}
          hover={hover}
          scene={scene}
          cameraProps={cameraProps}
          enabled={curr === 'forest' || next == 'forest'}
          onMonolithClick={onMonolithClick}
        />
      </RenderTextureDeferred>
    </group>
  );
}
