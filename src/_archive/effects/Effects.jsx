import { Children, cloneElement } from 'react';
import {
  RGBAFormat,
  HalfFloatType,
  WebGLRenderTarget,
  UnsignedByteType,
  DepthTexture,
} from 'three';
import { extend, useThree, useFrame } from '@react-three/fiber';
import { EffectComposer } from './EffectComposer';

import { RenderPass } from './RenderPass';
import { ShaderPass } from './ShaderPass';
import { GammaCorrectionShader } from './GammaCorrectionShader';

extend({ EffectComposer, RenderPass, ShaderPass });

export const Effects = forwardRef(
  (
    {
      children,
      multisampling = 8,
      renderPriority = 1,
      disableRender,
      disableGamma,
      disableRenderPass,
      depthBuffer = true,
      stencilBuffer = false,
      anisotropy = 1,
      encoding,
      type,
      fboProps = {},
      ...props
    },
    ref
  ) => {
    // useMemo(() => extend({ EffectComposer, RenderPass, ShaderPass }), []);
    const composer = useRef(null);

    const { scene, camera, gl, size, viewport } = useThree();

    const depthTexture = suspend(async () => {
      return new DepthTexture(size.width, size.height);
    }, [`Effects.depthTexture`]);
    useEffect(() => {
      return () => {
        depthTexture.dispose();
      };
    }, [depthTexture]);

    const target = suspend(async () => {
      console.log('Effects new target');
      const t = new WebGLRenderTarget(size.width, size.height, {
        type: type || HalfFloatType,
        format: RGBAFormat,
        depthBuffer,
        depthTexture,
        stencilBuffer,
        anisotropy,
        ...fboProps,
      });

      // sRGB textures must be RGBA8 since r137 https://github.com/mrdoob/three.js/pull/23129
      if (type === UnsignedByteType && encoding != null) {
        if ('colorSpace' in t) t.texture.colorSpace = encoding;
        else t.texture.encoding = encoding;
      }

      t.samples = multisampling;
      return t;
    }, [`Effects`]);
    useEffect(() => {
      return () => {
        console.log('Effects destroy target');
        target.texture.dispose();
        target.dispose();
      };
    }, [target]);

    useImperativeHandle(
      ref,
      () => {
        return {
          composer: composer.current,
          fbo: target,
        };
      },
      [target]
    );

    useEffect(() => {
      composer.current?.setSize?.(size.width, size.height);
      composer.current?.setPixelRatio?.(viewport.dpr);
    }, [gl, size, viewport.dpr]);

    useFrame(() => {
      if (!disableRender) composer.current?.render();
      // console.log('Effects', renderPriority, window.performance.now());
    }, renderPriority);

    const passes = [];
    if (!disableRenderPass)
      passes.push(
        <renderPass
          key="renderpass"
          attach={`passes-${passes.length}`}
          args={[scene, camera]}
        />
      );
    if (!disableGamma)
      passes.push(
        <shaderPass
          attach={`passes-${passes.length}`}
          key="gammapass"
          args={[GammaCorrectionShader]}
        />
      );

    Children.forEach(children, (el) => {
      if (!el) return;
      passes.push(
        cloneElement(el, {
          key: passes.length,
          attach: `passes-${passes.length}`,
        })
      );
    });

    // console.log(passes)

    return (
      <>
        <effectComposer
          ref={composer}
          args={[gl, target]}
          {...props}
        >
          {passes}
        </effectComposer>
        <DebugTexture texture={depthTexture} />
      </>
    );
  }
);
