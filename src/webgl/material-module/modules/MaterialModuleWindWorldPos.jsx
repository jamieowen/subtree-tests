import { urls } from '@/config/assets';
import { useEffect } from 'react';
import { Vector3 } from 'three';

// ({ amount = 0.25, scale = 1, speed = 0.05 }) => {
export const MaterialModuleWindWorldPos = ({
  // tNoise,
  amount = 25.25,
  scale = 1.6,
  speed = 0.05,
  randScale = 1,
  range: _range = new Vector3(5, 1, 5),
}) => {
  const tNoise = useAsset(urls.t_noise_green);

  const rand = useMemo(() => Math.random(), []);

  const { material } = useMaterialModule({
    name: 'MaterialModuleWindWorldPos',
    uniforms: {
      tWind_Noise: { value: tNoise },
      uWind_Rand: { value: rand * randScale },
      uWind_Amount: { value: amount },
      uWind_Scale: { value: scale },
      uWind_Speed: { value: speed },
      uWind_Range: { value: _range },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform sampler2D tWind_Noise;
        uniform float uWind_Rand;
        uniform float uWind_Amount;
        uniform float uWind_Speed;
        uniform float uWind_Scale;
        uniform vec3 uWind_Range;

        attribute vec2 uv1;

        varying vec2 vUv1;
        varying vec4 debugNoise;

      `,
      main: /*glsl*/ `
        transformed = position;

        
        
        vec2 wst = vec2(
          1. - crange(vWorldPos.x, -uWind_Range.x, uWind_Range.x, 0., 1.),
          1. - crange(vWorldPos.z, -uWind_Range.z, uWind_Range.z, 0., 1.)
        );

        // float m = (1. - uv1.y);
        float m = crange(vWorldPos.y, 0., uWind_Range.y, 0., 1.);

        wst.x -= (uTime + uWind_Rand) * uWind_Speed;
        wst.y -= ((uTime + uWind_Rand) * uWind_Speed);

        vec4 noise = texture2D(tWind_Noise, wst * uWind_Scale);

        vec2 ntr = vec2(
          noise.r * uWind_Amount,
          noise.b * uWind_Amount
        );
        transformed.x -= ntr.x;
        transformed.z -= ntr.y;        

        transformed = mix(position, transformed, m);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

        // debugNoise = vec4(vec3(m), 1.);
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
            varying vec4 debugNoise;
        `,
      main: /*glsl*/ `
            //pc_fragColor = vec4(debugNoise.rgb, 1.);
        `,
    },
  });

  useEffect(() => {
    material.uniforms.uWind_Amount.value = amount;
  }, [amount]);
  useEffect(() => {
    material.uniforms.uWind_Scale.value = scale;
  }, [scale]);
  useEffect(() => {
    material.uniforms.uWind_Speed.value = speed;
  }, [speed]);

  return null;
};
