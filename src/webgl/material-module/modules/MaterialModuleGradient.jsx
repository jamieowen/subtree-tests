export const MaterialModuleGradient = memo(
  ({
    color1 = 0xffffff,
    color2 = 0x000000,
    mixFunc = `screenPosition.y;`,
    blend = '',
    strength = 1,
  }) => {
    // mixFunc = `'crange(vWorldPos.z, 0., 100., 0., 1.)'`

    // COLOR
    const _color1 = useColor(color1);
    const _color2 = useColor(color2);

    // const { material } = useContext(GBufferMaterialContext);
    // const hasMap = material.uniforms.tMap.value;

    const { material } = useMaterialModule({
      name: 'MaterialModuleGradient',
      uniforms: {
        uGradient_Color1: { value: _color1 },
        uGradient_Color2: { value: _color2 },
        uGradient_Strength: { value: strength },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform vec3 uGradient_Color1;
          uniform vec3 uGradient_Color2;
          uniform float uGradient_Strength;

        `,
        main: /*glsl*/ `
          
          float colorMix = ${mixFunc}
          vec3 color = mix(uGradient_Color1, uGradient_Color2, colorMix);
          pc_fragColor.rgb ${blend}= color * uGradient_Strength;
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uGradient_Color1.value = _color1;
    }, [_color1]);

    useEffect(() => {
      material.uniforms.uGradient_Color2.value = _color2;
    }, [_color2]);

    useEffect(() => {
      material.uniforms.uGradient_Strength.value = strength;
    }, [strength]);

    return <></>;
  }
);
