import { urls } from '@/config/assets';

export const MaterialModuleMaskNoise = ({
  tNoise,
  scale = 1, // float | vec3
  strength = 1, // float | vec3
  speed = [2, 3], // float | vec2
}) => {
  // const _tNoise = useTexture('/assets/textures/mist.png');

  const _tNoise = useAsset(urls.t_mist);

  // console.log(100, _tNoise);

  useMaterialModule({
    name: 'MaterialModuleMaskNoise',
    uniforms: {
      tMaskNoise: { value: _tNoise[0] },
      uMaskNoise_Scale: { value: scale },
      uMaskNoise_Strength: { value: strength },
      uMaskNoise_Speed: { value: speed },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform sampler2D tMaskNoise;
        uniform float uMaskNoise_Scale;
        uniform float uMaskNoise_Strength;
        uniform vec2 uMaskNoise_Speed;

      `,
      main: /*glsl*/ `
        // vec2 MaskNoise_st = vec2(vUv);
        // MaskNoise_st.x += (uTime + vReference.x) * uMaskNoise_Speed.x * uMaskNoise_Scale;
        // MaskNoise_st.y += (uTime + vReference.y) * uMaskNoise_Speed.y * uMaskNoise_Scale;
        // vec4 MaskNoise_n = texture2D(tMaskNoise, st * vReference);

        // pc_fragColor.rgb = MaskNoise_n.rgb;
        // if (MaskNoise_n.r < 0.5) {
        //   discard;
        // }

        // Mask
        // vec4 mask = texture2D( tMask, vUv );
        // float testA = 1.0 - MaskNoise_n.r;
        // float testB = 1.0 - abs(vProgress * 2.0 - 1.0);
        // if (testA > testB) {
        //   discard;
        // }
        pc_fragColor.a *= 1.0 - abs(vProgress * 2.0 - 1.0);


      `,
    },
  });

  return <></>;
};
