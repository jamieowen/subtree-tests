import { getUrlBoolean } from '@/helpers/UrlParam';
import Env from '@/helpers/Env';
import { targetHeight } from '@/config';
import blendDarken from '@/webgl/glsl/lygia/color/blend/darken.glsl';

export const DeferredOutline = forwardRef(
  (
    {
      frequency = 0.05,
      amplitude = 2.0,
      speed = 4,
      thickness = 1,
      depthThreshold = 0.001,
      normalThreshold = 0.1,
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
      return thickness;
      // return Math.min(
      //   Math.ceil(thickness * dpr * (height / targetHeight) * 1),
      //   2
      // );
      // return Math.min(Math.ceil(thickness * dpr), 3);
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

        ${blendDarken}

        

      `,
        pass: /*glsl*/ `


        vec2 displacement = vec2(
          (hash(gl_FragCoord.xy) * sin(gl_FragCoord.y * uDeferredOutline_frequency + uDeferredOutline_time * uDeferredOutline_speed)),
          (hash(gl_FragCoord.xy) * cos(gl_FragCoord.x * uDeferredOutline_frequency + uDeferredOutline_time * uDeferredOutline_speed))
        ) * (uDeferredOutline_amplitude) / uResolution.xy;

        // EDGE DETECTION
        // Circle brush
        // https://www.youtube.com/watch?v=Ptuw9mxekh0
        vec2 kernelUV = vUv;
        vec2 texel = vec2( 1.0 / uResolution.x, 1.0 / uResolution.y );
        vec2 pixelUv = vec2(0.);



        float KERNEL_SIZE = uDeferredOutline_thickness * 2.0 + 1.0; // 3x3 is the equivalent of 1px thickness)
        float HALF_KERNEL_SIZE = floor(KERNEL_SIZE / 2.0);
        float HALF_KERNEL_SIZE_SQ = KERNEL_SIZE * KERNEL_SIZE / 4.0;
        float CenterWeight = 0.;

        vec3 LaplacianFilter_Normal = vec3(0.);
        float LaplacianFilter_Depth = 0.0;

        float centerDepth = readDepth(tDepth, kernelUV);
        float closestDepth = centerDepth;

        vec3 outlineColor = texture(tOutline, kernelUV).rgb;

        for (float y = -HALF_KERNEL_SIZE; y <= HALF_KERNEL_SIZE; y++) {
          for (float x = -HALF_KERNEL_SIZE; x <= HALF_KERNEL_SIZE; x++) {

            if (x * x + y * y > HALF_KERNEL_SIZE_SQ) {
              continue;
            }

            CenterWeight++;

            pixelUv = kernelUV + texel * vec2(x, y);
            LaplacianFilter_Normal -= normalDecode(texture(tNormal, pixelUv).rg);
            float pixelDepth = readDepth(tDepth, pixelUv);
            LaplacianFilter_Depth -= pixelDepth;

            if (pixelDepth < closestDepth) {
              closestDepth = pixelDepth;
              outlineColor = texture(tOutline, pixelUv).rgb;
            }
          }
        }

        // Center Weight
        LaplacianFilter_Normal += normalDecode(texture(tNormal, kernelUV).rg) * CenterWeight;
        LaplacianFilter_Depth += centerDepth * CenterWeight;

        // Normalize
        CenterWeight--;
        CenterWeight = 1.0 / CenterWeight;
        LaplacianFilter_Normal *= CenterWeight;
        LaplacianFilter_Depth *= CenterWeight;

        float outlineNormal = max(max(LaplacianFilter_Normal.r, LaplacianFilter_Normal.g), LaplacianFilter_Normal.b);
        // outlineNormal = pow(outlineNormal, 0.1);
        float outlineDepth = LaplacianFilter_Depth;




        // DEPTH + NORMAL
        outlineNormal = step(uDeferredOutline_normalThreshold, outlineNormal);
        outlineDepth = step(uDeferredOutline_depthThreshold, outlineDepth);
        float outline = max(outlineNormal, outlineDepth);



        // NOT DISABLED
        // vec3 outlineColor = texture(tOutline, vUv).rgb;
        // vec3 outlineColor = uDeferredOutline_color;
        #ifndef DEFERRED_OUTLINE_DISABLE
          vec3 outlineFinal = mix(pc_fragColor.rgb, outlineColor, outline);
          pc_fragColor.rgb = outlineFinal;
          
        #endif

        // DEBUG NORMAL
        #ifdef DEFERRED_OUTLINE_DEBUG_NORMAL
          pc_fragColor = vec4(normalDecode(texture(tNormal, kernelUV).rg), 1.);
        #endif

        // DEBUG DEPTH
        #ifdef DEFERRED_OUTLINE_DEBUG_DEPTH
          float d = readDepth(tDepth, vUv);
          pc_fragColor = vec4(vec3(d), 1.0);
        #endif
        
        // DEBUG OUTLINE
        #ifdef DEFERRED_OUTLINE_DEBUG_NORMAL_OUTLINE
          pc_fragColor = vec4(mix(vec3(1.0), outlineColor, outlineNormal), 1.0);
        #endif
        #ifdef DEFERRED_OUTLINE_DEBUG_DEPTH_OUTLINE
          pc_fragColor = vec4(mix(vec3(1.0), outlineColor, outlineDepth), 1.0);
        #endif
        #ifdef DEFERRED_OUTLINE_DEBUG_OUTLINE
          pc_fragColor = vec4(mix(vec3(1.0), outlineColor, outline), 1.0);
        #endif
        #ifdef DEFERRED_OUTLINE_DEBUG_OUTLINE_COLOR
          pc_fragColor = texture(tOutline, vUv);
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
      refDeferred.current.uniforms.uDeferredOutline_depthThreshold.value =
        depthThreshold;
    }, [depthThreshold]);
    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_normalThreshold.value =
        normalThreshold;
    }, [normalThreshold]);

    useEffect(() => {
      refDeferred.current.uniforms.uDeferredOutline_color.value = _color;
    }, [_color]);

    useEffect(() => {
      refDeferred.current.uniforms.tOutline = {
        value: refGbuffer.current.fbo.textures[2],
      };
    });

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
      if (debug == 'depthOutline' || getUrlBoolean('depthOutline')) {
        defines['DEFERRED_OUTLINE_DEBUG_DEPTH_OUTLINE'] = true;
      }
      if (debug == 'normalOutline' || getUrlBoolean('normalOutline')) {
        defines['DEFERRED_OUTLINE_DEBUG_NORMAL_OUTLINE'] = true;
      }
      if (debug == 'outlineColor' || getUrlBoolean('outlineColor')) {
        defines['DEFERRED_OUTLINE_DEBUG_OUTLINE_COLOR'] = true;
      }
      if (debug == 'outline' || getUrlBoolean('outline')) {
        defines['DEFERRED_OUTLINE_DEBUG_OUTLINE'] = true;
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
        if (!refDeferred?.current?.uniforms?.uDeferredOutline_time) return;
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
