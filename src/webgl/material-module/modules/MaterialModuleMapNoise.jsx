import { urls } from '@/config/assets';

export const MaterialModuleMapNoise = ({
  // tNoise,
  scale = 1, // float | vec3
  strength = 1, // float | vec3
  speed = [0.1, 0.1], // float | vec2
}) => {
  const tNoise = useAsset(urls.t_mist_mask);

  useMaterialModule({
    name: 'MaterialModuleMapNoise',
    uniforms: {
      tMapNoise: { value: tNoise },
      uMapNoise_Scale: { value: scale },
      uMapNoise_Strength: { value: strength },
      uMapNoise_Speed: { value: speed },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform sampler2D tMapNoise;
        uniform float uMapNoise_Scale;
        uniform float uMapNoise_Strength;
        uniform vec2 uMapNoise_Speed;

      `,
      main: /*glsl*/ `
        vec2 mn_st = vec2(vUv);
        mn_st.x += (uTime + vReference.x) * uMapNoise_Speed.x * uMapNoise_Scale;
        mn_st.y += (uTime + vReference.y) * uMapNoise_Speed.y * uMapNoise_Scale;
        vec4 mn_noise = texture2D(tMapNoise, mn_st);


        pc_fragColor *= vec4(mn_noise.rgb, 1.0);

      `,
    },
  });

  return <></>;
};
