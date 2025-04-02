import CustomShaderMaterial from 'three-custom-shader-material/vanilla';
import { ShaderMaterial, MeshBasicMaterial } from 'three';
import { Suspense, createContext } from 'react';
import { useThree } from '@react-three/fiber';
import normalEncoding from '@/webgl/glsl/utils/normalEncoding.glsl';
import { surfaceFinder } from '../utils/surfaceFinder';
import { MaterialModuleSurfaceId } from './modules/MaterialModuleSurfaceId';
import range from '@/webgl/glsl/utils/range.glsl';

export const GBufferMaterialContext = createContext(null);

export const GBufferMaterial = forwardRef(
  (
    {
      baseMaterial,
      defines,
      uniforms,
      vertexShader,
      fragmentShader,
      _key,
      attach = 'material',
      fps,

      children,
      ...props
    },
    ref
  ) => {
    const size = useThree((state) => state.size);
    const viewport = useThree((state) => state.viewport);
    const dpr = useThree((state) => state.dpr);

    const _uniforms = useMemo(() => {
      return Object.assign(
        {
          uTime: { value: 0 },
          uResolution: {
            value: [size.width * viewport.dpr, size.height * viewport.dpr],
          },
          uDpr: { value: viewport.dpr },
        },
        uniforms
      );
    }, [uniforms]);

    const material = useMemo(() => {
      let mat;

      if (baseMaterial) {
        let opts = {
          baseMaterial,
          uniforms: _uniforms,
          vertexShader:
            vertexShader ||
            /*glsl*/ `
              varying vec2 vUv;
              ${baseMaterial == MeshBasicMaterial ? 'varying vec3 vNormal;' : ''}
              varying vec3 vWorldNormal;
              uniform float uTime;
              uniform vec2 uResolution;
              uniform float uDpr;
              ${range}
              /// insert <setup>

              void main() {
                vUv = uv;
                vNormal = normal;
                vWorldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
                /// insert <main>
              }
          `,
          fragmentShader:
            fragmentShader ||
            /*glsl*/ `
              varying vec2 vUv;
              ${!baseMaterial ? 'varying vec3 vNormal;' : ''}
              varying vec3 vWorldNormal;

              uniform float uTime;
              uniform vec2 uResolution;
              uniform float uDpr;

              layout(location = 1) out vec4 gNormal;
              layout(location = 2) out vec4 gOutline;
              
              ${range}
              /// insert <setup>

              void main() {
                vec2 st = vUv;
                // gNormal = vec4(vWorldNormal, 0.0);
                gNormal = gNormal;
                gOutline = gOutline;
                // pc_fragColor = vec4(1.0, 0.0, 0.0, 1.0);
                // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                /// insert <main>
              }
            `,
          silent: true,
        };
        mat = new CustomShaderMaterial(opts);
      } else {
        mat = new ShaderMaterial({
          uniforms: _uniforms,
          vertexShader:
            vertexShader ||
            /*glsl*/ `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vWorldNormal;

            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uDpr;

            
            ${range}
            /// insert <setup>

            void main() {
              vUv = uv;
              vec3 transformed = position;
              vNormal = normal;
              
              /// insert <deform>
              
              gl_Position = projectionMatrix * modelViewMatrix * vec4( transformed, 1.0 );
              vPosition = transformed;
              
              /// insert <main>
              
              vWorldNormal = normalize(modelMatrix * vec4(vNormal, 0.0)).xyz;
              
            }
        `,
          fragmentShader:
            fragmentShader ||
            /*glsl*/ `
            varying vec2 vUv;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying vec3 vWorldNormal;

            uniform float uTime;
            uniform vec2 uResolution;
            uniform float uDpr;

            ${range}

            layout(location = 1) out vec4 gNormal;
            layout(location = 2) out vec4 gOutline;

            /// insert <setup>

            void main() {
              // gl_FragColor = vec4(1.0,1.0,1.0,1.0);
              vec2 st = vUv;
              // gNormal = vec4(vWorldNormal, 0.0);
              gNormal = gNormal;
              gOutline = gOutline;
              vec2 screenPosition = gl_FragCoord.xy / uResolution;

              /// insert <main>

              // gNormal.xy = normalEncode(gNormal.xyz);
            }
          `,
        });
      }

      if (defines) {
        mat.defines = mat.defines || {};
        Object.assign(mat.defines, defines);
      }

      return mat;
    }, [baseMaterial, fragmentShader, vertexShader, uniforms, _key]);

    // DISPOSE
    useEffect(() => {
      return () => {
        material.dispose();
      };
    }, [material]);

    // TIME
    useFrameFps(
      ({ clock }) => {
        material.uniforms.uTime.value = clock.getElapsedTime();
      },
      null,
      fps
    );

    // RESOLUTION
    useEffect(() => {
      material.uniforms.uResolution.value = [
        size.width * viewport.dpr,
        size.height * viewport.dpr,
      ];
    }, [size, viewport]);

    const ctx = useMemo(() => {
      return {
        material,
        baseMaterial,
        isCSM: !!baseMaterial,
      };
    }, [material, baseMaterial]);

    // const refRoot = useRef(null);

    return (
      <>
        <primitive
          ref={mergeRefs([ref])}
          object={material}
          attach={attach}
          {...props}
        />

        <GBufferMaterialContext.Provider value={ctx}>
          {/* <MaterialModuleSurfaceId /> */}
          {children}
        </GBufferMaterialContext.Provider>
      </>
    );
  }
);
