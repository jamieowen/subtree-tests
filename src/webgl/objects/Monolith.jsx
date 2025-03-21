import range from '@/webgl/glsl/utils/range.glsl';
import swirl from '@/webgl/glsl/utils/swirl.glsl';
import transformUV from '@/webgl/glsl/utils/transformUV.glsl';

import { urls } from '@/config/assets';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { DoubleSide } from 'three';

export const MONOLITH_PULSE = 'monolith:pulse';

const vert = /*glsl*/ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vPos;
  varying vec2 vUv;

  void main() {
    vec4 mPos = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * mPos;

    vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
    vWorldPos = mPos.xyz;
    vUv = uv;
    vPos = position;
  }
`;

const frag = /*glsl*/ `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vPos;
  varying vec2 vUv;

  uniform sampler2D tNoise;
  uniform sampler2D tMap;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uClickTransition;
  uniform vec2 uMonolithTapCenter;

  layout(location = 1) out vec4 gNormal;

  ${swirl}
  ${range}
  ${transformUV}

   vec2 uvToRadial(vec2 uv, vec2 center) {
      // Center the UV coordinates to the range [-0.5, 0.5]
      vec2 centeredUV = uv - center;

      // Compute the radius
      float r = length(centeredUV);

      // Compute the angle (theta) using atan function
      float theta = atan(centeredUV.y, centeredUV.x);

      return fract(vec2(r, theta));
  }

  float subtractWithFactor(float value1, float value2, float factor) {
      float result = value1 - value2;  // Simple subtraction
      return mix(value1, result, factor);  // Blend between original value and subtracted result
  }

  vec3 subtractWithFactor(vec3 value1, vec3 value2, float factor) {
      vec3 result = value1 - value2;  // Simple subtraction
      return mix(value1, result, factor);  // Blend between original value and subtracted result
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 worldPos = normalize(vWorldPos);

    vec2 st = gl_FragCoord.xy / uResolution.xy;

    vec2 swirlUV = st * 1.11;
    swirlUV.y = 1. - swirlUV.y;
    float noise = swirl(tNoise, swirlUV, vec2(0.1, 0.2), vec2(0.0, -0.05), 0.5, true);
    // float noise2 = swirl(tNoise, swirlUV, vec2(noise * 0.1, 0.2), vec2(0.0, noise * 0.001), 0.5, true);

    float m = crange(st.y, 0.4, 0.6, 0., 1.);
    float isFacingUpwards = step(dot(normal, vec3(0., 0., 1.)), 0.2);

    vec3 color = mix(uColor1, uColor2, smoothstep(0., 0.33, vUv.y));
    color = mix(color, uColor3, smoothstep(0.33, 0.66, vUv.y));
    color = mix(color, uColor2, smoothstep(0.66, 1., vUv.y));
    color = mix(color, uColor1, noise);
    // color = subtractWithFactor(uColor3, color, noise - 0.2);
    // color = mix(color, uColor1, vUv.y);
    // color = mix(color, uColor3, 1. - vUv.y);
    // color *= 1.2;

    float t = uClickTransition;
    // float t = fract(uTime * 0.5);

    float t1 = crange(t, 0., 0.5, 0., 1.);
    float t2 = crange(t, 0.5, 1., 1., 4.);

    //t = t1 * t2;

    vec2 monolithClickStart = uMonolithTapCenter;
    vec2 toRUV = vUv;
    // toRUV.y *= vUv.y;
    // toRUV.x *= 0.5;
    // toRUV.x += 0.25;

    //if(isFacingUpwards == 1.) toRUV.y = 1. - vUv.x;

    vec2 rUV = uvToRadial(toRUV, monolithClickStart);
    
    rUV.x += 1. - uTime;

    float radialNoise = texture2D(tNoise, rUV).r;
    radialNoise = subtractWithFactor(length(vUv - monolithClickStart), 0.3, radialNoise);

    float pulseAmount = 1.;
    float movement = radialNoise;
    float pulse = fract((movement * pulseAmount) - t1);
    pulse *= exp(smoothstep(0., 0.1, pulse) * smoothstep(0., 1., pulse));
    pulse = clamp(1. - ((pulse - t2) * -1.), 0., 1.);
    
    vec3 pulseColor = mix(color, color + vec3(.2), pulse);
    
    
    // Removes artefacts when t = 0
    float startFade = smoothstep(0., 0.3, t);
    
    vec3 final = mix(color, pulseColor, pulse * startFade);

    vec3 pattern = vec3(1.) - texture2D(tMap, vUv).rgb;


    final = mix(final, final * 0.5, pattern);

    pc_fragColor = vec4(final, 1.0);
    //pc_fragColor.rgb = pattern.rgb;

    gNormal = vec4(normal, 1.);
  }
`;

export const MonolithMaterial = ({
  tMap,
  colors = ['#73B3DD', '#70ffDE', '#DDBEF4'],
  tapCenter = [0.3, 0.9],
}) => {
  const noise = useAsset(urls.t_noise_simplex);

  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);

  const shader = useMemo(() => ({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      tNoise: {
        value: noise,
      },
      uColor1: {
        value: new Color(colors[0]),
      },
      uColor2: {
        value: new Color(colors[1]),
      },
      uColor3: {
        value: new Color(colors[2]),
      },
      uTime: {
        value: 0,
      },

      uMonolithTapCenter: {
        value: tapCenter,
      },

      uResolution: {
        value: new Vector2(),
      },
      uClickTransition: {
        value: 0,
      },

      tMap: {
        value: tMap,
      },
    },
  }));

  useToggleEventAnimation({
    inParams: {
      event: MONOLITH_PULSE,
      //delay: 0.5,
      duration: 0.5,
      onStart: () => {
        console.log('start');
      },
      onUpdate: (v) => {
        shader.uniforms.uClickTransition.value = v;
      },
      onComplete: () => {
        shader.uniforms.uClickTransition.value = 0;
      },
    },
  });

  useEffect(() => {
    shader.uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size, viewport]);

  useFrame(({ clock }) => {
    shader.uniforms.uTime.value = clock.getElapsedTime();
  });

  return <shaderMaterial args={[shader]} />;
};

export function MonolithGlow({ size = 4, ...props }) {
  const tMask = useAsset(urls.t_monolith_glow);
  const tNoise = useAsset(urls.t_noise_simplex);

  const glowShader = useMemo(
    () => ({
      vertexShader: /*glsl*/ `
      varying vec3 vEye;
      varying vec3 vNormal;
      varying vec2 vUv;

      void main() {
        vec3 pos = position;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

        vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;      
        vUv = uv;
      }
    `,
      fragmentShader: /*glsl*/ `
      uniform sampler2D tGlowMask;
      uniform sampler2D tNoise;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform float uTime;

      varying vec2 vUv;

      layout(location = 1) out vec4 gNormal;
      layout(location = 2) out vec4 gOutline;

      ${swirl}

      vec2 uvToRadial(vec2 uv) {
          // Center the UV coordinates to the range [-0.5, 0.5]
          vec2 centeredUV = uv - vec2(0.5, 0.5);

          // Compute the radius
          float r = length(centeredUV);

          // Compute the angle (theta) using atan function
          float theta = atan(centeredUV.y, centeredUV.x);

          return vec2(r, theta);
      }

      float quantize(float value, float steps) {
          return floor(value * steps) / steps;
      }

      vec3 quantizeColor(vec3 color, float steps) {
          return vec3(quantize(color.r, steps), quantize(color.g, steps), quantize(color.b, steps));
      }


      void main() {
        vec2 swirlUV = vUv * 1.;
        vec2 radialUV = fract(uvToRadial(vUv));
        radialUV.x -= uTime * 0.1;
        radialUV.y -= uTime * 0.1;

        vec4 n = texture2D(tNoise, radialUV);

        vec2 glowUV = vUv;
        float glow = texture2D(tGlowMask, glowUV).r;

        float noise = n.r;

        float speed = 0.1;
        float pulseAmount = 2.;
        float movement = glow;
        float pulse = fract((movement * pulseAmount) + uTime * speed);
        pulse *= smoothstep(noise, 0.2, pulse) * smoothstep(0., 0.1, pulse);
        pulse *= smoothstep(1., noise, movement);
        
        float glowMultiplier = 1.5;
        vec3 color = mix(uColor1 * glowMultiplier, uColor2 * glowMultiplier, noise);
        color *= 1. - pulse;
        color = mix(color, quantizeColor(color, 10.), 1. - glow);

        pc_fragColor = vec4(color, glow);

        gNormal = vec4(0.);
        gOutline = vec4(0.);
      }
      `,
      uniforms: {
        tGlowMask: {
          value: tMask,
        },
        tNoise: {
          value: tNoise,
        },
        uColor1: {
          value: new Color('#70ffDE'),
        },
        uColor2: {
          value: new Color('#DDBEF4'),
        },
        uTime: {
          value: 0,
        },
      },
      side: DoubleSide,
      transparent: true,
      depthWrite: false,
    }),
    []
  );

  useFrame(({ clock }) => {
    glowShader.uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <Billboard>
      <mesh {...props}>
        <planeGeometry args={size} />
        <shaderMaterial args={[glowShader]} />
      </mesh>
    </Billboard>
  );
}

// import useRenderSceneToTexture from '../../hooks/useRenderToTexture';

// export const backFBO = create(() => null);

// export default function Monolith({
//   geometry,
//   colors = ['#70ffDE', '#00BED6', '#DDB1AB'],
//   ...props
// }) {
//   const size = useThree((s) => s.size);
//   const viewport = useThree((s) => s.viewport);

//   //   const { curr, next } = fboState();
//   const getMouse = useMouse2();

//   const tNoise = useAsset(urls.t_noise);
//   const tMatcap = useAsset(urls.t_monolith_matcap);

//   const tPattern = useAsset(urls.t_monolith_pattern);

//   const _backFBO = useFBO({
//     type: HalfFloatType,
//     minFilter: NearestFilter,
//     magFilter: NearestFilter,
//   });

//   useEffect(() => {
//     backFBO.setState(_backFBO);
//   }, []);

//   const shader = useMemo(
//     () => ({
//       vertexShader: vert,
//       fragmentShader: frag,
//       uniforms: {
//         uResolution: {
//           value: new Vector2(
//             size.width * viewport.dpr,
//             size.height * viewport.dpr
//           ),
//         },
//         uTime: {
//           value: 0,
//         },
//         tNoise: {
//           value: tNoise,
//         },
//         tPattern: {
//           value: tPattern,
//         },
//         tMatcap: {
//           value: tMatcap,
//         },
//         uMouse: {
//           value: new Vector2(),
//         },
//         uColor1: {
//           value: new Color(colors[0]),
//         },
//         uColor2: {
//           value: new Color(colors[1]),
//         },
//         uColor3: {
//           value: new Color(colors[2]),
//         },
//       },

//       side: FrontSide,
//       depthWrite: false,
//       depthTest: false,
//       transparent: true,

//       // transparent: true,
//     }),
//     []
//   );

//   // const { store } = useRenderSceneToTexture();

//   useEffect(() => {
//     shader.uniforms.uResolution.value.set(
//       size.width * viewport.dpr,
//       size.height * viewport.dpr
//     );
//   }, [size]);

//   const mainMaterial = useMemo(() => {
//     return new ShaderMaterial({
//       ...shader,
//     });
//   }, []);

//   const [main, back, group] = [useRef(), useRef(), useRef()];

//   const backMaterial = useMemo(() => {
//     return new ShaderMaterial({
//       vertexShader: vert,
//       fragmentShader: /*glsl*/ `
//           varying vec3 vNormal;
//           varying vec3 vWorldPos;

//           layout(location = 1) out vec4 gNormal;

//           void main() {
//             pc_fragColor = vec4(vWorldPos, 1.0);
//             gNormal = vec4(vNormal, 1.);
//           }
//       `,
//       side: BackSide,
//       depthWrite: false,
//       depthTest: false,
//       transparent: true,
//     });
//   }, []);

//   useFrame(({ gl, scene, camera, clock, ...rest }, delta) => {
//     shader.uniforms.uTime.value += delta;

//     camera.layers.disableAll();
//     camera.layers.enable(2);

//     gl.setRenderTarget(_backFBO);

//     gl.render(scene, camera);

//     camera.layers.enableAll();
//     camera.layers.disable(2);

//     gl.setRenderTarget(null);

//     // if (!getMouse) return;

//     // const { x, y } = getMouse();
//     // shader.uniforms.uMouse.value.set(x, y);

//     // const { current, previous } = store.getState();

//     // if (current?.texture) shader.uniforms.tScene.value = current.texture;
//     // if (previous?.texture) shader.uniforms.tScenePrev.value = previous.texture;
//   }, 2);

//   // const geometry = new TorusKnotGeometry(0.2, 0.05, 100, 16);
//   // const _geometry = new SphereGeometry(0.2, 64, 64);

//   // const geometry = new BoxGeometry(0.2, 0.2, 0.2);

//   return (
//     <group
//       {...props}
//       ref={group}
//     >
//       <mesh
//         layers={[1]}
//         geometry={geometry}
//         material={mainMaterial}
//         ref={main}
//         visible={true}
//       ></mesh>
//       <mesh
//         layers={[2]}
//         visible={false}
//         geometry={geometry}
//         material={backMaterial}
//         ref={back}
//       ></mesh>
//     </group>
//   );
// }
