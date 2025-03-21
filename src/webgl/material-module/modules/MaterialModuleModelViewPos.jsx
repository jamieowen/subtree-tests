export const MaterialModuleModelViewPos = memo(() => {
  useMaterialModule({
    name: 'MaterialModuleModelViewPos',
    vertexShader: {
      setup: /*glsl*/ `
        varying vec4 vModelViewPos;
      `,
      main: /*glsl*/ `
        vModelViewPos = modelViewMatrix * vec4(position, 1.0);
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        varying vec4 vModelViewPos;
      `,
      main: /*glsl*/ `
        
      `,
    },
  });

  return <></>;
});
