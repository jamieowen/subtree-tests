export const MaterialModuleMap = memo(
  ({
    map,
    blend = '',
    oneMinus = false,
    intensity = 1.0,
    color = 0xffffff,
    alphaTest = 0.0,
  }) => {
    if (!map) console.warn('MaterialModuleMap: map is not defined');

    const _color = useColor(color);

    const { material } = useMaterialModule({
      name: 'MaterialModuleMap',
      uniforms: {
        tMap: { type: 't', value: map },
        uMap_Color: { value: _color },
        uMap_AlphaTest: { value: alphaTest },
        uMap_Intensity: { value: intensity },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform sampler2D tMap;
          uniform vec3 uMap_Color;
          uniform float uMap_AlphaTest;
          uniform float uMap_Intensity;
        `,
        main: /*glsl*/ `
          vec4 mc = texture2D(tMap, st);
          ${oneMinus ? 'mc = 1.0 - mc;' : ''}
          mc.rgb *= uMap_Color;
          if (mc.a > uMap_AlphaTest) {
            pc_fragColor ${blend}= mc * uMap_Intensity;
          }
        `,
      },
    });

    useEffect(() => {
      material.uniforms.tMap.value = map;
    }, [map]);

    useEffect(() => {
      material.uniforms.uMap_Color.value = _color;
    }, [_color]);

    useEffect(() => {
      material.uniforms.uMap_AlphaTest.value = alphaTest;
    }, [alphaTest]);

    useEffect(() => {
      material.uniforms.uMap_Intensity.value = intensity;
    }, [intensity]);

    return <></>;
  }
);
