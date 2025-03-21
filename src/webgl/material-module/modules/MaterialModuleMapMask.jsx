export const MaterialModuleMapMask = memo(({ map, channel = 'r' }) => {
  if (!map) console.warn('MaterialModuleMapMask: map is not defined');

  const { material } = useMaterialModule({
    name: 'MaterialModuleMapMask',
    uniforms: {
      tMapMask: { type: 't', value: map },
    },
    fragmentShader: {
      setup: /*glsl*/ `
          uniform sampler2D tMapMask;
        `,
      main: /*glsl*/ `
          vec4 mapMask = texture2D(tMapMask, st);
          float mask = mapMask.${channel};
          if (mask < 0.5) {
            discard;
          }
        `,
    },
  });

  useEffect(() => {
    material.uniforms.tMapMask.value = map;
  }, [map]);

  return <></>;
});
