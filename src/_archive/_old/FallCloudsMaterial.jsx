import { urls } from '@/config/assets';
import { map } from '@/helpers/MathUtils';
import { useEffect, useMemo } from 'react';

import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
import quaternion from '@/webgl/glsl/utils/quaternion.glsl';
import transformUV from '@/webgl/glsl/utils/transformUV.glsl';

import { useFrame, useThree } from '@react-three/fiber';
import { Vector2 } from 'three';

export default function FallCloudsMaterial({
  speed = 0.01,
  alpha = 1,
  intensity = 0.01,
  layer,
}) {
  const [seed] = useState(Math.random());
  const size = useThree((state) => state.size);
  const viewport = useThree((state) => state.viewport);

  const minSpeed = 0.06;
  const maxSpeed = 0.08;

  const tNoise = useTexture(urls.t_noise);

  const getMouse = useMouse2();

  const shader = useMemo(
    () => ({
      vertexShader: baseVert,
      fragmentShader: /*glsl*/ `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        varying vec3 vPosition;

        uniform float uTime;
        uniform float uSpeed;
        uniform sampler2D tFlowMap;
        uniform sampler2D tNoise;
        uniform sampler3D tVolume;
        uniform vec2 uResolution;
        uniform vec2 uMouse;

        float scale = 1.125;
        // float speed = ${ensureShaderFloat(speed)} * 0.25;
        float speed = ${ensureShaderFloat(speed)} * 0.25;
        
        vec3 direction = vec3(1,1,4);
        float distortion = 0.3;
        float layers = 3.;
        float shades = 4.;

        const float PI = 3.141592;

        layout(location = 1) out vec4 gNormal;

        float gyroid (vec3 seed) { 
         return dot(sin(seed),cos(seed.yzx)); 
          //return dot(sin(seed),cos(seed.xyz)); 
        }

        float fbm (vec3 seed) {
            float result = 0., a = .5;
            for (int i = 0; i < 7; ++i, a /= 2.) {		
                seed += direction * uTime * speed*.01/a;
                
                float cloudMovement = .001;
                seed.z += uTime * cloudMovement;
                seed.z += result*distortion;                
                
                result += gyroid(seed/a)*a;
            }
            return result;
        }

		    ${transformUV}
        ${quaternion}

        void main() {
          // Step 1: uv to object coords
          vec3 pos = vPosition;

          float angleInfluence = -2.;
          float fov = 0.1;
          

          // Bigger value means smaller circle
          float innerRadius = 0.1;
          
          // Step 2: add z by 0.5 (0.5 too high, add 0.05 instead)
          // Lower value means clouds rotate more
          pos.z += fov;

          // Step 3: normalize
          pos = normalize(pos);
          
          // Step 4: animate z offset (subtract)
          pos.z += uTime * uSpeed;
          
          // float angle = (1. - length(pos)) + (uTime * 0.00001);
          float angle = (1. - length(pos));
          
          vec4 q = quatFromAxisAngle(vec3(0., 0., 1.), angle * angleInfluence);
          vec3 rotated = rotateVectorByQuaternion(q, pos);

          float shape = fbm(rotated * 0.8);

          float gradient = fract(shape * layers);
          float shade = round(gradient * shades) / shades;

          float border = pow(shade, 40.);  
          float shade2 = round(pow(gradient, 2.) * shades) / shades;
          shade2 = 1. - pow(shade2, 10.);
          
          vec3 tint = vec3(0.318, 0.506, 0.545);
          vec3 tint2 = vec3(0.627);
          vec3 color = mix(tint * gradient, tint2, shade);
          vec3 borderColor = vec3(0.0784, 0.141, 0.459) * 0.2;
          //color = mix(color, vec3(shade2), shade2);

          
          float intensity = (${ensureShaderFloat(intensity)});
          float a = step(intensity, shade);

          float l = length(pos.xy) + innerRadius;
          l -= shape * shade;
          // l = pow(smoothstep(0.5, 0.6, l), 4.);
          l = pow(smoothstep(0.55, 0.6, l), 4.);

          pc_fragColor = vec4(color, a * l);
          //pc_fragColor = vec4(vec3(l), 1.);
          
          
        }
      `,
      uniforms: {
        uTime: {
          value: 0,
        },

        tNoise: {
          value: tNoise,
        },

        uSpeed: {
          value: minSpeed,
        },

        uResolution: {
          value: new Vector2(),
        },
        uMouse: {
          value: new Vector2(),
        },
      },
      //blending: SubtractiveBlending,
      transparent: true,
      depthWrite: false,
    }),
    []
  );

  useEffect(() => {
    shader.uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size, viewport]);

  useToggleEventAnimation({
    inParams: {
      event: ON_FALL_SCENE_PRESS_DOWN,
      ease: 'expo.in',
      duration: 1,
      onUpdate: (v) => {
        const s = map(v, 0, 1, minSpeed, maxSpeed);
        console.log(s);
        shader.uniforms.uSpeed.value = s;
      },
    },
    outParams: {
      event: ON_FALL_SCENE_PRESS_UP,
      ease: 'expo.out',
      duration: 2,
      onUpdate: (v) => {
        const s = map(v, 0, 1, minSpeed, maxSpeed);
        shader.uniforms.uSpeed.value = s;
      },
    },
  });

  useFrame((state) => {
    shader.uniforms.uTime.value = state.clock.getElapsedTime() + seed * 1000;

    const { x, y } = getMouse();
    if (!getMouse) return;
    shader.uniforms.uMouse.value.set(x, y);
  });

  return <shaderMaterial {...shader} />;
}
