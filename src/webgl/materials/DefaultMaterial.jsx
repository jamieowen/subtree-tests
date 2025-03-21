import { urls } from '@/config/assets';
import range from '@/webgl/glsl/utils/range.glsl';
import { useFrame } from '@react-three/fiber';
import { RepeatWrapping, ReplaceStencilOp, ShaderMaterial } from 'three';

export const windSpeed = 0.01;
export const baseWindAmount = 2;

export const defaultWorldPosVertShader = (windAmount, windScale) => /*glsl*/ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec2 vWorldUV;

  uniform vec2 uResolution;
  uniform sampler2D tNoise;
  uniform float uTime;
  uniform float uRand;

  ${range}

  void main() {
      vec3 transformed = position;
      vec3 worldPos = vec3(modelMatrix * vec4(position, 1.0));

      #ifdef HAS_WIND
        float rangeX = 2.;
        float rangeY = 5.5;
        vec2 st = vec2(
          1. - crange(worldPos.x, -rangeX, rangeX, 0., 1.),
          1. - crange(worldPos.y, -rangeY, rangeY, 0., 1.)
        );

        // vec2 windUv = vec2( aTexCoord1.x + wind_time() + (pos.x * .1) + 1., aTexCoord1.y );
        // windDisp = (texture2D( tDisp, windUv * .1 ).rg - .5) * (aTexCoord1.y * aTexCoord1.y );
        float speed = ${ensureShaderFloat(windSpeed)};
        float offset = uRand * ${ensureShaderFloat(baseWindAmount * windAmount)};
        st.x -= (uTime + uRand * 50.) * (speed);
        st.y -= (uTime + uRand * 50.) * (speed);

        vec4 noise = texture2D(tNoise, st * ${ensureShaderFloat(windScale)});

        vec2 ntr = vec2(
          noise.r * ${ensureShaderFloat(windAmount)}, 
          noise.g * ${ensureShaderFloat(windAmount)}
        ) * (1. - uv.y);
        transformed.x -= ntr.x;
        //transformed.x += ntr.x;
        transformed.z -= ntr.y;
        
      #endif

      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);

      vUv = uv;
      vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
      vWorldPos = worldPos;
      // vWorldUV = noise.rg;
  }
`;

export const defaultWorldPosFragShader = (GLSLColorMix, n = false) => /*glsl*/ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  // varying vec2 vWorldUV;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  
  uniform sampler2D tMap;
  uniform sampler2D tNoise;

  layout(location = 1) out vec4 gNormal;

  ${range}

  void main() {
      #ifdef HAS_MAP
        vec4 color = texture2D(tMap, vUv);
        pc_fragColor = color;
      #else
        float colorMix = ${GLSLColorMix};
        // FIXME: no ndotl for overview scenes, need to refactor
        vec3 color = mix(uColor1, uColor2, colorMix);

        pc_fragColor = vec4(color, 1.0);
      #endif
      
	    ${n ? 'pc_fragColor = vec4(vec3(0.), 1.0);' : ''}
      gNormal = vec4(vNormal, 1.0);

      if(pc_fragColor.a < 0.5) discard;
  }
`;

/**
 * Regular material
 * @param {*} map
 * @param {*} _color1
 * @param {*} _color2
 * @param {*} windAmount
 * @param {*} windScale
 * @param {*} GLSLColorMix
 * @returns
 */
export const defaultMaterial = (
  map = null,
  _color1 = null,
  _color2 = null,
  windAmount = 0.25,
  windScale = 4,
  GLSLColorMix = 'crange(vWorldPos.z, 0., 100., 0., 1.)',
  n = false
) => {
  const randomBetween = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));
  const r = useMemo(() => randomBetween(0, 255), []);
  const color1 = useMemo(() => _color1 ?? `rgb(${r}, ${r}, ${r})`, []);

  const tNoise = useAsset(urls.t_noise_green);

  const rand = useMemo(() => Math.random(), []);

  const shader = new ShaderMaterial({
    vertexShader: defaultWorldPosVertShader(windAmount, windScale),
    fragmentShader: defaultWorldPosFragShader(GLSLColorMix, n),

    // TEMP: For testing
    //side: DoubleSide,
    uniforms: {
      tMap: {
        value: map,
      },
      uColor1: {
        value: new Color(color1),
      },
      uColor2: {
        value: new Color(_color2 ?? color1),
      },
      uTime: {
        value: 0,
      },
      uRand: {
        value: rand,
      },
      uWindAmount: {
        value: windAmount,
      },
      tNoise: {
        value: tNoise,
      },
    },
    defines: {
      HAS_MAP: !!map,
      HAS_COLOR: !!_color1,
      HAS_WIND: !!(windAmount > 0),
    },
    alphaTest: 0.5,
    // transparent: true,
    //side: DoubleSide,
  });

  useFrame((state) => {
    shader.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return shader;
};

/**
 * Default material with normal
 * @param {*} param0
 * @returns
 */
export function defaultMaterialWithNormal({
  tNormal,
  color1,
  color2,
  ...props
}) {
  //   const tNoise = useAsset(urls.t_noise_green);

  const rand = useMemo(() => Math.random(), []);

  const shader = new ShaderMaterial({
    vertexShader: /*glsl*/ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
          vec3 worldPos = vec3(modelMatrix * vec4(position, 1.0));
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

          vUv = uv;
          vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
          vWorldPos = worldPos;
      }
    `,
    fragmentShader: /*glsl*/ `
        varying vec2 vUv;
        varying vec3 vWorldPos;
        varying vec3 vNormal;
        
        uniform sampler2D tNormal;
        uniform vec3 uColor1;
        uniform vec3 uColor2;

        layout(location = 1) out vec4 gNormal;

        ${range}

        void main() {
            float mixRange = crange((vWorldPos.z - vWorldPos.x), -10., 20., 0., 1.);
            vec4 normal = texture2D(tNormal, vUv * 10.);

            vec3 color = mix(uColor1, uColor2, mixRange);
            vec3 lightPos = vec3(0., 1., 0.);
            float ndotl = clamp(dot(normal.rgb, normalize(lightPos)), 0., 1.) * 0.5 + 0.5;
            ndotl = ndotl * ndotl;

            // color = mix(color, color * 0.9, ndotl);
            // color = mix(color, vec3(1.), 1. - length(normal));
            color = mix(color, color * 0.8, 1. - length(normal) * 0.5 * ndotl);

            pc_fragColor = vec4(color, 1.0);
            // pc_fragColor = vec4(normal.rgb, 1.0);
            // pc_fragColor = vec4(normal.rgb, 1.0);

            gNormal = vec4(vNormal, 1.);
        }
    `,

    // TEMP: For testing
    //side: DoubleSide,
    uniforms: {
      tNormal: {
        value: tNormal,
      },
      uColor1: {
        value: new Color(color1),
      },
      uColor2: {
        value: new Color(color2),
      },
      uTime: {
        value: 0,
      },
      uRand: {
        value: rand,
      },
      //   tNoise: {
      //     value: tNoise,
      //   },
    },
    defines: {
      //   HAS_MAP: !!map,
      //   HAS_COLOR: !!_color1,
      //   HAS_WIND: !!(windAmount > 0),
    },
    //alphaTest: 0.5,
    // transparent: true,
    //side: DoubleSide,
  });

  useFrame((state) => {
    shader.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return shader;
}
