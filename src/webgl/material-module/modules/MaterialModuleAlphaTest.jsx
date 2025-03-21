export const MaterialModuleAlphaTest = ({ channel = 'a', alphaTest = 0.5 }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleAlphaTest',
    uniforms: {
      uAlphaTest: { value: alphaTest },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform float uAlphaTest;
      `,
      main: /*glsl*/ `
        if ( pc_fragColor.${channel} < uAlphaTest) discard;
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uAlphaTest.value = alphaTest;
  }, [alphaTest]);

  return <></>;
};
