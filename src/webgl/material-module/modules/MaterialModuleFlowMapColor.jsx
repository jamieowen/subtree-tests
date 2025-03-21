export const MaterialModuleFlowMapColor = forwardRef(
  ({ color = 0xffffff, brightness = 1, blend = '', alphaTest = -1.0 }, ref) => {
    // COLOR
    const _color = useColor(color);

    const { material } = useMaterialModule({
      name: 'MaterialModuleFlowMapColor',
      uniforms: {
        uFlowMap_Color: { value: _color },
        uFlowMap_AlphaTest: { value: alphaTest },
        uFlowMap_Brightness: { value: brightness },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform vec3 uFlowMap_Color;
          uniform float uFlowMap_AlphaTest;
          uniform float uFlowMap_Brightness;
        `,
        main: /*glsl*/ `
          vec4 flow = 1.0 - texture(tFlowMap, screenPosition);
          pc_fragColor.rgb ${blend}= (1.0 - flow.b) * uFlowMap_Color.rgb * uFlowMap_Brightness;
          pc_fragColor.a += 1.0 - flow.b;
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uFlowMap_Color.value = _color;
    }, [_color]);

    useEffect(() => {
      material.uniforms.uFlowMap_AlphaTest.value = alphaTest;
    }, [alphaTest]);

    useEffect(() => {
      material.uniforms.uFlowMap_Brightness.value = brightness;
    }, [brightness]);

    useImperativeHandle(
      ref,
      () => ({
        get color() {
          return material.uniforms.uFlowMap_Color.value;
        },
        set color(val) {
          material.uniforms.uFlowMap_Color.value = val;
        },
        get alphaTest() {
          return material.uniforms.uFlowMap_AlphaTest.value;
        },
        set alphaTest(val) {
          material.uniforms.uFlowMap_AlphaTest.value = val;
        },
        get brightness() {
          return material.uniforms.uFlowMap_Brightness.value;
        },
        set brightness(val) {
          material.uniforms.uFlowMap_Brightness.value = val;
        },
      }),
      [material]
    );

    return <></>;
  }
);
