import { urls } from '@/config/assets';
import { damp } from 'maath/easing';
import Env from '@/helpers/Env';
import { Billboard, Sphere, Box } from '@react-three/drei';
import useWatchableEffect from '@/libs/react-ref-watcher/src/useWatchableEffect';

export const CtaClick = forwardRef(
  ({ children, show, onClick, materialProps, ...props }, ref) => {
    const refRoot = useRef(null);
    const refRing = useRef(null);
    const refRingMaterial = useRef(null);
    const refLabel = useRef(null);
    const refLabelMaterial = useRef(null);

    // CLICK
    const _onClick = useCallback(() => {
      if (!show?.getState()) return;
      onClick?.();
    }, [show, onClick]);

    useMeshClick(refRoot, _onClick);

    // HOVER
    const hovering = useMeshHover(refRoot);
    useZCursor(hovering);

    useZSubscribe(hovering, () => {
      const duration = 0.4;
      const ease = 'power2.out';

      const s = hovering.getState() ? 1.5 : 1;
      gsap.to(refRing.current.scale, { x: s, y: s, duration, ease });

      gsap.to(refLabel.current.position, {
        x: hovering.getState() ? 1.4 : 1.2,
        duration,
        ease,
      });
    });

    // SHOW / HIDE
    useZSubscribe(show, () => {
      // gsap.to(refRingMaterial.current, { opacity: show.getState() ? 1 : 0 });
      // gsap.to(refLabelMaterial.current, { opacity: show.getState() ? 1 : 0 });
      refRing.current.visible = show.getState();
      refLabel.current.visible = show.getState();
    });

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
            <torusGeometry args={[0.3, 0.02, 2, 32]} />
            <GBufferMaterial
              ref={refRingMaterial}
              baseMaterial={MeshBasicMaterial}
              {...materialProps}
              // depthWrite={false}
              // depthTest={false}
              // transparent={true}
              // opacity={0}
            >
              <MaterialModuleWorldPos />
            </GBufferMaterial>
          </mesh>

          <Text
            ref={refLabel}
            position={[1.2, 0, 0]}
            font={urls.fontH2}
            text={Env.mobile ? 'TAP' : 'CLICK'}
            letterSpacing={0.2}
            fontSize={0.3}
            textAlign={'left'}
          >
            <GBufferMaterial
              baseMaterial={MeshBasicMaterial}
              ref={refLabelMaterial}
              color={'white'}
              {...materialProps}
              // depthWrite={false}
              // depthTest={false}
              // opacity={0}
            >
              <MaterialModuleWorldPos />
            </GBufferMaterial>
          </Text>

          {children}
        </Billboard>
      </group>
    );
  }
);
