import { RepeatWrapping } from 'three';
import { urls } from '@/config/assets';
import { useThree } from '@react-three/fiber';

export const DeferredSSAO = ({
  randomSize = 1,
  scale = 0.1,
  bias = 0.01,
  samplingRadius = 0.01,
  aoIntensity = 1,
  iterations = 4,
}) => {
  const tRandom = useAsset(urls.t_ao_random_normal);

  const camera = useThree((state) => state.camera);

  useDeferredModule({
    name: 'DeferredSSAO',
    uniforms: {
      // 64 x 64 random texture
      tRandom: {
        value: tRandom,
      },
      uRandomSize: {
        // value: 64,
        value: randomSize,
      },
      // Scales distance between occluders and occludee.
      uScale: {
        value: scale,
      },
      // Controls the width of the occlusion cone considered by the occludee.
      uBias: {
        value: bias,
      },
      // The sampling radius.
      uSamplingRadius: {
        value: samplingRadius,
      },
      uAOIntensity: {
        value: aoIntensity,
      },
      //   uCameraFar: {
      //     value: camera.far,
      //   },
    },
    shaderChunks: {
      setup: /*glsl*/ `

        uniform sampler2D tRandom;
        uniform float uRandomSize;
        uniform float uSamplingRadius; 
        uniform float uAOIntensity; 
        uniform float uScale; 
        uniform float uBias; 

        

        // DOC: 
        // https://www.gamedev.net/tutorials/_/technical/graphics-programming-and-theory/a-simple-and-practical-approach-to-ssao-r2753/

        vec3 getPosition(in vec2 uv) {
            return readWorldPosFromDepth(tDepth, uv).xyz;
            // return texture2D(tWorldPos, uv).xyz;
            // return normalize((texture2D(tWorldPos, uv).xyz * 2.0) - 1.0);
        }

        vec3 getNormal(in vec2 uv) {
            //return normalize((texture2D(tNormal, uv).xyz * 2.0) - 1.0);

            // return texture2D(tNormal, uv).xyz;
            // return vec3(0.);
            // return texture2D(tNormal, uv).xyz;
            return normalDecode(texture2D(tNormal, uv).xy);
        }

        vec2 getRandom(in vec2 uv) {
            // g_screen_size * uv / random_size).xy * 2.0f - 1.0f
            return normalize(texture2D(tRandom, uResolution * uv / uRandomSize).xy * 2.0 - 1.0);
        }
        // highp float getRandom(highp vec2 coords) {
        //     return fract(sin(dot(coords.xy, vec2(12.9898,78.233))) * 43758.5453);
        // }

        float doAmbientOcclusion(in vec2 tcoord, in vec2 uv, in vec3 p, in vec3 cnorm) {
            vec3 diff = getPosition(tcoord + uv) - p; 
            vec3 v = normalize(diff); 
            float d = length(diff) * uScale; 
            return max(0.0, dot(cnorm, v) - uBias) * (1.0 / (1.0 + d)) * uAOIntensity;
        }
      `,
      pass: /*glsl*/ `
        // To gather occlusion, 
        // Use 4 samples (<1,0>,<-1,0>,<0,1>,<0,-1>) rotated at 45* and 90*, and reflected using a random normal texture. 
        // Some tricks can be applied to accelerate the calculations: you can use half-sized position and normal buffers, 
        // or you can also apply a bilateral blur to the resulting SSAO buffer to hide sampling artifacts if you wish. 
        // Note that these two techniques can be applied to any SSAO algorithm.
        vec2 vec[4] = vec2[4](vec2(1,0), vec2(-1,0), vec2(0,1), vec2(0,-1));
        vec3 p = worldPosition.xyz; 
        vec3 n = getNormal(vUv); 
        // vec2 rand = getRandom(vUv); 
        // float rand = getRandom(vUv); 
        vec2 rand = getRandom(vUv); 
        
        // Supposed to be p.z but gave artefacts
        // Rather based on length from 0,0,0
        // float intensity = length(p);
        float intensity = p.z;
        float rad = (uSamplingRadius * intensity) / intensity;
        

        // TODO: Iterations based on camera far clipping plane
        int iterations = ${iterations}; 
        // int iterations = int(mix(0.0, 10.0, p.z / uCameraFar));
        
        for (int j = 0; j < iterations; ++j) {
            // vec2 reflVec = mix(n.xz, vec2(rand), n.y);
            //vec2 reflVec = vec2(rand);
            // vec2 reflVec = n.xz;
            vec2 coord1 = reflect(vec[j], rand) * rad;    
            // vec2 coord1 = reflect(vec[j], n.xz) * rad;
            float cd = 0.707;
            vec2 coord2 = vec2(coord1.x * cd - coord1.y * cd, coord1.x * cd + coord1.y * cd);

            ao += doAmbientOcclusion(vUv, coord1 * 0.25, p, n); 
            ao += doAmbientOcclusion(vUv, coord2 * 0.5, p, n);
            ao += doAmbientOcclusion(vUv, coord1 * 0.75, p, n);
            ao += doAmbientOcclusion(vUv, coord2, p, n);
        }
    
        ao /= float(iterations * 4); 
        ao = 1. - ao;

      `,
    },
  });

  return null;
};
