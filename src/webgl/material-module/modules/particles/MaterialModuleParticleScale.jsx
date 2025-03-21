export const MaterialModuleParticleScale = ({
  taper = 0,
  min = 1,
  max = 1,
}) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleParticleScale',
    uniforms: {
      uParticleScaleTaper: { value: taper },
      uParticleScaleMin: { value: min },
      uParticleScaleMax: { value: max },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform float uParticleScaleTaper;
        uniform float uParticleScaleMin;
        uniform float uParticleScaleMax;
      `,
      main: /*glsl*/ `
        float taperStart = clamp(crange(vProgress, 0.0, uParticleScaleTaper, 0., 1.), 0., 1.);
        float taperEnd = clamp(crange(vProgress, 1.0 - uParticleScaleTaper, 1.0, 1., 0.), 0., 1.);
        

        float s = crange(vIndex, 0., uParticleCount, uParticleScaleMin, uParticleScaleMax);
        
        
        transformed = (vec4(position, 1.0) * quaternionToMatrix4(rot)).xyz;
        
        transformed.xyz *= s * taperStart * taperEnd;
        transformed += pos.xyz;
        vPosition = transformed;

        vWorldPos = (modelMatrix * vec4(transformed.xyz, 1.0)).xyz;

        mvPosition = modelViewMatrix * vec4(transformed, 1.0);
        gl_Position = projectionMatrix * mvPosition;
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uParticleScaleTaper.value = taper;
  }, [material, taper]);
  useEffect(() => {
    material.uniforms.uParticleScaleMin.value = min;
  }, [material, min]);
  useEffect(() => {
    material.uniforms.uParticleScaleMax.value = max;
  }, [material, max]);

  return <></>;
};
