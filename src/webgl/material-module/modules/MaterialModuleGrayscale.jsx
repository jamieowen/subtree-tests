import rgb2luma from '@/webgl/glsl/lygia/color/space/rgb2luma.glsl';

export const MaterialModuleGrayscale = memo(({ amount = 1 }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleGrayscale',
    uniforms: {
      uGrayscale: { value: amount },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform float uGrayscale;
        ${rgb2luma}
      `,
      main: /*glsl*/ `
        vec4 gray = vec4(vec3(rgb2luma(pc_fragColor)), pc_fragColor.a);
        pc_fragColor = mix(pc_fragColor, gray, uGrayscale);
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uGrayscale.value = amount;
  }, [amount]);

  return <></>;
});
