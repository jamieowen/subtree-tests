import { urls } from '@/config/assets';
import { useEffect } from 'react';

export const MaterialModuleWind = ({
  //
  noiseScale = 0.2,
  bend = 0.2,
  power = 1.0,
  direction = [2.0, 1.0],
}) => {
  const tNoise = useAsset(urls.t_noise_green);

  // const getMouse = useMouse2(0);

  // useFrame(({ clock }, delta) => {
  //   let time = clock.getElapsedTime();

  //   // UPDATE MOUSE
  //   const { x, y } = getMouse(0.2, delta);

  //   // material.uniforms.uWind_Direction.value.x = 0.0;
  //   material.uniforms.uWind_Direction.value.x = Math.pow(x * 2 - 1, 1) * 3;
  //   material.uniforms.uWind_Direction.value.y = Math.pow(y * 2 - 1, 1) * 3;

  //   console.log(material.uniforms.uWind_Direction.value);
  // });

  const { material } = useMaterialModule({
    name: 'MaterialModuleWind',
    uniforms: {
      tWind_Noise: { value: tNoise },
      uWind_NoiseScale: { value: noiseScale },
      uWind_Bend: { value: bend },
      uWind_Power: { value: power },
      uWind_Direction: { value: direction },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform sampler2D tWind_Noise;
        uniform float uWind_NoiseScale;
        uniform float uWind_Bend;
        uniform float uWind_Power;
        uniform vec2 uWind_Direction;

        attribute vec3 color_1;

        varying vec3 vWind_Color;
      `,
      main: /*glsl*/ `

        // WIND SPEED
        vec2 wind_dir = vec2(uWind_Direction.x, uWind_Direction.y);
        float wind_speed = pow(wind_dir.x * wind_dir.x + wind_dir.y * wind_dir.y, 0.5);

        // WIND SPEED NOISE
        vec4 speed_noise = texture2D(tWind_Noise, (uTime + vPosition.xz) * wind_speed * 0.1);
        wind_dir.xy *= speed_noise.xy * 0.5;
        wind_speed = pow(wind_dir.x * wind_dir.x + wind_dir.y * wind_dir.y, 0.5);


        // WIND EFFECT
        vec2 wind_st = vec2(0.0);
        wind_st.x += (uTime + vPosition.x) * wind_speed * uWind_NoiseScale;
        wind_st.y += (uTime + vPosition.z) * wind_speed * uWind_NoiseScale;
        vec4 wind_noise = texture2D(tWind_Noise, wind_st);
        vec2 wind = vec2(sin(wind_noise.rg) * 0.5 + 0.5);

        // TRANSFORM
        transformed = position;
        float r = 1.0 - color_1.r;
        transformed.x += wind_dir.x * wind.x * pow(r, uWind_Power) * uWind_Bend;
        transformed.z += wind_dir.y * wind.y * pow(r, uWind_Power) * uWind_Bend;

        // OUT
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
        vWind_Color = color_1;
      `,
    },
    // fragmentShader: {
    //   setup: /*glsl*/ `
    //     varying vec3 vWind_Color;
    //   `,
    //   main: /*glsl*/ `
    //     pc_fragColor = vec4(vWind_Color.r, 0.0, 0.0, 1.0);
    //   `,
    // },
  });

  useEffect(() => {
    material.uniforms.uWind_NoiseScale.value = noiseScale;
  }, [noiseScale]);

  useEffect(() => {
    material.uniforms.uWind_Bend.value = bend;
  }, [bend]);

  useEffect(() => {
    material.uniforms.uWind_Power.value = power;
  }, [power]);

  useEffect(() => {
    material.uniforms.uWind_Direction.value = direction;
  }, [direction]);

  return null;
};
