import { createPortal, extend } from '@react-three/fiber';

// import { Effects } from '../Effects';

import { Scene } from 'three';
import { RenderPass } from 'three-stdlib';
import tunnel from 'tunnel-rat';
import { urls } from '@/config/assets';
import BlurPass from '../../postprocessing/merge-fluid/BlurPass';
import MergeFluidPass from '../../postprocessing/merge-fluid/MergeFluidPass';
import { EffectsContext } from './EffectsContext';
import { useTexture } from '@react-three/drei';
// import { Effects } from '../Effects';

export const RenderTextureEffects = forwardRef(
  (
    {
      children,
      enabled = true,
      renderPriority = 1,
      effects = {},
      // isTransitioning = false,
      idx,
      ...props
    },
    ref
  ) => {
    const [vScene] = useState(() => new Scene());

    const refComposer = useRef();

    useImperativeHandle(
      ref,
      () => ({
        fbo: refComposer.current.renderTarget2,
        texture: refComposer.current.renderTarget2.texture,
        idx,
      }),
      [refComposer]
    );

    return (
      <>
        {/* {refComposer.current?.readBuffer?.texture && (
          <primitive
            object={refComposer.current.readBuffer.texture}
            {...props}
          />
        )} */}
        {refComposer.current?.renderTarget2?.texture && (
          <primitive
            object={refComposer.current.renderTarget2.texture}
            {...props}
          />
        )}

        {createPortal(
          <>
            <Container
              ref={refComposer}
              renderPriority={renderPriority}
              enabled={enabled}
              {...effects}
              {...props}
            >
              {children}
            </Container>
          </>,
          vScene
        )}
      </>
    );
  }
);

extend({ BlurPass, MergeFluidPass });

const Container = forwardRef(
  ({ enabled, renderPriority, renderOn, children, scene, ...props }, ref) => {
    let count = useMemo(() => 0, []);

    useEffect(() => {
      if (!ref.current) return;
      ref.current.renderToScreen = false;
    }, [ref, enabled]);

    const effectsTunnel = useMemo(() => tunnel(), []);

    useFrame((state, delta) => {
      count++;
      if (renderOn?.current !== undefined && count % 2 !== renderOn?.current)
        return;
      if (!enabled) return;

      ref.current.render();
      // console.log(ref.current.passes[2].material.uniforms.uTime.value);
      ref.current.passes[2].material.uniforms.uTime.value =
        state.clock.getElapsedTime();
    }, renderPriority - 1);

    const size = useThree((s) => s.size);
    const viewport = useThree((s) => s.viewport);
    const camera = useThree((s) => s.camera);

    const tNoise = useTexture(urls.t_noise);
    tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

    return (
      <>
        <Effects
          ref={ref}
          multisamping={0}
          renderIndex={renderPriority}
          disableRender={!enabled}
          {...props}
        >
          <blurPass
            args={[
              {
                camera,
                width: size.width * viewport.dpr,
                height: size.height * viewport.dpr,
                tNoise,
              },
            ]}
          />
          <mergeFluidPass
            args={[
              {
                camera,
                width: size.width * viewport.dpr,
                height: size.height * viewport.dpr,
              },
            ]}
          />

          <effectsTunnel.Out />
        </Effects>

        <EffectsContext.Provider value={{ effectsTunnel }}>
          {children}
          {/* <Preload all /> */}
        </EffectsContext.Provider>
      </>
    );
  }
);
