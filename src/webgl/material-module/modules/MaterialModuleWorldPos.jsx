export const MaterialModuleWorldPos = memo(() => {
  useMaterialModule({
    name: 'MaterialModuleWorldPos',
    vertexShader: {
      setup: /*glsl*/ `
        varying vec3 vWorldPos;
      `,
      main: /*glsl*/ `
        vWorldPos = vec3(modelMatrix * vec4(position, 1.0));
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        varying vec3 vWorldPos;

        
      `,
      main: /*glsl*/ `
        
      `,
    },
  });

  return <></>;
});
