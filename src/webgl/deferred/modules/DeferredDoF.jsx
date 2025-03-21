import dof from '@/webgl/glsl/lygia/sample/dof.glsl';

export const DeferredDoF = ({ focusPoint = 1.0, focusScale = 1.0 }) => {
  const { refDeferred } = useDeferredModule({
    name: 'DeferredDoF',
    uniforms: {
      uDeferredDoF_focusPoint: { value: focusPoint },
      uDeferredDoF_focusScale: { value: focusScale },
    },
    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uDeferredDoF_focusPoint;
        uniform float uDeferredDoF_focusScale;

        #ifndef SAMPLEDOF_TYPE
        #define RESOLUTION uResolution
        #endif

        ${dof}
      `,
      pass: /*glsl*/ `
        vec3 dof = sampleDoF(tDiffuse, tDepth, vUv, uDeferredDoF_focusPoint, uDeferredDoF_focusScale);
        pc_fragColor = vec4(dof, 1.0);
      `,
    },
  });

  useEffect(() => {
    refDeferred.current.uniforms.uDeferredDoF_focusPoint.value = focusPoint;
  }, [focusPoint]);

  useEffect(() => {
    refDeferred.current.uniforms.uDeferredDoF_focusScale.value = focusScale;
  }, [focusScale]);

  return <></>;
};
