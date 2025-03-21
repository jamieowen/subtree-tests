import { OrthographicCamera, RenderTexture } from '@react-three/drei';
import { map } from '@/helpers/MathUtils';
import * as Ease from '@/helpers/Ease';

export const MixTextureFrame = forwardRef(function ({ state, ...props }, ref) {
  const refMesh = useRef(null);
  const refOutput = useRef(null);

  const size = useThree((state) => state.size);

  const [enabled, setEnabled] = useState(true);

  useFrame(() => {
    const state = transitionState.getState();

    let active = false;
    if (state?.config?.material?.props?.texture?.name == 'MixTextureFrame') {
      active = true;
    }

    active = active && state.mixRatio > 0 && state.mixRatio < 1;

    if (enabled != active) {
      setEnabled(active);
    }

    let p = state.mixRatio;
    let pScale = map(p, 0, 0.5, 0, 1, true);
    let pY = map(p, 0.5, 1, 0, 1, true);
    pScale = Ease.inOutQuad(pScale);
    pY = Ease.inOutQuad(pY);

    // scale
    let scaleX = map(pScale, 0, 1, 1, 1 - 100 / size.width);
    let scaleY = map(pScale, 0, 1, 1, 1 - 100 / size.height);
    refMesh.current.scale.set(scaleX, scaleY, 1);

    // y
    let y = 2 * 1 * pY;
    refMesh.current.position.y = y;
  }, 50);

  useImperativeHandle(
    ref,
    () => {
      return refOutput.current;
    },
    [refOutput]
  );

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
        <BackgroundColor color="black" />
        <mesh ref={refMesh}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial color="white" />
        </mesh>
      </RenderTexture>
    </>
  );
});
