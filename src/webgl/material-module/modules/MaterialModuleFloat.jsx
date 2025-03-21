export const MaterialModuleFloat = memo(
  forwardRef(({ speed = 1, amplitude = 1 }, ref) => {
    const { material } = useMaterialModule({
      name: 'MaterialModuleFloat',
      uniforms: {
        uFloat_Speed: { value: speed },
        uFloat_Amplitude: { value: amplitude },
      },
      vertexShader: {
        setup: /*glsl*/ `
          uniform float uFloat_Speed;
          uniform float uFloat_Amplitude;
        `,
        deform: /*glsl*/ `
          // transformed.y += ((sin(uTime * uFloat_Speed) + 1) * 0.5) * uFloat_Amplitude;
          transformed.y += (sin(uTime * uFloat_Speed) + 1.0) * 0.5 * uFloat_Amplitude;
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uFloat_Speed.value = speed;
    }, [speed]);

    useEffect(() => {
      material.uniforms.uFloat_Amplitude.value = amplitude;
    }, [amplitude]);

    return <></>;
  })
);
