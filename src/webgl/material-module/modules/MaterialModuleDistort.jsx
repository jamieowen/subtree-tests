// https://github.com/pmndrs/drei?tab=readme-ov-file#meshdistortmaterial
import snoise from '@/webgl/glsl/lygia/generative/snoise.glsl';

export const MaterialModuleDistort = ({
  amount = 0.4,
  radius = 1,
  speed = 1,
  lockZ = false,
  ...props
}) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleDistort',
    uniforms: {
      uDistort_amount: { value: amount },
      uDistort_radius: { value: radius },
      uDistort_speed: { value: speed },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform float uDistort_amount;
        uniform float uDistort_speed;
        uniform float uDistort_radius;

        ${snoise}
      `,
      deform: /*glsl*/ `
        float updateTime = uTime / 50.0 * uDistort_speed;
        float noise = snoise(vec3(position / 2.0 + updateTime * 5.0));
        transformed = vec3(position * (noise * pow(uDistort_amount, 2.0) + uDistort_radius));
        ${lockZ ? 'transformed.z = position.z;' : ''}
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uDistort_amount.value = amount;
  }, [material, amount]);
  useEffect(() => {
    material.uniforms.uDistort_radius.value = radius;
  }, [material, radius]);
  useEffect(() => {
    material.uniforms.uDistort_speed.value = speed;
  }, [material, speed]);

  return <></>;
};
