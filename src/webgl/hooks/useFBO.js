export function useFBO(width, height, settings = {}) {
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);
  const _width = typeof width === 'number' ? width : size.width * viewport.dpr;
  const _height =
    typeof height === 'number' ? height : size.height * viewport.dpr;
  const _settings =
    typeof width === 'number'
      ? settings
      : width || { samples: 0, depth: false };
  const { samples = 0, depth, ...targetSettings } = _settings;

  console.log('settings', _settings);
  // const samples = _settings.samples || 0;
  // const depth = !!_settings.depth;

  const target = useMemo(() => {
    const target = new WebGLRenderTarget(_width, _height, {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      type: HalfFloatType,
      ...targetSettings,
    });

    if (depth) {
      target.depthTexture = new DepthTexture(_width, _height, FloatType);
    }

    target.samples = samples;
    return target;
  }, []);

  // useLayoutEffect(() => {
  //   target.setSize(_width, _height);
  //   if (samples) target.samples = samples;
  // }, [samples, target, _width, _height]);

  useEffect(() => {
    return () => target.dispose();
  }, []);

  return target;
}
