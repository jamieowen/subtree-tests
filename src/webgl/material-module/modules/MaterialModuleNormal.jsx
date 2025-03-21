import normalEncoding from '@/webgl/glsl/utils/normalEncoding.glsl';

export const MaterialModuleNormal = ({ normal }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleNormal',
    uniforms: {
      uNormalOverride: {
        value: normal,
      },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform vec3 uNormalOverride;
        ${normalEncoding}
      `,
      main: /*glsl*/ `
          // gNormal = vec4(vWorldNormal, 1.0);
          vec3 n = vWorldNormal;
          #ifdef USE_NORMAL_OVERRIDE
            n = uNormalOverride;
          #endif
          gNormal.xy = normalEncode(n);
          gNormal.w = 1.0;
      `,
    },
  });

  useEffect(() => {
    if (!!normal) {
      material.defines['USE_NORMAL_OVERRIDE'] = true;
    } else {
      delete material.defines['USE_NORMAL_OVERRIDE'];
    }
  }, [material, normal]);

  return <></>;
};
