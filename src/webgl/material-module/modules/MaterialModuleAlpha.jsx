export const MaterialModuleAlpha = memo(
  forwardRef(({ alpha = 1, blend = '' }, ref) => {
    const { material } = useMaterialModule({
      name: 'MaterialModuleAlpha',
      uniforms: {
        uAlpha: { value: alpha },
      },
      fragmentShader: {
        setup: /*glsl*/ `
        uniform float uAlpha;
      `,
        main: /*glsl*/ `
          pc_fragColor.a ${blend}= uAlpha;
      `,
      },
    });

    useEffect(() => {
      material.uniforms.uAlpha.value = alpha;
    }, [alpha]);

    useImperativeHandle(
      ref,
      () => ({
        get alpha() {
          return material.uniforms['uAlpha'].value;
        },
        set alpha(val) {
          material.uniforms['uAlpha'].value = val;
        },
      }),
      [material]
    );

    return <></>;
  })
);
