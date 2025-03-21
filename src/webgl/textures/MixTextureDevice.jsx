import { OrthographicCamera, RenderTexture } from '@react-three/drei';
import { map } from '@/helpers/MathUtils';
import * as Ease from '@/helpers/Ease';

export const MixTextureDevice = forwardRef(function ({ ...props }, ref) {
  const refMesh = useRef(null);
  const refOutput = useRef(null);

  const [enabled, setEnabled] = useState(true);

  useImperativeHandle(
    ref,
    () => {
      return refOutput.current;
    },
    [refOutput]
  );

  const progress = useRef(0);
  useFrame(() => {
    const state = transitionState.getState();

    let active = false;
    if (state?.config?.material?.props?.texture?.name == 'MixTextureDevice') {
      active = true;
    }

    progress.current = state.mixRatio;
    active = active && progress.current > 0 && progress.current < 1;

    if (enabled != active) {
      setEnabled(active);
    }
  });

  const size = useThree((s) => s.size);
  const width = useMemo(() => size.width * 0.5, [size]);
  const height = useMemo(() => size.height * 0.5, [size]);

  return (
    <>
      <RenderTexture
        frames={enabled ? Infinity : 1}
        renderPriority={100}
        ref={refOutput}
        compute={() => {}}
        attach={null}
        width={width}
        height={height}
      >
        <SceneDevice
          progress={progress}
          isMaskMode={true}
        />
      </RenderTexture>

      {/* <DebugTexture texture={refOutput.current} /> */}
    </>
  );
});
