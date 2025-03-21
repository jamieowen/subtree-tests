export const MaterialModuleOutline2 = memo(
  ({ normal = true, depth = true, color = 0x000000 }) => {
    const _color = useColor(color);

    const camera = useThree((state) => state.camera);

    const { material } = useMaterialModule({
      name: 'MaterialModuleOutline',
      uniforms: {
        uOutline_normal: { value: normal ? 1.0 : 0.0 },
        uOutline_depth: { value: depth ? 1.0 : 0.0 },
        uOutline_color: { value: _color },
        uCameraNear: { value: camera.near },
        uCameraFar: { value: camera.far },
      },

      fragmentShader: {
        setup: /*glsl*/ `
          uniform float uOutline_normal;
          uniform float uOutline_depth;
          uniform vec3 uOutline_color;

          uniform float uCameraNear;
          uniform float uCameraFar;

          varying float vDepth;


          float linearizeDepth(float depth) {
              float z = depth * 2.0 - 1.0; // Back to NDC
              return (2.0 * uCameraNear * uCameraFar) / (uCameraFar + uCameraNear - z * (uCameraFar - uCameraNear));
          }

          layout(location = 2) out vec4 gOutline;
      `,
        main: /*glsl*/ `
          // Retrieve the non-linear depth value
          float depth = gl_FragCoord.z;

          // Convert to linear depth
          float linearDepth = linearizeDepth(depth);
          float distanceToCamera = 1.0 / gl_FragCoord.w;

          // float d = range(depth, uCameraNear, uCameraFar, 0., 1.);

          gNormal.a = uOutline_normal;
          gOutline = vec4(uOutline_color, depth);
      `,
      },
    });

    useEffect(() => {
      let uniforms = material.uniforms;
      uniforms.uOutline_normal.value = normal ? 1.0 : 0.0;
      uniforms.uOutline_depth.value = depth ? 1.0 : 0.0;
      uniforms.uOutline_color.value = _color;
    }, [material, normal, depth, _color]);

    return <></>;
  }
);
