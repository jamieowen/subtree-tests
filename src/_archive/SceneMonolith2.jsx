import { folder, useControls } from 'leva';
import { useRef } from 'react';
import * as Ease from '@/helpers/Ease';
import { map, randomIntRange } from '@/helpers/MathUtils';
import { hud } from '@/tunnels';

const sceneIds = ['winter', 'desert', 'swamp'];
let sceneIdx = randomIntRange(0, 2);
sceneIdx = 0;

export const ON_MONOLITH2_DOWN = 'SceneMonolith2:OnDown';

export function SceneMonolith2({
  prevScene = allScenes.find((s) => s.component == 'SceneFall'),
  scene = scenes.find((s) => s.component == 'SceneMonolith2'),
  enabled,
  idx,
  ...props
}) {
  const { emitter } = useMitt();
  const assets = useAssetManifest('monolith2');
  const { scroll } = useScroller();

  useControls(scene.component, {}, { collapsed: true });

  const hover = useControls(scene.component, {
    hover: folder({
      rot: [0.08, 0.3, 0],
      smoothTime: 0.25,
    }),
  });

  const cameraProps = {
    position: [0, 14.5, 20],
    rotation: [degToRad(-33), 0, 0],
    fov: 22,
    near: 0.1,
    far: 100,
  };

  const clicked = useRef(false);

  // *****************************************************************
  //
  // SCROLL
  //
  // *****************************************************************
  const refWinterOverview = useRef(null);
  const refDesertOverview = useRef(null);
  const refSwampOverview = useRef(null);

  // const refWinterOutline = useRef(null);
  // const refDesertOutline = useRef(null);
  // const refSwampOutline = useRef(null);

  useFrame(() => {
    let cameras = [
      refWinterOverview.current?.refCamera?.current,
      refDesertOverview.current?.refCamera?.current,
      refSwampOverview.current?.refCamera?.current,
    ];

    let pos = (scroll.current.current % totalLength) - scene.offset;
    let p = map(
      pos,
      (prevScene.transition.end - prevScene.transition.start) * -1,
      scene.transition.start,
      0,
      1
    );
    if (p > 0 && p <= 1) {
      p = Ease.inOutQuad(p);
    }

    cameras.forEach((camera, i) => {
      if (!camera) return;
      // camera.rotation.y = Math.PI * 2 * i + Math.PI * 2 * p;
      camera.position.y = map(
        p,
        0,
        1,
        cameraProps.position[1] - 5 * 0.7,
        cameraProps.position[1]
      );
      camera.position.z = map(
        p,
        0,
        1,
        cameraProps.position[2] - 10 * 0.7,
        cameraProps.position[2]
      );
    });
  });

  // *****************************************************************
  //
  // SCENE CHANGING
  //
  // *****************************************************************

  const refTextureWinter = useRef(null);
  const refTextureDesert = useRef(null);
  const refTextureSwamp = useRef(null);

  const fboCurr = useRef(null);
  const fboNext = useRef(null);
  const refMat = useRef(null);
  const mixRatio = useRef(0);

  const [curr, setCurr] = useState(sceneIds[sceneIdx]);
  const [next, setNext] = useState(sceneIds[(sceneIdx + 1) % 3]);

  const fsTriangle = useMemo(() => {
    return fullscreenTriangle();
  }, []);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    fboCurr.current = refTextureWinter.current;
    fboNext.current = refTextureDesert.current;
  }, []);

  // *****************************************************************
  //
  // CLICK EVENT
  //
  // *****************************************************************
  const onMonolithClick = useCallback(() => {
    if (isAnimating) return;
    emitter.emit(ON_MONOLITH2_DOWN);
  }, []);

  // *****************************************************************
  //
  // CHANGE SCENE
  //
  // *****************************************************************
  const onSceneChangeUpdate = (v) => {
    mixRatio.current = v;

    const pivots = [
      refWinterOverview.current?.refPivot.current,
      refDesertOverview.current?.refPivot.current,
      refSwampOverview.current?.refPivot.current,
    ];

    let rotation = map(Ease.inOutQuad(v), 0, 1, 0, Math.PI * 2);
    pivots.forEach((pivot) => {
      if (!pivot) return;
      pivot.rotation.y = rotation;
    });
  };
  const onSceneChangeComplete = useCallback(() => {
    switch (next) {
      case 'winter':
        setCurr('winter');
        setNext('desert');
        break;
      case 'desert':
        setCurr('desert');
        setNext('swamp');
        break;
      case 'swamp':
        setCurr('swamp');
        setNext('winter');
        break;
    }

    // mixRatio.current = 0;
  }, [curr, next]);

  useEffect(() => {
    switch (curr) {
      case 'winter':
        fboCurr.current = refTextureWinter.current;
        break;
      case 'desert':
        fboCurr.current = refTextureDesert.current;
        break;
      case 'swamp':
        fboCurr.current = refTextureSwamp.current;
        break;
    }
    switch (next) {
      case 'winter':
        fboNext.current = refTextureWinter.current;
        break;
      case 'desert':
        fboNext.current = refTextureDesert.current;
        break;
      case 'swamp':
        fboNext.current = refTextureSwamp.current;
        break;
    }
    mixRatio.current = 0;
    setIsAnimating(false);
  }, [curr, next]);

  useToggleEventAnimation(
    {
      inParams: {
        event: ON_MONOLITH2_DOWN,
        ease: 'power2.inOut',
        // duration: 10,
        duration: 1.5,
        onStart: () => {
          setIsAnimating(true);
          clicked.current = true;
          scene.scroll.limits = [];
        },
        onUpdate: onSceneChangeUpdate,
        onComplete: onSceneChangeComplete,
      },
    },
    [onSceneChangeComplete]
  );

  const maxDpr = scene.renderTargetProps?.maxDpr;

  return (
    <>
      <mesh geometry={fsTriangle}>
        <MaterialMixRadialPosition
          fboCurr={fboCurr}
          fboNext={fboNext}
          mixRatio={mixRatio}
          range={20}
        />
      </mesh>

      <hud.In>
        <Heading
          scene={scene}
          position={[0, 40, 0]}
          scale={1}
        />
      </hud.In>
      <Subtitles scene={scene} />

      <RenderTextureDeferred
        fboProps={{ count: 3 }}
        ref={refTextureWinter}
        maxDpr={
          curr == 'winter' || (next == 'winter' && isAnimating)
            ? maxDpr
            : 0.0001
        }
      >
        <DeferredWorldPos />

        {/* <DeferredLighting ambientFactor={1.5} /> */}
        <DeferredMenuFilter />
        <DeferredOutline
          color={'#3d76a9'}
          normalThreshold={0.5}
          outlineThreshold={0.4}
        />
        {/* <DeferredAtmosphere /> */}

        <SceneWinterOverview
          ref={refWinterOverview}
          cameraProps={cameraProps}
          hover={hover}
          onMonolithClick={onMonolithClick}
        />
      </RenderTextureDeferred>

      <RenderTextureDeferred
        fboProps={{ count: 3 }}
        ref={refTextureDesert}
        renderPriority={1}
        maxDpr={
          curr == 'desert' || (next == 'desert' && isAnimating)
            ? maxDpr
            : 0.0001
        }
      >
        <DeferredWorldPos />
        {/* <DeferredSSAO /> */}
        {/* <DeferredLighting /> */}
        <DeferredMenuFilter />
        <DeferredOutline
          // {...outlineProps}
          color={'#4f1e3f'}
        />
        {/* <DeferredAtmosphere /> */}
        <SceneDesertOverview
          ref={refDesertOverview}
          hover={hover}
          cameraProps={cameraProps}
          onMonolithClick={onMonolithClick}
        />
      </RenderTextureDeferred>

      <RenderTextureDeferred
        fboProps={{ count: 3 }}
        ref={refTextureSwamp}
        maxDpr={
          curr == 'swamp' || (next == 'swamp' && isAnimating) ? maxDpr : 0.0001
        }
      >
        <DeferredWorldPos />
        {/* <DeferredSSAO /> */}
        {/* <DeferredLighting /> */}
        <DeferredMenuFilter />
        <DeferredOutline
          // ref={refSwampOutline}
          // {...outlineProps}
          color={'#214943'}
        />
        {/* <DeferredAtmosphere /> */}
        <SceneSwampOverview
          ref={refSwampOverview}
          hover={hover}
          cameraProps={cameraProps}
          onMonolithClick={onMonolithClick}
        />
      </RenderTextureDeferred>
    </>
  );
}
