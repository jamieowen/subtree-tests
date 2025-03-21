import {
  ClampToEdgeWrapping,
  Data3DTexture,
  FloatType,
  LinearFilter,
  RedFormat,
  RepeatWrapping,
  Vector3,
} from 'three';
import { urls } from '@/config/assets';
import { useFrame, useThree } from '@react-three/fiber';

import fbm from '@/webgl/glsl/lygia/generative/fbm.glsl';
import range from '@/webgl/glsl/utils/range.glsl';

export const DeferredAtmosphere = forwardRef(
  (
    {
      _key,
      preCompute = false,
      fogColor = '#ffffff',
      fogColor2 = '#ffffff',
      depthInfluence = 0.2,
      // fogSpeed = 0.015,
      fogSpeed = 0.01,
      // frequency = 0.025,
      frequency = 0.025,
      heightFactor = 0.0025,
      // fogDensity = 0.015,
      fogDensity = 0.012,
    },
    ref
  ) => {
    //   const camera = useThree((state) => state.camera);
    if (!_key) console.error('DeferredAtmosphere: _key is required');

    // const tNoise = useAsset(urls.t_rgba_noise_small);
    const tNoise = useAsset(urls.t_noise_rough);
    // const tNoise = useAsset(urls.t_noise);

    const _color1 = useColor(fogColor);
    const _color2 = useColor(fogColor2);

    const { refDeferred, refGbuffer } = useDeferredModule({
      name: 'DeferredAtmosphere',
      uniforms: {
        uAtmosphere_CameraPosition: {
          value: new Vector3(),
        },
        uFogSpeed: {
          value: fogSpeed,
        },
        uFogColor: {
          value: _color1,
        },
        uFogColor2: {
          value: _color2,
        },
        uFogFrequency: {
          value: frequency,
        },
        uFogHeightFactor: {
          value: heightFactor,
        },
        uFogDensity: {
          value: fogDensity,
        },

        uDepthInfluence: {
          value: depthInfluence,
        },

        tNoise: {
          value: tNoise,
        },
      },
      shaderChunks: {
        setup: /*glsl*/ `
        uniform vec3 uAtmosphere_CameraPosition;
        uniform float uFogFrequency;
        uniform float uFogSpeed;
        uniform float uFogHeightFactor;
        uniform float uFogDensity;
        uniform vec3 uFogColor;
        uniform vec3 uFogColor2;
        uniform float uDepthInfluence;
        uniform sampler3D tVolume;
        uniform sampler2D tNoise;

        float noise(vec2 p) {
          return texture2D(tNoise, p*.065).r;
        }

        vec3 noise3(vec2 p) {
          return texture2D(tNoise, p*.01).rgb;
        }

        mat2 rot=mat2(.6,.8,-.8,.6);
        float cheapFbm(vec2 p) {
          float r;
          r  = noise(p)*.5000; p = rot * p * 1.99;
          r += noise(p)*.2500; p = rot * p * 2.01;
          r += noise(p)*.1250; p = rot * p *2.04;
          r += noise(p)*.0625;
          return r/0.9375;
        }

        vec3 pFbm(vec2 p){
          vec3 r;
          r  = noise3(p)*.5000; p=rot*p*1.99;
          r += noise3(p)*.2500; p=rot*p*2.01;
          r += noise3(p)*.1250; p=rot*p*2.04;
          r += noise3(p)*.0625;
          return r/0.9375;
        }

        float fbm(vec3 p) {
          vec2 st = p.xz * p.y;
          vec3 pf = pFbm(st * 10.);
          float v = 0.2 / cheapFbm(pf.xy + vec2(1.,-1.) * .05 * p.y);
          float w = 0.4 / cheapFbm(pf.zx);
          vec3 col = vec3(v*w*w, w*v, w*v);
          col = col / (1. + col);

          return length(col);
        }

        
        ${range}
        
      `,
        pass: /*glsl*/ `
        // https://ijdykeman.github.io/graphics/simple_fog_shader

        vec3 fogOrigin = uAtmosphere_CameraPosition;
        vec3 fogDirection = normalize(worldPosition.xyz - fogOrigin);
        float fogDepth = distance(worldPosition.xyz, fogOrigin);

        // Reduce density for precomputed fbm
        float fogDensity = uFogDensity * 0.8;

        //vec3 noiseSampleCoord = worldPosition.xyz * (uFogFrequency * 2.1) + vec3(uTime * uFogSpeed);
        // FIXME: Noise gets scaled by time
        vec3 noiseSampleCoord = worldPosition.xyz * uFogFrequency * 4.1;


        // OPTION 1: real time noise

        float sample1 = fbm(noiseSampleCoord);
        float noiseSample = sample1;

        // Option 2: precomputed noise
        float depthInfluence = uDepthInfluence;
        fogDepth *= mix(noiseSample, 1.0, clamp((fogDepth - 5000.0) / 5000.0, 1. - depthInfluence, 1.));
        fogDepth *= fogDepth;

        float heightFactor = uFogHeightFactor;

        // FIXME: Not just based on depth, move atmosphere around sparingly
        float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
            1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
        fogFactor = clamp(fogFactor, 0., 1.);

        vec3 fogColor = mix(uFogColor, uFogColor2, sample1);     

        gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);

        //gl_FragColor.rgb = vec3(noiseSample);
      `,
      },
    });

    const _v = useMemo(() => new Vector3(), []);

    useFrame(({ camera }) => {
      camera.getWorldPosition(_v);
      refDeferred.current.uniforms.uAtmosphere_CameraPosition.value.copy(_v);
    });

    useImperativeHandle(
      ref,
      () => ({
        get fogSpeed() {
          return refDeferred.current.uniforms.uFogSpeed.value;
        },
        set fogSpeed(val) {
          refDeferred.current.uniforms.uFogSpeed.value = val;
        },
        get frequency() {
          return refDeferred.current.uniforms.uFogFrequency.value;
        },
        set frequency(val) {
          refDeferred.current.uniforms.uFogFrequency.value = val;
        },
        get heightFactor() {
          return refDeferred.current.uniforms.uFogHeightFactor.value;
        },
        set heightFactor(val) {
          refDeferred.current.uniforms.uFogHeightFactor.value = val;
        },
        get fogDensity() {
          return refDeferred.current.uniforms.uFogDensity.value;
        },
        set fogDensity(val) {
          refDeferred.current.uniforms.uFogDensity.value = val;
        },
      }),
      [refDeferred]
    );

    useEffect(() => {
      refDeferred.current.uniforms.uFogSpeed.value = fogSpeed;
      refDeferred.current.uniforms.uFogFrequency.value = frequency;
      refDeferred.current.uniforms.uFogHeightFactor.value = heightFactor;
      refDeferred.current.uniforms.uFogDensity.value = fogDensity;
    }, [fogSpeed, frequency, heightFactor, fogDensity]);

    return null;
  }
);
