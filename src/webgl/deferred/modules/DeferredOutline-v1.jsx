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
      normalThreshold = 0.8,
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
        uniform float uDeferredOutline_normalThreshold;
        uniform float uDeferredOutline_outlineThreshold;
        uniform vec3 uDeferredOutline_color;
        uniform float uDeferredOutline_time;

        const mat3 Sx = mat3( -1, -2, -1, 0, 0, 0, 1, 2, 1 );
        const mat3 Sy = mat3( -1, 0, 1, -2, 0, 2, -1, 0, 1 );

        float luma(vec3 color) {
          const vec3 magic = vec3(0.2125, 0.7154, 0.0721);
          return dot(magic, color);
        }

        vec4 radialBlur( sampler2D map, vec2 uv, float size, vec2 resolution, float quality ) {
          vec3 color = vec3(0.);
          float w = 0.;

          const float pi2 = 3.141596 * 2.0;
          const float direction = 8.0;

          vec2 radius = size / resolution;
          float test = 1.0;

          for ( float d = 0.0; d < pi2 ; d += pi2 / direction ) {
              vec2 t = radius * vec2( cos(d), sin(d));
              for ( float i = 1.0; i <= 100.0; i += 1.0 ) {
                  if (i >= quality) break;
                  vec4 cc = texture2D( map, uv + t * i / quality );
                  color += cc.rgb;
                  w = cc.w;
              }
          }

          return vec4(color / ( quality * direction), w);
      }
      `,
        pass: /*glsl*/ `

        vec2 texel = vec2( 1.0 / uResolution.x, 1.0 / uResolution.y );


        // OUTLINE THICKNESS
        float outlineThickness = uDeferredOutline_thickness * pow(depth, 0.1);

        // OUTLINE DISPLACEMENT
        // https://tympanus.net/codrops/2022/11/29/sketchy-pencil-effect-with-three-js-post-processing/
        vec2 displacement = vec2(
          (hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * uDeferredOutline_frequency + uDeferredOutline_time * uDeferredOutline_speed)),
          (hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * uDeferredOutline_frequency + uDeferredOutline_time * uDeferredOutline_speed))
        ) * (uDeferredOutline_amplitude) / uResolution.xy;
        // displacement *= pow(depth, 2.);


        // ***********************************************************************************************
        // OUTLINE CONFIG
        // ***********************************************************************************************
        //vec2 scaledUV = scaleUV(vUv, vec2(1. + 0.01), vec2(0.));
        vec4 outlineConfig = texture(tOutline, vUv);

        vec2 outlineUV = vUv + displacement;
        vec2 thicknessTexel = outlineThickness * texel;
        

        // COLORED OUTLINE
        // vec4 outline00 = texture(tOutline, outlineUV + thicknessTexel * vec2(-1, -1));
        // vec4 outline01 = texture(tOutline, outlineUV + thicknessTexel * vec2(-1, 0));
        // vec4 outline02 = texture(tOutline, outlineUV + thicknessTexel * vec2(-1, 1));
        // vec4 outline10 = texture(tOutline, outlineUV + thicknessTexel * vec2(0, -1));
        // vec4 outline11 = texture(tOutline, outlineUV + thicknessTexel * vec2(0, 0));
        // vec4 outline12 = texture(tOutline, outlineUV + thicknessTexel * vec2(0, 1));
        // vec4 outline20 = texture(tOutline, outlineUV + thicknessTexel * vec2(1, -1));
        // vec4 outline21 = texture(tOutline, outlineUV + thicknessTexel * vec2(1, 0));
        // vec4 outline22 = texture(tOutline, outlineUV + thicknessTexel * vec2(1, 1));

        // vec3 sobelOutlineColorX = outline00.rgb * Sx[0][0] + outline01.rgb * Sx[1][0] + outline02.rgb * Sx[2][0] +
        //               outline10.rgb * Sx[0][1] + outline11.rgb * Sx[1][1] + outline12.rgb * Sx[2][1] +
        //               outline20.rgb * Sx[0][2] + outline21.rgb * Sx[1][2] + outline22.rgb * Sx[2][2];

        // vec3 sobelOutlineColorY = outline00.rgb * Sy[0][0] + outline01.rgb * Sy[1][0] + outline02.rgb * Sy[2][0] +
        //               outline10.rgb * Sy[0][1] + outline11.rgb * Sy[1][1] + outline12.rgb * Sy[2][1] +
        //               outline20.rgb * Sy[0][2] + outline21.rgb * Sy[1][2] + outline22.rgb * Sy[2][2];

        // vec3 outlineColor = sqrt(sobelOutlineColorX * sobelOutlineColorX + sobelOutlineColorY * sobelOutlineColorY);

        // // OUTLINE DEPTH??
        // float outline00w = luma(vec3(outline00.w));
        // float outline01w = luma(vec3(outline01.w));
        // float outline02w = luma(vec3(outline02.w));

        // float outline10w = luma(vec3(outline10.w));
        // float outline11w = luma(vec3(outline11.w));
        // float outline12w = luma(vec3(outline12.w));

        // float outline20w = luma(vec3(outline20.w));
        // float outline21w = luma(vec3(outline21.w));
        // float outline22w = luma(vec3(outline22.w));

        // float xSobelOutlineW = 
        //   Sx[0][0] * outline00w + Sx[1][0] * outline10w + Sx[2][0] * outline20w +
        //   Sx[0][1] * outline01w + Sx[1][1] * outline11w + Sx[2][1] * outline21w +
        //   Sx[0][2] * outline02w + Sx[1][2] * outline12w + Sx[2][2] * outline22w;

        // float ySobelOutlineW = 
        //   Sy[0][0] * outline00w + Sy[1][0] * outline10w + Sy[2][0] * outline20w +
        //   Sy[0][1] * outline01w + Sy[1][1] * outline11w + Sy[2][1] * outline21w +
        //   Sy[0][2] * outline02w + Sy[1][2] * outline12w + Sy[2][2] * outline22w;

        // float outlineDepth = sqrt(xSobelOutlineW * xSobelOutlineW + ySobelOutlineW * ySobelOutlineW);
        
        // float depthOutlineEnabled = outlineConfig.w;
        // depthOutlineEnabled -= gradientOutlineW;
        // depthOutlineEnabled = step(0.5, depthOutlineEnabled);


        // OUTLINE COLOR
        // vec4 outlineColor = vec4(uDeferredOutline_color, 1.0);
        // vec3 outlineColor = outlineConfig.rgb;
        vec3 outlineColor = uDeferredOutline_color.rgb;

        // ***********************************************************************************************
        // NORMAL OUTLINE ENABLE
        // ***********************************************************************************************
        vec4 normal00t = texture(tNormal, outlineUV + thicknessTexel * vec2(-1, -1));
        vec4 normal01t = texture(tNormal, outlineUV + thicknessTexel * vec2(-1, 0));
        vec4 normal02t = texture(tNormal, outlineUV + thicknessTexel * vec2(-1, 1));
        vec4 normal10t = texture(tNormal, outlineUV + thicknessTexel * vec2(0, -1));
        vec4 normal11t = texture(tNormal, outlineUV + thicknessTexel * vec2(0, 0));
        vec4 normal12t = texture(tNormal, outlineUV + thicknessTexel * vec2(0, 1));
        vec4 normal20t = texture(tNormal, outlineUV + thicknessTexel * vec2(1, -1));
        vec4 normal21t = texture(tNormal, outlineUV + thicknessTexel * vec2(1, 0));
        vec4 normal22t = texture(tNormal, outlineUV + thicknessTexel * vec2(1, 1));

        float normal00w = luma(vec3(normal00t.w));
        float normal01w = luma(vec3(normal01t.w));
        float normal02w = luma(vec3(normal02t.w));

        float normal10w = luma(vec3(normal10t.w));
        float normal11w = luma(vec3(normal11t.w));
        float normal12w = luma(vec3(normal12t.w));

        float normal20w = luma(vec3(normal20t.w));
        float normal21w = luma(vec3(normal21t.w));
        float normal22w = luma(vec3(normal22t.w));

        float xSobelNormalW = 
          Sx[0][0] * normal00w + Sx[1][0] * normal10w + Sx[2][0] * normal20w +
          Sx[0][1] * normal01w + Sx[1][1] * normal11w + Sx[2][1] * normal21w +
          Sx[0][2] * normal02w + Sx[1][2] * normal12w + Sx[2][2] * normal22w;

        float ySobelNormalW = 
          Sy[0][0] * normal00w + Sy[1][0] * normal10w + Sy[2][0] * normal20w +
          Sy[0][1] * normal01w + Sy[1][1] * normal11w + Sy[2][1] * normal21w +
          Sy[0][2] * normal02w + Sy[1][2] * normal12w + Sy[2][2] * normal22w;

        float gradientNormalW = sqrt(xSobelNormalW * xSobelNormalW + ySobelNormalW * ySobelNormalW);
        vec4 normalConfig = normal11t;
        // float normalOutlineEnabled = normalConfig.w;
        float normalOutlineEnabled = 1.0;
        normalOutlineEnabled -= gradientNormalW;
        normalOutlineEnabled = step(0.5, normalOutlineEnabled);

        // ***********************************************************************************************
        // OUTLINE (DEPTH)
        // ***********************************************************************************************
        float depth00 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(-1, 1));
        float depth01 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(-1, 0));
        float depth02 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(-1, -1));

        float depth10 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(0, -1));
        float depth11 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(0, 0));
        float depth12 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(0, 1));

        float depth20 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(1, -1));
        float depth21 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(1, 0));
        float depth22 = readDepth(tDepth, outlineUV + thicknessTexel * vec2(1, 1));

        float xSobelValueDepth = 
          Sx[0][0] * depth00 + Sx[1][0] * depth01 + Sx[2][0] * depth02 +
          Sx[0][1] * depth10 + Sx[1][1] * depth11 + Sx[2][1] * depth12 +
          Sx[0][2] * depth20 + Sx[1][2] * depth21 + Sx[2][2] * depth22;

        float ySobelValueDepth = 
          Sy[0][0] * depth00 + Sy[1][0] * depth01 + Sy[2][0] * depth02 +
          Sy[0][1] * depth10 + Sy[1][1] * depth11 + Sy[2][1] * depth12 +
          Sy[0][2] * depth20 + Sy[1][2] * depth21 + Sy[2][2] * depth22;

        float gradientDepth = sqrt(xSobelValueDepth * xSobelValueDepth + ySobelValueDepth * ySobelValueDepth);

        // ***********************************************************************************************
        // OUTLINE NORMAL
        // ***********************************************************************************************
        float normal00 = luma(normalDecode(normal00t.rg));
        float normal01 = luma(normalDecode(normal01t.rg));
        float normal02 = luma(normalDecode(normal02t.rg));

        float normal10 = luma(normalDecode(normal10t.rg));
        float normal11 = luma(normalDecode(normal11t.rg));
        float normal12 = luma(normalDecode(normal12t.rg));

        float normal20 = luma(normalDecode(normal20t.rg));
        float normal21 = luma(normalDecode(normal21t.rg));
        float normal22 = luma(normalDecode(normal22t.rg));

        float xSobelNormal = 
          Sx[0][0] * normal00 + Sx[1][0] * normal10 + Sx[2][0] * normal20 +
          Sx[0][1] * normal01 + Sx[1][1] * normal11 + Sx[2][1] * normal21 +
          Sx[0][2] * normal02 + Sx[1][2] * normal12 + Sx[2][2] * normal22;

        float ySobelNormal = 
          Sy[0][0] * normal00 + Sy[1][0] * normal10 + Sy[2][0] * normal20 +
          Sy[0][1] * normal01 + Sy[1][1] * normal11 + Sy[2][1] * normal21 +
          Sy[0][2] * normal02 + Sy[1][2] * normal12 + Sy[2][2] * normal22;

        float gradientNormal = sqrt(xSobelNormal * xSobelNormal + ySobelNormal * ySobelNormal);
        float outline = 0.;
        
        outline += (gradientDepth * 25.0) * 1.0;
        gradientNormal *= normalOutlineEnabled;
        if (gradientNormal > uDeferredOutline_normalThreshold) outline += gradientNormal;

        // Enable/Disable outline
        // float enableOutline = texture(tNormal, vUv).w;

        // NOT DISABLED
        #ifndef DEFERRED_OUTLINE_DISABLE
          
          //if(outlineColor.r == 0.) outlineColor = outlineConfig.rgb;
          vec3 outlineFinal = mix(pc_fragColor.rgb, outlineColor, step(uDeferredOutline_outlineThreshold, outline));
          pc_fragColor.rgb = outlineFinal;
          
        #endif

        // DEBUG NORMAL
        #ifdef DEFERRED_OUTLINE_DEBUG_NORMAL
          pc_fragColor = vec4(normalDecode(normalConfig.rg), 1.);
        #endif

        // DEBUG DEPTH
        #ifdef DEFERRED_OUTLINE_DEBUG_DEPTH
          float d = readDepth(tDepth, vUv);
          pc_fragColor = vec4(vec3(d), 1.0);
        #endif
        
        // DEBUG OUTLINE
        // #ifdef DEFERRED_OUTLINE_DEBUG_OUTLINE
        //   pc_fragColor = vec4(outlineConfig.w * normalConfig.w);
        // #endif

        // #ifdef DEFERRED_OUTLINE_DEBUG_OUTLINE_COLOR
        //   pc_fragColor = vec4(outlineConfig.rgb, 1.0);
        // #endif

        // DEBUG WORLD POS
        #ifdef DEFERRED_OUTLINE_DEBUG_WORLD_POS
          // pc_fragColor = texture(tWorldPos, vUv);
          pc_fragColor = worldPosition;
        #endif
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
