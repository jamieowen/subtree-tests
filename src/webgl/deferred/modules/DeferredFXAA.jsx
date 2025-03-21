import fxaa from '@/webgl/glsl/utils/fxaa.glsl';

export const DeferredFXAA = ({ quality = 0.2 }) => {
  const { refDeferred } = useDeferredModule({
    name: 'DeferredFXAA',
    uniforms: {
      uDeferredFXAA_Quality: { value: quality },
    },
    shaderChunks: {
      setup: /*glsl*/ `
          uniform float uDeferredFXAA_Quality;

          ${fxaa}
        `,
      pass: /*glsl*/ `
          pc_fragColor = FxaaPixelShader(vUv, tDiffuse, uResolution, uDeferredFXAA_Quality, 1. / uDeferredFXAA_Quality);
        `,
    },
  });

  useEffect(() => {
    refDeferred.current.uniforms.uDeferredFXAA_Quality.value = quality;
  }, [quality]);

  return <></>;
};
