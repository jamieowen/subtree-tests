export const MaterialModuleObjectWorldPos = memo(() => {
  useMaterialModule({
    uniforms: {
      uObjectWorldPos: { value: [] },
    },
    name: 'MaterialModuleObjectWorldPos',
    vertexShader: {
      setup: /*glsl*/ `
        uniform vec3 uObjectWorldPos;
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        varying vec3 uObjectWorldPos;
      `,
    },
  });

  useEffect(() => {});

  return <></>;
});
