export const MaterialModuleMouse = () => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleMouse',
    uniforms: {
      uMouse: { value: new Vector2() },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform vec2 uMouse;
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform vec2 uMouse;
      `,
    },
  });

  const getMouse = useMouse2();
  useFrame(({ raycaster, camera }, delta) => {
    let { x, y } = getMouse();

    y = 1 - y;

    // Map to [-1, 1]
    // x = x * 2 - 1;
    // y = y * 2 - 1;

    material.uniforms.uMouse.value.x = x;
    material.uniforms.uMouse.value.y = y;
  });

  return <></>;
};
