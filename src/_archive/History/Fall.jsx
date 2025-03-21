import { HoverControls } from '@/webgl/controls/HoverControls';
import { PerspectiveCamera, Plane } from '@react-three/drei';

import { folder, useControls } from 'leva';
import { map } from '@/helpers/MathUtils';
import { Color, LinearSRGBColorSpace } from 'three';

import { useMitt } from '@/contexts/mitt';
import useAnimation from '@/hooks/useAnimation';
import { urls } from '@/config/assets';
import gsap from 'gsap';
import { RoughEase } from 'gsap/EasePack';
gsap.registerPlugin(RoughEase);

export const ON_FALL_SCENE_PRESS_DOWN = 'SceneFall:OnPressDown';
export const ON_FALL_SCENE_PRESS_UP = 'SceneFall:OnPressUp';

export function Fall({
  scene = scenes.find((s) => s.component == 'SceneFall'),
  enabled,
  ...props
}) {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);
  const { emitter } = useMitt();
  const screenDistance = useScreenDistance();

  const { effectsTunnel } = useContext(EffectsContext);

  const textures = useTexture([
    urls.t_fall_bg,
    urls.t_fall_chara1,
    urls.t_fall_chara2,
  ]);

  // *****************************************************************
  //
  // TAP AND HOLD
  //
  // *****************************************************************
  useEffect(() => {
    const onPointerDown = (evt) => {
      if (!enabled) return;
      emitter.emit(ON_FALL_SCENE_PRESS_DOWN, evt);
    };
    const onPointerUp = (evt) => {
      if (!enabled) return;
      emitter.emit(ON_FALL_SCENE_PRESS_UP, evt);
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [emitter, enabled]);

  // *****************************************************************
  //
  // CAMERA SHAKE
  //
  // *****************************************************************

  const { contextSafe } = useGSAP({ scope: camera });

  let shakeTl = useRef(null);
  const startShake = contextSafe(() => {
    const amount = 0.05;
    const strength = 0.5;
    const points = 20;
    const duration = 0.3;

    let tl = gsap.timeline({ repeat: -1, yoyo: true });
    shakeTl.current = tl;
    tl.add('start');

    // ************************************************************
    //
    // X
    //
    // ************************************************************
    tl.add('x', 'start');
    tl.to(
      camera.rotation,
      {
        x: amount,
        duration,
        ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
      },
      'x'
    );
    tl.to(camera.rotation, {
      x: 0,
      duration,
      ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
    });
    tl.to(camera.rotation, {
      x: -amount,
      duration,
      ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
    });

    // ************************************************************
    //
    // Y
    //
    // ************************************************************
    tl.add('y', 'start');
    tl.to(
      camera.rotation,
      {
        y: amount,
        duration,
        ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
      },
      'y'
    );
    tl.to(camera.rotation, {
      y: 0,
      duration,
      ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
    });
    tl.to(camera.rotation, {
      y: -amount,
      duration,
      ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
    });

    // ************************************************************
    //
    // Z
    //
    // ************************************************************
    tl.add('z', 'start');
    tl.to(
      camera.rotation,
      {
        z: amount,
        duration,
        ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
      },
      'z'
    );
    tl.to(camera.rotation, {
      z: 0,
      duration,
      ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
    });
    tl.to(camera.rotation, {
      z: -amount,
      duration,
      ease: `rough({strength: ${strength}, points: ${points}, template: power1.inOut, taper: both, randomize: true})`,
    });

    return tl;
  });

  const stopShake = () => {
    shakeTl.current.reverse();
  };

  // *****************************************************************
  //
  // FOV
  //
  // *****************************************************************
  const fovMin = 50;
  const fovMax = 90;
  const onFovUpdate = (v) => {
    camera.fov = map(v, 0, 1, fovMin, fovMax);
    camera.updateProjectionMatrix();
  };

  useToggleEventAnimation({
    inParams: {
      event: ON_FALL_SCENE_PRESS_DOWN,
      ease: 'power2.inOut',
      duration: 1,
      onUpdate: onFovUpdate,
      onStart: startShake,
    },
    outParams: {
      event: ON_FALL_SCENE_PRESS_UP,
      ease: 'power2.inOut',
      duration: 2,
      onUpdate: onFovUpdate,
      onStart: stopShake,
    },
  });

  // *****************************************************************
  //
  // CHARA
  //
  // *****************************************************************
  const refCharaMaterial = useRef(null);
  useToggleEventAnimation({
    inParams: {
      event: ON_FALL_SCENE_PRESS_DOWN,
      duration: 0,
      onUpdate: () => {
        refCharaMaterial.current.map = textures[2];
      },
    },
    outParams: {
      event: ON_FALL_SCENE_PRESS_UP,
      duration: 0,
      onUpdate: () => {
        refCharaMaterial.current.map = textures[1];
      },
    },
  });

  // *****************************************************************
  //
  // SEA COLOR
  //
  // *****************************************************************
  const seaColor = useMemo(() => {
    return new Color(scene.props.background)
      .convertLinearToSRGB()
      .getHexString();
  }, [scene.props.background]);

  // *****************************************************************
  //
  // ZOOM BLUR
  //
  // *****************************************************************
  const refZoomBlurEffect = useRef(null);

  const onZoomBlurUpdate = (v) => {
    refZoomBlurEffect.current.uniforms.get('strength').value = map(
      v,
      0,
      1,
      0,
      0.15
    );
  };

  useToggleEventAnimation({
    inParams: {
      event: ON_FALL_SCENE_PRESS_DOWN,
      ease: 'power2.in',
      duration: 2,
      onUpdate: onZoomBlurUpdate,
    },
    outParams: {
      event: ON_FALL_SCENE_PRESS_UP,
      ease: 'power2.out',
      duration: 2,
      onUpdate: onZoomBlurUpdate,
    },
  });

  return (
    <group
      position={[0, 0, -screenDistance]}
      scale={size.height * 0.75}
    >
      <Plane
        args={[2, 1]}
        scale={100}
      >
        <OceanMaterial
          map={textures[0]}
          color={`#${seaColor}`}
        />
      </Plane>

      <Plane args={[2, 1]}>
        <meshBasicMaterial
          map={textures[0]}
          // transparent={true}
          alphaTest={0.5}
        />
      </Plane>

      <SceneFallClouds />

      <SpeedLines speed={1} />

      <group>
        <Plane args={[0.3, 0.3]}>
          <meshBasicMaterial
            ref={refCharaMaterial}
            map={textures[1]}
            // transparent={true}
            alphaTest={0.5}
            depthTest={false}
            depthWrite={false}
          />
        </Plane>
      </group>

      <effectsTunnel.In>
        <ZoomBlurEffect
          ref={refZoomBlurEffect}
          strength={0}
          center={[0.5, 0.5]}
        />
      </effectsTunnel.In>
    </group>
  );
}
