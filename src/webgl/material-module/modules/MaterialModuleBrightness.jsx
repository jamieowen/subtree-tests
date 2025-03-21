export const MaterialModuleBrightness = forwardRef(({ amount = 1 }, ref) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleBrightness',
    uniforms: {
      uBrightness: { value: amount },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform float uBrightness;
      `,
      main: /*glsl*/ `
        pc_fragColor *= uBrightness;
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uBrightness.value = amount;
  }, [amount]);

  useImperativeHandle(
    ref,
    () => ({
      get amount() {
        return material.uniforms['uBrightness'].value;
      },
      set amount(val) {
        material.uniforms['uBrightness'].value = val;
      },
    }),
    [material]
  );

  return <></>;
});
