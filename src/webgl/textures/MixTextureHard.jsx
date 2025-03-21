import { OrthographicCamera, RenderTexture } from '@react-three/drei';
import { map } from '@/helpers/MathUtils';
import * as Ease from '@/helpers/Ease';

export const MixTextureHard = forwardRef(function ({ ...props }, ref) {
  const refMesh = useRef(null);
  const refOutput = useRef(null);

  const [enabled, setEnabled] = useState(true);

  useFrame(() => {
    const state = transitionState.getState();

    let active = false;
    if (state?.config?.material?.props?.texture?.name == 'MixTextureHard') {
      active = true;
    }
    if (enabled != active) {
      setEnabled(active);
    }
    // if (!active) return;

    // y
    let p = state.mixRatio;
    let y =
      state.mixRatio > (state.config.material.props?.threshold || 0.5) ? 0 : 2;
    refMesh.current.position.y = y;
  });

  useImperativeHandle(
    ref,
    () => {
      return refOutput.current;
    },
    [refOutput]
  );

  const size = useThree((s) => s.size);

  return (
    <>
      {/* Only attach if enabled */}
      {/* {refOutput.current && (
        <primitive
          ref={ref}
          object={refOutput.current}
          {...props}
        />
      )} */}

      <RenderTexture
        frames={enabled ? Infinity : 1}
        renderPriority={100}
        ref={refOutput}
        compute={() => {}}
        attach={null}
        width={size * 0.1}
        height={size * 0.1}
        samples={0}
        depthBuffer={false}
      >
        <FsTriangleCamera />
        <BackgroundColor color="white" />
        <mesh ref={refMesh}>
          <planeGeometry args={[4, 2]} />
          <meshBasicMaterial color="black" />
        </mesh>
      </RenderTexture>
    </>
  );
});
