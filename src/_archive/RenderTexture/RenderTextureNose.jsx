import { Scene, DepthTexture } from 'three';
import { extend, createPortal } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';

import tunnel from 'tunnel-rat';
import { EffectsContext } from './EffectsContext';

import { ShaderPass } from '@/webgl/effects/ShaderPass';
import { GlitchPass } from '@/webgl/effects/GlitchPass';
import { FilmPass } from '@/webgl/effects/FilmPass';
import { OutputPass } from '@/webgl/effects/OutputPass';
import { NosePass } from '@/webgl/effects/NosePass';
import { CopyShader } from '@/webgl/effects/CopyShader';
extend({ NosePass, ShaderPass, FilmPass, OutputPass, GlitchPass });

export const RenderTextureNose = forwardRef(
  (
    {
      children,
      enabled = true,
      renderPriority = 1,
      idx,
      // isTransitioning = false,
    },
    ref
  ) => {
    const [vScene] = useState(() => new Scene());

    const refComposer = useRef();

    useImperativeHandle(
      ref,
      () => {
        // console.log(refComposer.current.composer);
        return {
          fbo: refComposer.current.composer.readBuffer,
          texture: refComposer.current.composer.readBuffer?.texture,
          idx,
        };
      },
      [refComposer.current]
    );

    return (
      <>
        {refComposer.current?.composer.readBuffer.texture && (
          <>
            <primitive
              object={refComposer.current.composer.readBuffer.texture}
            />
          </>
        )}

        {createPortal(
          <>
            <Container
              ref={refComposer}
              renderPriority={renderPriority}
              enabled={enabled}
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

const Container = forwardRef(
  ({ enabled, renderPriority, effects, children }, ref) => {
    const { scene, camera, size } = useThree();

    const effectsTunnel = useMemo(() => tunnel(), []);

    useEffect(() => {
      if (!ref.current.composer) return;
      ref.current.composer.renderToScreen = false;
      ref.current.composer.renderer.autoClear = false;
      // console.log(ref.current.composer);
    });

    // const depthTexture = new DepthTexture(size.width, size.height);

    // // const depthRenderTarget = useFBO(size.width, size.height, {
    // //   depthTexture,
    // //   depthBuffer: true,
    // // });

    // const normalRenderTarget = useFBO(size.width, size.height, {
    //   depthTexture,
    //   depthBuffer: true,
    // });

    // useFrame((state, delta) => {
    //   const { gl, scene, camera } = state;

    //   // gl.clear(false, true, true);
    //   // gl.setRenderTarget(depthRenderTarget);
    //   // gl.render(scene, camera);

    //   const originalSceneMaterial = scene.overrideMaterial;
    //   gl.setRenderTarget(normalRenderTarget);

    //   scene.matrixWorldNeedsUpdate = true;
    //   scene.overrideMaterial = CustomNormalMaterial;

    //   gl.render(scene, camera);
    //   scene.overrideMaterial = originalSceneMaterial;

    //   gl.setRenderTarget(null);

    //   if (refNosePass.current) {
    //     refNosePass.current.material.uniforms.time.value =
    //       state.clock.getElapsedTime();
    //   }
    // }, renderPriority - 1);

    const refNosePass = useRef();

    return (
      <>
        <EffectsContext.Provider value={{ effectsTunnel }}>
          {children}
          {/* <Preload all /> */}
        </EffectsContext.Provider>

        <Effects
          ref={ref}
          multisampling={0}
          renderPriority={renderPriority}
          disableRender={!enabled}
          disableRenderPass={false}
          disableGamma={true}
          depthBuffer={true}
          fboProps={{
            count: 3,
          }}
        >
          {/* <effectsTunnel.Out /> */}
          <shaderPass args={[CopyShader]} />
          <nosePass
            ref={refNosePass}
            args={[
              {
                camera,
                width: size.width,
                height: size.height,
              },
            ]}
          />
          <shaderPass args={[CopyShader]} />
          {/* <filmPass /> */}
          {/* <glitchPass /> */}
          {/* <outputPass /> */}
        </Effects>
      </>
    );
  }
);
