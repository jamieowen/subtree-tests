export const MaterialModuleUVOriginal = memo(({ map }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleUVOriginal',
    uniforms: {},
    fragmentShader: {
      main: /*glsl*/ `
        st = vUv;
      `,
    },
  });

  return <></>;
});
