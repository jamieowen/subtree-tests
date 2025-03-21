import { urls } from '@/config/assets';
import { damp } from 'maath/easing';
import { Billboard } from '@react-three/drei';

export const CtaTapHold = forwardRef(
  (
    {
      show,
      time,
      onPointerUp,
      onPointerDown,
      onComplete,
      target,
      children,
      ...props
    },
    ref
  ) => {
    const refRoot = useRef(null);
    const refRing = useRef(null);
    const refRingMaterial = useRef(null);
    const refLabel = useRef(null);
    const refLabelMaterial = useRef(null);

    // HOLD
    const { isHolding, progress, triggered } = useMeshHold(target || refRoot, {
      enabled: show,
      time,
      onPointerDown,
      onPointerUp,
      onComplete: () => {
        onComplete?.();
      },
    });

    // HIDE LABEL ON HOLD
    // useZSubscribe(isHolding, () => {
    //   gsap.to(refRingMaterial.current, {
    //     opacity: isHolding.getState() ? 1 : 0,
    //   });
    //   gsap.to(refLabelMaterial.current, {
    //     opacity: isHolding.getState() ? 1 : 0,
    //   });
    // });

    useFrame(() => {
      if (isHolding.getState()) {
        refRing.current.rotation.z = degToRad(90);
      } else {
        refRing.current.rotation.z += delta * degToRad(180);
      }
    });

    // HOVER
    const hovering = useMeshHover(target || refRoot);
    useZCursor(hovering);

    // SHOW / HIDE
    const update = useCallback(() => {
      // gsap.to(refRingMaterial.current, { opacity: show.getState() ? 1 : 0 });
      // gsap.to(refLabelMaterial.current, {
      //   opacity: show.getState() && !isHolding.getState() ? 1 : 0,
      // });
      refRing.current.visible = show.getState();
      refLabel.current.visible = show.getState();
    }, [refRingMaterial, refLabelMaterial, show, isHolding]);

    useZSubscribe(show, update);
    useZSubscribe(isHolding, update);
    useEffect(() => {
      update();
    }, []);

    // useFrame(() => {
    //   console.log(show.getState());
    // });

    return (
      <group
        ref={mergeRefs([ref, refRoot])}
        {...props}
      >
        <Billboard>
          <mesh
            ref={refRing}
            rotation-y={degToRad(180)}
          >
            <torusGeometry args={[0.5, 0.04, 2, 32]} />
            <GBufferMaterial
              ref={refRingMaterial}
              baseMaterial={MeshBasicMaterial}
              alphaTest={0.5}
              color={'white'}
            >
              <MaterialModuleWorldPos />

              <MaterialModuleTapHoldRing
                isHolding={isHolding}
                progress={progress}
              />
            </GBufferMaterial>
          </mesh>

          <Text
            ref={refLabel}
            position={[1.2, 0, 0]}
            font={urls.fontH2}
            text={'TAP\nHOLD'}
            letterSpacing={0.2}
            fontSize={0.35}
            textAlign={'left'}
          >
            <GBufferMaterial
              ref={refLabelMaterial}
              baseMaterial={MeshBasicMaterial}
              color={'white'}
            >
              <MaterialModuleWorldPos />
            </GBufferMaterial>
          </Text>
        </Billboard>

        {children}
      </group>
    );
  }
);

export const MaterialModuleTapHoldRing = ({
  isHolding,
  progress,
  ...props
}) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleTapHoldRing',
    uniforms: {
      uTapHold_Down: { value: 0 },
      uTapHold_Progress: { value: 0 },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        #define TAP_HOLD_DOWN false;

        uniform float uTapHold_Down;
        uniform float uTapHold_Progress;
      `,
      main: /*glsl*/ `


        // THICKNESS
        float thickness = uTapHold_Down * 0.7 + 0.3;
        if (abs(vUv.y * 2. - 1.) > thickness) discard;

        // HOLDING
        if (uTapHold_Down == 1.0) {
          if (vUv.x > uTapHold_Progress) {
            discard;
          }
        } 
        else {
          // LOOP
          float limit = fract(uTime * 0.1);
          if (limit < 0.5){ 
            if (vUv.x > limit * 2.) discard;
          } else {
            if (vUv.x < limit * 2. - 1.) discard;
          }
        }
        
        

      `,
    },
  });

  // UPDATE UNIFORMS
  useFrame(({ clock, delta }) => {
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uTapHold_Down.value = isHolding.getState() ? 1 : 0;
    material.uniforms.uTapHold_Progress.value = progress.current;
  });

  return <></>;
};
