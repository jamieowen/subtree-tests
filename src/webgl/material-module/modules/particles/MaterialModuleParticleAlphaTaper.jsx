export const MaterialModuleParticleAlphaTaper = ({ taper = 0 }) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleParticleAlphaTaper',
    uniforms: {
      uParticleAlphaTaper: { value: taper },
    },
    fragmentShader: {
      setup: /*glsl*/ `
        uniform float uParticleAlphaTaper;
      `,
      main: /*glsl*/ `
        float taperStart = clamp(crange(vProgress, 0.0, uParticleAlphaTaper, 0., 1.), 0., 1.);
        float taperEnd = clamp(crange(vProgress, 1.0 - uParticleAlphaTaper, 1.0, 1., 0.), 0., 1.);
        pc_fragColor.a *= taperStart * taperEnd;
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uParticleAlphaTaper.value = taper;
  }, [material, taper]);

  return <></>;
};
