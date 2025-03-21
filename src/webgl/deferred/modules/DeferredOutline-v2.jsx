import { getUrlBoolean } from '@/helpers/UrlParam';
import Env from '@/helpers/Env';
import { targetHeight } from '@/config';

export const DeferredOutline = forwardRef(
  (
    {
      frequency = 0.05,
      amplitude = 2.0,
      speed = 4,
      thickness = 0.5,
      depthThreshold = 0.0005,
      normalThreshold = 0.07,
      outlineThreshold = 0.5,
      color = 0x000000,
      fps = 4,
      disable = false,
      debug = null, // null | 'depth' | 'normal'
    },
    ref
  ) => {
    const _color = useColor(color);

    const size = useThree((state) => state.size);
    const dpr = useThree((state) => state.viewport.dpr);
    const height = useThree((state) => state.size.height);

    const _thickness = useMemo(() => {
      return thickness * dpr * (height / targetHeight) * 1.25;
    }, [thickness, dpr, size]);

    const { refDeferred, refGbuffer } = useDeferredModule({
      name: 'DeferredOutline',
      uniforms: {
        tOutline: { value: null },
        uDeferredOutline_frequency: {
          value: frequency,
        },
        uDeferredOutline_amplitude: {
          value: amplitude,
        },
        uDeferredOutline_speed: {
          value: speed,
        },
        uDeferredOutline_thickness: {
          value: _thickness,
        },
        uDeferredOutline_depthThreshold: {
          value: depthThreshold,
        },
        uDeferredOutline_normalThreshold: {
          value: normalThreshold,
        },
        uDeferredOutline_outlineThreshold: {
          value: outlineThreshold,
        },
        uDeferredOutline_color: {
          value: _color,
        },
        uDeferredOutline_time: {
          value: 0,
        },
      },
      shaderChunks: {
        setup: /*glsl*/ `
        uniform sampler2D tOutline;
        uniform float uDeferredOutline_frequency;
        uniform float uDeferredOutline_amplitude;
        uniform float uDeferredOutline_speed;
        uniform float uDeferredOutline_thickness;
        uniform float uDeferredOutline_depthThreshold;
        uniform float uDeferredOutline_normalThreshold;
        uniform float uDeferredOutline_outlineThreshold;
        uniform vec3 uDeferredOutline_color;
        uniform float uDeferredOutline_time;


        // Sobel horizontal
        const mat3 Sx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 );

        // Sobel vertical
        const mat3 Sy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 );

        // Laplacian
        const mat3 L = mat3( -1, -1, -1, -1, 8, -1, -1, -1, -1); 

        float luma(vec3 color) {
          const vec3 magic = vec3(0.2125, 0.7154, 0.0721);
          return dot(magic, color);
        }

        

      `,
        pass: /*glsl*/ `

        vec2 texel = vec2( 1.0 / uResolution.x, 1.0 / uResolution.y );

        vec2 outlineUV = vUv;

        // ***********************************************************************************************
        // OUTLINE (DEPTH)
        // ***********************************************************************************************
        float depth00 = readDepth(tDepth, outlineUV + texel * vec2(-1, 1));
        float depth01 = readDepth(tDepth, outlineUV + texel * vec2(-1, 0));
        float depth02 = readDepth(tDepth, outlineUV + texel * vec2(-1, -1));

        float depth10 = readDepth(tDepth, outlineUV + texel * vec2(0, -1));
        float depth11 = readDepth(tDepth, outlineUV + texel * vec2(0, 0));
        float depth12 = readDepth(tDepth, outlineUV + texel * vec2(0, 1));

        float depth20 = readDepth(tDepth, outlineUV + texel * vec2(1, -1));
        float depth21 = readDepth(tDepth, outlineUV + texel * vec2(1, 0));
        float depth22 = readDepth(tDepth, outlineUV + texel * vec2(1, 1));

        float outlineDepth = 
          L[0][0] * depth00 + L[1][0] * depth01 + L[2][0] * depth02 +
          L[0][1] * depth10 + L[1][1] * depth11 + L[2][1] * depth12 +
          L[0][2] * depth20 + L[1][2] * depth21 + L[2][2] * depth22;

        outlineDepth /= 8.; // normalize 0-1
        

        // ***********************************************************************************************
        // NORMAL
        // ***********************************************************************************************
        vec4 normal00t = texture(tNormal, outlineUV + texel * vec2(-1, -1));
        vec4 normal01t = texture(tNormal, outlineUV + texel * vec2(-1, 0));
        vec4 normal02t = texture(tNormal, outlineUV + texel * vec2(-1, 1));
        vec4 normal10t = texture(tNormal, outlineUV + texel * vec2(0, -1));
        vec4 normal11t = texture(tNormal, outlineUV + texel * vec2(0, 0));
        vec4 normal12t = texture(tNormal, outlineUV + texel * vec2(0, 1));
        vec4 normal20t = texture(tNormal, outlineUV + texel * vec2(1, -1));
        vec4 normal21t = texture(tNormal, outlineUV + texel * vec2(1, 0));
        vec4 normal22t = texture(tNormal, outlineUV + texel * vec2(1, 1));

        vec3 normal00 = normalDecode(normal00t.rg);
        vec3 normal01 = normalDecode(normal01t.rg);
        vec3 normal02 = normalDecode(normal02t.rg);

        vec3 normal10 = normalDecode(normal10t.rg);
        vec3 normal11 = normalDecode(normal11t.rg);
        vec3 normal12 = normalDecode(normal12t.rg);

        vec3 normal20 = normalDecode(normal20t.rg);
        vec3 normal21 = normalDecode(normal21t.rg);
        vec3 normal22 = normalDecode(normal22t.rg);

        vec3 outlineNormals = 
          L[0][0] * normal00 + L[1][0] * normal01 + L[2][0] * normal02 +
          L[0][1] * normal10 + L[1][1] * normal11 + L[2][1] * normal12 +
          L[0][2] * normal20 + L[1][2] * normal21 + L[2][2] * normal22;

        outlineNormals /= 16.; // normalize 0-1

        float outlineNormal = max(max(outlineNormals.r, outlineNormals.g), outlineNormals.b);

        





        // DEPTH + NORMAL
        outlineDepth = step(0.001, outlineDepth);
        outlineNormal = step(0.05, outlineNormal);
        float outline = max(outlineDepth, outlineNormal);

        // NOT DISABLED
        #ifndef DEFERRED_OUTLINE_DISABLE
          
          //if(outlineColor.r == 0.) outlineColor = outlineConfig.rgb;
          vec3 outlineFinal = mix(pc_fragColor.rgb, vec3(0.0), outline);
          pc_fragColor.rgb = outlineFinal;
          
        #endif

        // DEBUG NORMAL
        #ifdef DEFERRED_OUTLINE_DEBUG_NORMAL
          // pc_fragColor = vec4(normalDecode(normalConfig.rg), 1.);
          pc_fragColor = vec4(vec3(1.0 - outlineNormal), 1.0);
        #endif

        // DEBUG DEPTH
        #ifdef DEFERRED_OUTLINE_DEBUG_DEPTH
          // float d = readDepth(tDepth, vUv);
          // pc_fragColor = vec4(vec3(d), 1.0);
          pc_fragColor = vec4(vec3(1.0 - outlineDepth), 1.0);
        #endif
        
        // DEBUG OUTLINE
        #ifdef DEFERRED_OUTLINE_DEBUG_OUTLINE
          // pc_fragColor = vec4(outlineConfig.w * normalConfig.w);
          pc_fragColor = vec4(vec3(1.0 - outline), 1.0);
        #endif

        // #ifdef DEFERRED_OUTLINE_DEBUG_OUTLINE_COLOR
        //   pc_fragColor = vec4(outlineConfig.rgb, 1.0);
        // #endif

        // DEBUG WORLD POS
        // #ifdef DEFERRED_OUTLINE_DEBUG_WORLD_POS
        //   pc_fragColor = worldPosition;
        // #endif
      `,
      },
    });

    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_frequency.value = frequency;
    }, [frequency]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_amplitude.value = amplitude;
    }, [amplitude]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_speed.value = speed;
    }, [speed]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_thickness.value =
        _thickness;
    }, [_thickness]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_depthThreshold.value =
        depthThreshold;
    }, [depthThreshold]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_normalThreshold.value =
        normalThreshold;
    }, [normalThreshold]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_outlineThreshold.value =
        outlineThreshold;
    }, [outlineThreshold]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_color.value = _color;
    }, [_color]);

    const defines = useMemo(() => {
      const defines = {};
      if (disable) {
        defines['DEFERRED_OUTLINE_DISABLE'] = true;
      }
      if (debug == 'depth' || getUrlBoolean('depth')) {
        defines['DEFERRED_OUTLINE_DEBUG_DEPTH'] = true;
      }
      if (debug == 'normal' || getUrlBoolean('normal')) {
        defines['DEFERRED_OUTLINE_DEBUG_NORMAL'] = true;
      }
      if (debug == 'worldPos' || getUrlBoolean('worldPos')) {
        defines['DEFERRED_OUTLINE_DEBUG_WORLD_POS'] = true;
      }
      if (debug == 'outline' || getUrlBoolean('outline')) {
        defines['DEFERRED_OUTLINE_DEBUG_OUTLINE'] = true;
      }
      if (debug == 'outline-color' || getUrlBoolean('outline-color')) {
        defines['DEFERRED_OUTLINE_DEBUG_OUTLINE_COLOR'] = true;
      }
      return defines;
    });

    useEffect(() => {
      Object.assign(refDeferred.current.defines, defines);
    }, [defines]);

    useEffect(() => {
      refDeferred.current.uniforms.tOutline.value =
        refGbuffer.current.fbo.textures[2];
    }, [refDeferred, refGbuffer]);

    useFrameFps(
      ({ clock }) => {
        refDeferred.current.uniforms.uDeferredOutline_time.value =
          clock.getElapsedTime();
      },
      null,
      fps
    );

    useImperativeHandle(ref, () => {
      return {
        refDeferred,
        get thickness() {
          return refDeferred.current.uniforms.uDeferredOutline_thickness.value;
        },
        set thickness(val) {
          refDeferred.current.uniforms.uDeferredOutline_thickness.value = val;
        },
      };
    }, [refDeferred]);

    return <></>;
  }
);
