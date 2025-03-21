export const BaseNormalMaterial = forwardRef(
  (
    {
      map,
      color = new Color(0, 0, 0),
      drawNormal = 1,
      // drawWorld = 0,
      opacity = 1,
      ...props
    },
    ref
  ) => {
    const _color = useColor(color);

    const materialProps = useMemo(() => {
      return {
        vertexShader: /*glsl*/ `
        varying vec2 vUv;
        varying vec3 vNormal;
        // varying vec3 vWorldPos;

        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
          vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
          // vWorldPos = vec3(modelMatrix * vec4(position, 1.0));
        }
      `,
        fragmentShader: /*glsl*/ `
        varying vec2 vUv;
        varying vec3 vNormal;
        // varying vec3 vWorldPos;

        uniform sampler2D tMap;
        uniform vec3 uColor;
        uniform float uOpacity;

        layout(location = 1) out vec4 gNormal;

        void main() {
            #ifdef HAS_MAP
              vec4 color = texture2D(tMap, vUv);
              pc_fragColor = color;
            #else
              pc_fragColor = vec4(uColor, uOpacity);
            #endif
            
            #ifdef DRAW_NORMAL
              gNormal = vec4(vNormal, 1.0);
            #else 
              gNormal = vec4(vNormal, 0.0);
            #endif

            if (pc_fragColor.a < 0.5) {
              discard;
            }
        }
      `,
        uniforms: {
          tMap: { value: map },
          uColor: { value: _color },
          uOpacity: { value: opacity },
        },
        defines: {
          HAS_MAP: !!map,
          DRAW_NORMAL: drawNormal,
          // DRAW_WORLD: drawWorld,
        },
      };
    });

    useEffect(() => {
      materialProps.uniforms.tMap.value = map;
    }, [map]);
    useEffect(() => {
      materialProps.uniforms.uColor.value = _color;
    }, [_color]);
    useEffect(() => {
      materialProps.uniforms.uOpacity.value = opacity;
    }, [opacity]);

    return (
      <shaderMaterial
        ref={ref}
        {...materialProps}
        {...props}
        // colorWrite={false}
        // visible={false}
      />
    );
  }
);
