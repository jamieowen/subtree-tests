import contrast from '@/webgl/glsl/lygia/color/contrast.glsl';

export const MaterialModuleContrast = memo(({ amount = 1 }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleContrast',
    uniforms: {
      uContrast: { value: amount },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform float uContrast;
        ${contrast}
      `,
      main: /*glsl*/ `
        pc_fragColor = contrast(pc_fragColor, uContrast);
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uContrast.value = amount;
  }, [amount]);

  return <></>;
});
