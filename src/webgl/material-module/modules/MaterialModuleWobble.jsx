// https://github.com/pmndrs/drei?tab=readme-ov-file#meshwobblematerial

export const MaterialModuleWobble = ({ amount = 1, speed = 1, ...props }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleWobble',
    uniforms: {
      uWobble_amount: { value: amount },
      uWobble_speed: { value: speed },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform float uWobble_amount;
        uniform float uWobble_speed;
      `,
      main: /*glsl*/ `
        float theta = sin( (uTime + position.y) * uWobble_speed ) / 2.0 * uWobble_amount;
        float c = cos( theta );
        float s = sin( theta );
        mat3 m = mat3( c, 0, s, 0, 1, 0, -s, 0, c );
        transformed = vec3( position ) * m;
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uWobble_amount.value = amount;
  }, [material, amount]);
  useEffect(() => {
    material.uniforms.uWobble_speed.value = speed;
  }, [material, speed]);

  return <></>;
};
