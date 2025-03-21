import chromaticAbberation from '@/webgl/glsl/utils/chromaticAbberation.glsl';

export const DeferredChromaticAberration = ({
  amount = 1,
  iterations = 3,
  maxDistortion = 0.08,
  blend = 1,
}) => {
  useDeferredModule({
    name: 'DeferredChromaticAberration',
    uniforms: {
      uChromaticAbberation_Amount: { value: amount },
      uChromaticAbberation_Iterations: { value: iterations },
      uChromaticAbberation_MaxDistortion: { value: maxDistortion },
      uChromaticAbberation_Alpha: { value: blend },
    },
    shaderChunks: {
      setup: /*glsl*/ `
        ${chromaticAbberation}

        uniform float uChromaticAbberation_Amount;
        uniform int uChromaticAbberation_Iterations;
        uniform float uChromaticAbberation_MaxDistortion;
        uniform float uChromaticAbberation_Alpha;
      `,
      pass: /*glsl*/ `
        vec2 chromUV = vUv;
        vec2 chromCenter = (vUv - .5);
        vec4 chrom = chromaticAberration(
            tDiffuse, 
            chromUV, 
            uChromaticAbberation_Amount, 
            chromCenter, 
            uChromaticAbberation_Iterations,
            uChromaticAbberation_MaxDistortion
        );

        // vec3 remainder = color.rgb - chrom.rgb;
        
        vec3 remainder = chrom.rgb - color.rgb;

        //pc_fragColor.rgb = blendScreen(chrom.rgb, pc_fragColor.rgb, uChromaticAbberation_Alpha);

        pc_fragColor.rgb += (remainder * uChromaticAbberation_Alpha);
      `,
    },
  });

  return null;
};
