export const MaterialModuleSurfaceId = () => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleAlpha',
    uniforms: {
      uMaxSurfaceId: { value: surfaceFinder.surfaceId + 1 },
    },
    vertexShader: {
      setup: /*glsl*/ `
        attribute vec4 aSurface;
        varying vec4 vSurfaceColor;
      `,
      main: /*glsl*/ `
          vSurfaceColor = aSurface;
      `,
    },
    fragmentShader: {
      setup: /*glsl*/ `
        varying vec4 vSurfaceColor;
        uniform float uMaxSurfaceId;
        layout(location = 2) out vec4 gSurface;
      `,
      main: /*glsl*/ `
        // float surfaceId = round(vSurfaceColor.r) / uMaxSurfaceId;
        // gSurface = vec4(surfaceId, 0.0, 0.0, 1.0);

        int surfaceId = int(round(vSurfaceColor.r) * 100.0);
        float R = float(surfaceId % 255) / 255.0;
        float G = float((surfaceId + 50) % 255) / 255.0;
        float B = float((surfaceId * 20) % 255) / 255.0;

        gSurface = vec4(R, G, B, 1.0);
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uMaxSurfaceId.value = surfaceFinder.surfaceId + 1;
  }, [material]);

  return <></>;
};
