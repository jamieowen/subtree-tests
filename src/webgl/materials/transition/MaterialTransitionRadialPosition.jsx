import radialPosition from '@/webgl/glsl/transitions/radialPosition.frag';
import baseVert from '@/webgl/glsl/utils/base.vert';
import { Power1, Power2 } from 'gsap';
import { urls } from '@/config/assets';
import {
  Matrix4,
  RepeatWrapping,
  ReplaceStencilOp,
  ShaderMaterial,
} from 'three';
import { useFrame } from '@react-three/fiber';

export const defaultWorldPosVertShader = /*glsl*/ `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  varying vec3 vNormal;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    vWorldPos = vec3(modelMatrix * vec4(position, 1.0));
    vUv = uv;
    vNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
  }
`;

export const defaultWorldPosFragShader = /*glsl*/ `
  varying vec3 vWorldPos;
  varying vec2 vUv;
  varying vec3 vNormal;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform sampler2D tMap;
  uniform sampler2D tNoise;
  uniform float uTime;

  layout(location = 1) out vec4 worldPos;
  // layout(location = 1) out vec4 gNormal;

  void main() {
      vec2 uv = vUv;

      // #ifdef HAS_WIND
        vec2 noiseUV = vUv;
        noiseUV.x += uTime * 0.1;
        vec4 noise = texture2D(tNoise, noiseUV);

        uv.x += noise.r;
      // #else

      #ifdef HAS_MAP
        vec4 color = texture2D(tMap, uv);
        pc_fragColor = noise;
      #else

        vec3 lightPos = vec3(0.0, 3.0, 0.0);
        float ndotl = clamp(dot(vNormal, normalize(lightPos)), 0., 1.) * 0.5 + 0.5;
        
        vec3 color = mix(uColor1, uColor2, length(vUv.x)) * ndotl * ndotl;

        pc_fragColor = vec4(color, 1.0);
      #endif
      
      // gNormal = vec3(vNormal, 1.);
      worldPos = vec4(vWorldPos, 1.0);

      if(pc_fragColor.a < 0.5) discard;
  }
`;

export const defaultMaterial = (
  map = null,
  _color1 = null,
  _color2 = null,
  wind = true
) => {
  const randomBetween = (min, max) =>
    min + Math.floor(Math.random() * (max - min + 1));
  const r = randomBetween(0, 255);

  // TODO: isnt it expensive that we load this texture every time?
  // Maybe should create a diff material
  const tNoise = useAsset(urls.t_noise);

  // const r2 = randomBetween(0, 255);

  const color1 = _color1 ?? `rgb(${r}, ${r}, ${r})`;

  const shader = new ShaderMaterial({
    vertexShader: defaultWorldPosVertShader,
    fragmentShader: defaultWorldPosFragShader,

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
      tNoise: {
        value: tNoise,
      },
      uTime: {
        value: 0,
      },
    },
    defines: {
      HAS_MAP: !!map,
      HAS_COLOR: !!_color1,
      HAS_WIND: wind,
    },
    transparent: true,
  });

  useFrame((state) => {
    shader.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return shader;
};

export const MaterialTransitionRadialPosition = forwardRef(
  ({ ...props }, ref) => {
    const [tTransition, tNoise] = useTexture([
      urls.t_radial_transition,
      urls.t_noise,
    ]);

    const camera = useThree((s) => s.camera);
    const scene = useThree((s) => s.camera);
    const gl = useThree((s) => s.gl);

    const uniforms = useMemo(
      () => ({
        uMixRatio: { value: 0 },
        uTime: { value: 0 },
        tTransition: { value: tTransition },
        tNoise: { value: tNoise },
        tDiffuseCurr: { value: null },
        tDiffuseNext: { value: null },
        tDepthCurr: { value: null },
        tDepthNext: { value: null },

        uCameraNearCurr: { value: 0.1 },
        uCameraFarCurr: { value: 2000 },
        uCameraPositionCurr: { value: new Vector3(0, 0, 0) },
        uCameraProjectionMatrixCurr: { value: new Matrix4() },
        uCameraProjectionMatrixInverseCurr: { value: new Matrix4() },
        uCameraMatrixWorldCurr: { value: new Matrix4() },

        uCameraNearNext: { value: 0.1 },
        uCameraFarNext: { value: 2000 },
        uCameraPositionNext: { value: new Vector3(0, 0, 0) },
        uCameraProjectionMatrixNext: { value: new Matrix4() },
        uCameraProjectionMatrixInverseNext: { value: new Matrix4() },
        uCameraMatrixWorldNext: { value: new Matrix4() },

        uStartPosition: {
          value: new Vector3(0, 0, 0),
        },
        uRange: {
          value: 40,
        },
      }),
      [tNoise, tTransition]
    );

    useFrame(({ clock, camera: _camera }) => {
      const state = transitionState.getState();

      // FIXME: Do we need to do this for both curr and next?
      // Can't we also pack values into a single matrix?

      // NEXT
      if (state.fboNext?.texture) {
        const depth = state.fboNext.tDepth;

        const defMeshUniforms =
          state.fboNext.vScene?.children?.[1]?.material?.uniforms;
        if (defMeshUniforms) {
          uniforms.tDiffuseNext.value = state.fboNext.texture;
          uniforms.tDepthNext.value = depth;

          uniforms.uCameraNearNext.value = defMeshUniforms.uCameraNear.value;
          uniforms.uCameraFarNext.value = defMeshUniforms.uCameraFar.value;
          uniforms.uCameraProjectionMatrixNext.value =
            defMeshUniforms.uCameraProjectionMatrix.value;
          uniforms.uCameraProjectionMatrixInverseNext.value =
            defMeshUniforms.uCameraProjectionMatrixInverse.value;
          uniforms.uCameraMatrixWorldNext.value =
            defMeshUniforms.uCameraMatrixWorld.value;
        }
      }

      // CURRENT
      if (state.fboCurr?.texture) {
        const depth = state.fboCurr.tDepth;

        uniforms.tDiffuseCurr.value = state.fboCurr.texture;
        uniforms.tDepthCurr.value = depth;

        const defMeshUniforms =
          state.fboCurr.vScene?.children?.[1]?.material?.uniforms;

        if (defMeshUniforms) {
          uniforms.uCameraNearCurr.value = defMeshUniforms.uCameraNear.value;
          uniforms.uCameraFarCurr.value = defMeshUniforms.uCameraFar.value;
          uniforms.uCameraProjectionMatrixCurr.value =
            defMeshUniforms.uCameraProjectionMatrix.value;
          uniforms.uCameraProjectionMatrixInverseCurr.value =
            defMeshUniforms.uCameraProjectionMatrixInverse.value;
          uniforms.uCameraMatrixWorldCurr.value =
            defMeshUniforms.uCameraMatrixWorld.value;
        }
      }
      uniforms.uMixRatio.value = Power1.easeIn(state.mixRatio);

      uniforms.uTime.value = clock.getElapsedTime();

      if (
        state.config.material.name == 'MaterialTransitionRadialPosition' &&
        state.config.material.uniforms
      ) {
        for (let [name, value] of Object.entries(
          state.config.material.uniforms
        )) {
          uniforms[name].value = value;
        }
      }
    });

    useEffect(() => {
      gl.compile(scene, camera);
    }, []);

    return (
      <mesh>
        <shaderMaterial
          ref={ref}
          vertexShader={baseVert}
          fragmentShader={radialPosition}
          uniforms={uniforms}
        />
      </mesh>
    );
  }
);
