export const MaterialModuleColor = memo(
  forwardRef(({ color, alpha = 1, intensity = 1, blend = '' }, ref) => {
    // COLOR
    const _color = useColor(color);

    const { material } = useMaterialModule({
      name: 'MaterialModuleColor',
      uniforms: {
        uColor: { value: _color },
        uColor_Alpha: { value: alpha },
        uColor_Intensity: { value: intensity },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform vec3 uColor;
          uniform float uColor_Alpha;
          uniform float uColor_Intensity;
        `,
        main: /*glsl*/ `
          pc_fragColor ${blend}= vec4(uColor, uColor_Alpha) * uColor_Intensity;
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uColor.value = _color;
    }, [_color]);

    useEffect(() => {
      material.uniforms.uColor_Alpha.value = alpha;
    }, [alpha]);

    useEffect(() => {
      material.uniforms.uColor_Intensity.value = intensity;
    }, [intensity]);

    useImperativeHandle(
      ref,
      () => ({
        _color,
        get color() {
          return material.uniforms['uColor'].value;
        },
        set color(val) {
          material.uniforms['uColor'].value = val;
        },

        get alpha() {
          return material.uniforms['uColor_Alpha'].value;
        },
        set alpha(val) {
          material.uniforms['uColor_Alpha'].value = val;
        },

        get intensity() {
          return material.uniforms['uColor_Intensity'].value;
        },
        set intensity(val) {
          material.uniforms['uColor_Intensity'].value = val;
        },
      }),
      [material]
    );

    return <></>;
  })
);
