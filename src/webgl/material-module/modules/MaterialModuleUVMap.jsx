export const MaterialModuleUVMap = memo(({ map }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleMap',
    uniforms: {
      tUVMap: { type: 't', value: map },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform sampler2D tUVMap;
      `,
      main: /*glsl*/ `
        st = texture2D(tUVMap, st).xy;
        // pc_fragColor = vec4(st.x, st.x, st.x, 1.0);
      `,
    },
  });

  useEffect(() => {
    material.uniforms.tUVMap.value = map;
  }, [map]);

  return <></>;
});
