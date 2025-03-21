import { createPortal } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Noise, Selection } from '@react-three/postprocessing';
import { Scene } from 'three';
import tunnel from 'tunnel-rat';
import { EffectsContext } from './EffectsContext';

export const RenderTexturePostprocessing = forwardRef(
  (
    {
      children,
      enabled = true,
      renderPriority = 1,
      renderOn,
      frameNum = { current: 0 },
      postprocessing = {},
      idx,
      // isTransitioning = false,
      ...props
    },
    ref
  ) => {
    const [vScene] = useState(() => new Scene());

    const refComposer = useRef();

    useImperativeHandle(
      ref,
      () => ({
        fbo: refComposer.current.outputBuffer,
        texture: refComposer.current.outputBuffer.texture,
        idx,
      }),
      [refComposer]
    );

    return (
      <>
        {refComposer.current?.outputBuffer?.texture && (
          <primitive
            object={refComposer.current.outputBuffer.texture}
            attach="map"
            {...props}
          />
        )}

        {createPortal(
          <Container
            ref={refComposer}
            enabled={enabled}
            renderPriority={renderPriority}
            renderOn={renderOn}
            frameNum={frameNum}
            {...postprocessing}
          >
            {children}
            <group onPointerOver={() => null} />
          </Container>,
          vScene
        )}
      </>
    );
  }
);

const Container = forwardRef(
  (
    { enabled, renderPriority, renderOn, frameNum, children, ...props },
    ref
  ) => {
    const { camera, scene } = useThree();
    let count = useMemo(() => 0, []);

    useEffect(() => {
      if (!ref.current) return;
      ref.current.autoRenderToScreen = false;
    });

    const effectsTunnel = useMemo(() => tunnel(), []);

    useFrame(() => {
      if (
        renderOn.current !== undefined &&
        frameNum.current % 2 !== renderOn.current
      ) {
        // console.log('skip frame', frameNum.current, renderOn.current);
        return;
      }
      if (!enabled) return;
      ref.current.render();
      count++;
    }, renderPriority);

    return (
      <Selection>
        <EffectComposer
          ref={ref}
          camera={camera}
          scene={scene}
          enabled={false}
          renderPriority={renderPriority}
          depthBuffer={true}
          stencilBuffer={true}
          multisampling={0}
          // enableNormalPass={true}
          {...props}
        >
          <effectsTunnel.Out />
        </EffectComposer>

        <EffectsContext.Provider value={{ effectsTunnel }}>
          {children}
          {/* <Preload all /> */}
        </EffectsContext.Provider>
      </Selection>
    );
  }
);
