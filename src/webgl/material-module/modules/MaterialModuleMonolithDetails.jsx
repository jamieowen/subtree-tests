export const MaterialModuleMonolithDetails = forwardRef(
  ({ map, color = 'white', strength = 0.0 }, ref) => {
    const _color = useColor(color);

    const { material } = useMaterialModule({
      name: 'MaterialModuleMonolithDetails',
      uniforms: {
        tMonolith_Map: { type: 't', value: map },
        tMonolith_Color: { value: _color },
        tMonolith_Strength: { value: strength },
      },
      fragmentShader: {
        setup: /*glsl*/ `
        uniform sampler2D tMonolith_Map;
        uniform vec3 tMonolith_Color;
        uniform float tMonolith_Strength;
      `,
        main: /*glsl*/ `
        vec4 monolithDetail = texture2D(tMonolith_Map, vUv);
        if (monolithDetail.r < 1.0) {
          pc_fragColor.rgb *= monolithDetail.rgb;
          pc_fragColor.rgb = mix(pc_fragColor.rgb, tMonolith_Color, tMonolith_Strength);
        }
      `,
      },
    });

    useEffect(() => {
      material.uniforms['tMonolith_Map'].value = map;
    }, [material, map]);
    useEffect(() => {
      material.uniforms['tMonolith_Color'].value = _color;
    }, [material, _color]);
    useEffect(() => {
      material.uniforms['tMonolith_Strength'].value = strength;
    }, [material, strength]);

    useImperativeHandle(
      ref,
      () => ({
        get strength() {
          return material.uniforms['tMonolith_Strength'].value;
        },
        set strength(val) {
          material.uniforms['tMonolith_Strength'].value = val;
        },
      }),
      [material]
    );

    return <></>;
  }
);
