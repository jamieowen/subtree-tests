export const MaterialModuleDiscard = () => {
  useMaterialModule({
    name: 'MaterialModuleDiscard',
    fragmentShader: {
      main: /*glsl*/ `
        pc_fragColor = vec4(0.);
        discard;
      `,
    },
  });

  return <></>;
};
