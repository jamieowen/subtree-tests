import { OrthographicCamera, RenderTexture } from '@react-three/drei';
import { map } from '@/helpers/MathUtils';
import * as Ease from '@/helpers/Ease';

export const MixTextureLine = forwardRef(function ({ ...props }, ref) {
  const refMesh = useRef(null);
  const refOutput = useRef(null);

  const [enabled, setEnabled] = useState(true);

  useFrame(() => {
    const state = transitionState.getState();

    let active = false;
    if (state?.config?.material?.props?.texture?.name == 'MixTextureLine') {
      active = true;
    }

    active = active && state.mixRatio > 0 && state.mixRatio < 1;

    if (enabled != active) {
      setEnabled(active);
    }
    // if (!active) return;

    // y
    let p = state.mixRatio;
    let y = 2 * -1 * (1 - p);
    refMesh.current.position.y = y;

    // rotate
    refMesh.current.rotation.z = map(
      Ease.outCube(1.0 - Math.abs(p * 2 - 1)),
      0,
      1,
      0,
      degToRad(12)
    );
  });

  useImperativeHandle(
    ref,
    () => {
      return refOutput.current;
    },
    [refOutput]
  );

  const size = useThree((s) => s.size);
  const width = useMemo(() => size.width * 0.5, [size]);
  const height = useMemo(() => size.height * 0.5, [size]);

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
        width={width}
        height={height}
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
