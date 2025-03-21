import { targetHeight } from '@/config';

export const MaterialModuleParticlePoint = ({
  size = 1,
  taper = 0, // Tapers down to 0 based on life (start and end)
  rounded = true,
  scaledByDepth = 1.0, // Scales down based on depth
}) => {
  const height = useThree((s) => s.size.height);
  const viewport = useThree((s) => s.viewport);

  const _size = useMemo(() => {
    return Array.isArray(size) ? size : [size, size];
  }, [size]);

  const _taper = useMemo(() => {
    return Array.isArray(taper) ? taper : [taper, taper];
  }, [taper]);

  const defines = useMemo(() => {
    let out = {};
    if (rounded) {
      out.USE_ROUNDED = 1;
    }
    return out;
  }, [rounded]);

  const { material } = useMaterialModule({
    name: 'MaterialModuleParticlePoint',
    defines,
    uniforms: {
      uPointSizeFrom: {
        value: _size[0] * viewport.dpr * (height / targetHeight),
      },
      uPointSizeTo: {
        value: _size[1] * viewport.dpr * (height / targetHeight),
      },
      uPointTaperStart: { value: _taper[0] },
      uPointTaperEnd: { value: _taper[1] },
    },
    vertexShader: {
      setup: /*glsl*/ `
        uniform float uPointSizeFrom;
        uniform float uPointSizeTo;
        uniform float uPointTaperStart;
        uniform float uPointTaperEnd;

      `,
      main: /*glsl*/ `

        // Size
        gl_PointSize = mix(uPointSizeFrom, uPointSizeTo, rand.x);

        // TODO: Scale smaller based on depth (camera near / far)

        // Taper with life
        float taperStart = clamp(crange(vProgress, 0.0, uPointTaperStart, 0., 1.), 0., 1.);
        float taperEnd = clamp(crange(vProgress, 1.0 - uPointTaperEnd, 1.0, 1., 0.), 0., 1.);
        gl_PointSize *= taperStart * taperEnd;
      `,
    },
    fragmentShader: {
      main: /*glsl*/ `
        #ifdef USE_ROUNDED
          if(length(gl_PointCoord - vec2(0.5)) > 0.5) {
            discard;
          }
        #endif
        st = gl_PointCoord;
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uPointSizeFrom.value =
      _size[0] * viewport.dpr * (height / targetHeight);
    material.uniforms.uPointSizeTo.value =
      _size[1] * viewport.dpr * (height / targetHeight);
  }, [material, _size]);

  useEffect(() => {
    material.uniforms.uPointTaperStart.value = _taper[0];
    material.uniforms.uPointTaperEnd.value = _taper[1];
  }, [material, _taper]);

  useEffect(() => {
    if (rounded) {
      material.defines.USE_ROUNDED = 1;
    } else {
      delete material.defines.USE_ROUNDED;
    }
  }, [material, rounded]);

  return <></>;
};
