export const MaterialModuleFog = memo(
  forwardRef(({ near = 1, far = 1000, color = 0x000000 }, ref) => {
    const fogColor = useColor(color);

    console.log(near, far, color);

    const { material } = useMaterialModule({
      name: 'MaterialModuleFog',
      uniforms: {
        uFogNear: { value: near },
        uFogFar: { value: far },
        uFogColor: { value: fogColor },
      },
      vertexShader: {
        setup: /*glsl*/ `
          varying float vFogDepth;
        `,
        main: /*glsl*/ `
          vFogDepth = -vModelViewPos.z;
        `,
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform float uFogNear;
          uniform float uFogFar;
          uniform vec3 uFogColor;

          varying float vFogDepth;
        `,
        main: /*glsl*/ `
          float fogFactor = smoothstep( uFogNear, uFogFar, vFogDepth );
          // pc_fragColor.rgb = mix( pc_fragColor.rgb, uFogColor, fogFactor );
          pc_fragColor.rgb = mix( pc_fragColor.rgb, uFogColor, fogFactor );
        `,
      },
    });

    useEffect(() => {
      material.uniforms.uFogNear.value = near;
    }, [near]);

    useEffect(() => {
      material.uniforms.uFogFar.value = far;
    }, [far]);

    useEffect(() => {
      material.uniforms.uFogColor.value = fogColor;
    }, [fogColor]);

    return <></>;
  })
);
