export const MaterialModuleGradientCircle = memo(
  ({ color = 0xffffff, radius = 0.3, blend = '' }) => {
    const _color = useColor(color);

    const { material } = useMaterialModule({
      name: 'MaterialModuleGradientCircle',
      uniforms: {
        uGradient_Color: { value: _color },
        uGradient_Radius: { value: radius },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform vec3 uGradient_Color;
          uniform float uGradient_Radius;

          float dist(vec2 p0, vec2 pf){return sqrt((pf.x-p0.x)*(pf.x-p0.x)+(pf.y-p0.y)*(pf.y-p0.y));}

        `,
        main: /*glsl*/ `
          
          float d = dist(vUv, vec2(0.5));
          float a = 1.0 - d / uGradient_Radius;

          if (a < 0.001) {
            discard;
          }

          pc_fragColor ${blend}= vec4(uGradient_Color, a);
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uGradient_Color.value = _color;
    }, [_color]);

    useEffect(() => {
      material.uniforms.uGradient_Radius.value = radius;
    }, [radius]);

    return <></>;
  }
);
