import {
  LinearFilter,
  NearestMipMapLinearFilter,
  // UnsignedByteType,
  // HalfFloatType,
  RGBAFormat,
} from 'three';
import { DeferredContext } from './DeferredContext';
import normalEncoding from '@/webgl/glsl/utils/normalEncoding.glsl';

export const RenderTextureDeferred = forwardRef(
  (
    {
      children,
      renderPriority = 0,
      idx,
      width,
      height,
      maxDpr,
      samples = 0,
      fboProps,
      renderOn, // undefined means render every frame, 0 or 1 means render every other frame, render if frameCount % 2 == renderOn
      frameNum = { current: 0 },
      frames,
      ...props
    },
    ref
  ) => {
    const size = useThree((state) => state.size);
    const viewport = useThree((state) => state.viewport);

    const _dpr = maxDpr ? Math.min(viewport.dpr, maxDpr) : viewport.dpr;

    const _width = typeof width === 'number' ? width : size.width * _dpr;
    const _height = typeof height === 'number' ? height : size.height * _dpr;
    // const gl = useThree((state) => state.gl);
    // const pixelRatio = useMemo(() => {
    //   return gl.getPixelRatio();
    // }, [gl]);

    const _fboProps = useMemo(() => {
      let p = {};
      Object.assign(p, fboProps);
      // return p; // DEBUG

      // NOSE SPECIFIC OVERRIDES
      if (!p.count) p.count = 3; // gNormal
      // if (!p.minFilter) p.minFilter = LinearFilter;
      // if (!p.magFilter) p.magFilter = LinearFilter;
      // console.log('count', p.count);

      p.textureConfig = [
        {},
        // { type: UnsignedByteType, format: RGFormat },
        { type: HalfFloatType, format: RGFormat },
        // {
        //   type: HalfFloatType,
        //   format: RGBAFormat,
        //   minFilter: NearestFilter,
        //   magFilter: NearestFilter,
        //   generateMipmaps: false,x
        // },
      ];

      return p;
    }, [fboProps]);

    const refDeferred = useRef();
    const refMaterial = useRef();
    const refGbuffer = useRef();

    const shader = useMemo(() => {
      return {
        name: 'RenderTextureDeferred',
        defines: {},
        uniforms: {
          uResolution: {
            value: new Vector2(_width, _height),
          },
          uCameraPosition: { value: new Vector3(0, 0, 0) },
          uCameraNear: { value: 0.1 },
          uCameraFar: { value: 2000 },
          uCameraProjectionMatrix: { value: new Matrix4() },
          uCameraProjectionMatrixInverse: { value: new Matrix4() },
          uCameraMatrixWorld: { value: new Matrix4() },

          uTime: { value: 0 },
          uDelta: { value: 0 },

          tDiffuse: { value: null },
          tNormal: { value: null },
          tDepth: { value: null },
          tSurface: { value: null },
        },

        vertexShader: /*glsl*/ `
          // precision highp float;
          // in vec2 position;

          void main() {
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: /*glsl*/ `
          
          // precision highp float;
          // #include <common>
          #include <packing>
          
          uniform vec2 uResolution;
          uniform vec3 uCameraPosition;
          uniform float uCameraNear;
          uniform float uCameraFar;

          uniform mat4 uCameraProjectionMatrix;
          uniform mat4 uCameraProjectionMatrixInverse;
          uniform mat4 uCameraMatrixWorld;

          uniform float uTime;

          uniform sampler2D tDiffuse;
          uniform sampler2D tNormal;
          uniform sampler2D tDepth;
          uniform sampler2D tSurface;


          // layout(location = 0) out vec4 pc_fragColor;
          layout(location = 1) out vec4 gNormal;
          

          float hash(vec2 p) {
            vec3 p3  = fract(vec3(p.xyx) * .1031);
            p3 += dot(p3, p3.yzx + 33.33);
            
            return fract((p3.x + p3.y) * p3.z);
          }

          float quantize(float value, float steps) {
            return floor(value * steps) / steps;
          }

          vec3 quantizeColor(vec3 color, float steps) {
              return vec3(quantize(color.r, steps), quantize(color.g, steps), quantize(color.b, steps));
          }

          float blendSoftLight(float base, float blend) {
              return (blend<0.5)?(2.0*base*blend+base*base*(1.0-2.0*blend)):(sqrt(base)*(2.0*blend-1.0)+2.0*base*(1.0-blend));
          }
          vec3 blendSoftLight(vec3 base, vec3 blend) {
              return vec3(blendSoftLight(base.r, blend.r), blendSoftLight(base.g, blend.g), blendSoftLight(base.b, blend.b));
          }
          vec3 blendSoftLight(vec3 base, vec3 blend, float opacity) {
              return (blendSoftLight(base, blend) * opacity + base * (1.0 - opacity));
          }

          float blendScreen(float base, float blend) {
              return 1.0-((1.0-base)*(1.0-blend));
          }
          vec3 blendScreen(vec3 base, vec3 blend) {
              return vec3(blendScreen(base.r, blend.r), blendScreen(base.g, blend.g), blendScreen(base.b, blend.b));
          }
          vec3 blendScreen(vec3 base, vec3 blend, float opacity) {
              return (blendScreen(base, blend) * opacity + base * (1.0 - opacity));
          }


          float readDepth( sampler2D depthTexture, vec2 coord ) {
            float fragCoordZ = texture( depthTexture, coord ).x;
            float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNear, uCameraFar );
            return viewZToOrthographicDepth( viewZ, uCameraNear, uCameraFar );
          }

          vec4 readWorldPosFromDepth( sampler2D depthTexture, vec2 coord ) {
            // depth
            float fragCoordZ = texture( depthTexture, coord ).x;
            float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNear, uCameraFar );
            float depth = viewZToOrthographicDepth( viewZ, uCameraNear, uCameraFar );

            // world position
            float clipW = uCameraProjectionMatrix[2][3] * viewZ + uCameraProjectionMatrix[3][3];
            vec4 clipPosition = vec4( ( vec3( coord, depth ) - 0.5 ) * 2.0, 1.0 );
            clipPosition *= clipW;
            vec4 viewPosition = uCameraProjectionMatrixInverse * clipPosition;
            return uCameraMatrixWorld * vec4( viewPosition.xyz, 1.0 );
          }

          ${normalEncoding}

          /// insert <setup>

          void main() {

            vec2 uv = gl_FragCoord.xy / uResolution.xy;
            vec2 vUv = uv;

            float ao = 0.0; 

            vec4 color = texture(tDiffuse, uv);
            vec4 normal = texture(tNormal, uv);
            // gNormal = normal;
            gNormal.xyz = normalDecode(normal.xy);
            
            pc_fragColor = vec4(color.rgb, 1.0);

            // WORLD POSITION FROM DEPTH

            // depth
            // float fragCoordZ = texture( tDepth, vUv ).x;
            // float viewZ = perspectiveDepthToViewZ( fragCoordZ, uCameraNear, uCameraFar );
            // float depth = viewZToOrthographicDepth( viewZ, uCameraNear, uCameraFar );

            // // world position
            // float clipW = uCameraProjectionMatrix[2][3] * viewZ + uCameraProjectionMatrix[3][3];
            // vec4 clipPosition = vec4( ( vec3( uv, depth ) - 0.5 ) * 2.0, 1.0 );
            // clipPosition *= clipW;
            // vec4 viewPosition = uCameraProjectionMatrixInverse * clipPosition;
            // vec4 worldPosition = uCameraMatrixWorld * vec4( viewPosition.xyz, 1.0 );

            // depth
            float depth = readDepth(tDepth, vUv);
            vec4 worldPosition = readWorldPosFromDepth(tDepth, vUv);


            /// insert <pass>

          }
        `,
        // glslVersion: GLSL3,
      };
    }, []);

    const fsTriangle = useMemo(() => {
      return fullscreenTriangle();
    }, []);

    useEffect(() => {
      shader.uniforms.tDiffuse.value = refGbuffer.current.fbo.textures[0];
      shader.uniforms.tNormal.value = refGbuffer.current.fbo.textures[1];
      // shader.uniforms.tSurface.value = refGbuffer.current.fbo.textures[2];
      shader.uniforms.tDepth.value = refGbuffer.current.fbo.depthTexture;
    }, [shader, refGbuffer]);

    useFrame(({ clock }, delta) => {
      shader.uniforms.uTime.value = clock.getElapsedTime();
      shader.uniforms.uDelta.value = delta;
    }, renderPriority - 1);

    useImperativeHandle(
      ref,
      () => ({
        refMaterial,
        refDeferred,
        refGbuffer,
        tDepth: refGbuffer.current.tDepth,
      }),
      [refDeferred, refMaterial, refGbuffer]
    );

    useEffect(() => {
      shader.uniforms.uResolution.value.set(_width, _height);
    }, [_width, _height]);
    // useEffect(() => {
    //   shader.uniforms.uResolution.value.set(
    //     size.width * viewport.dpr,
    //     size.height * viewport.dpr
    //   );
    // }, [size.width, size.height, viewport.dpr]);

    return (
      <DeferredContext.Provider
        value={{
          refDeferred,
          refMaterial,
          refGbuffer,
          renderPriority,
        }}
      >
        <RenderTextureMulti
          // ref={mergeRefs([refMaterial, ref])}
          ref={refMaterial}
          idx={idx}
          renderOn={renderOn}
          frameNum={frameNum}
          renderPriority={renderPriority + 2}
          frames={frames}
          width={_width}
          height={_height}
          samples={0}
        >
          <orthographicCamera makeDefault />

          <mesh geometry={fsTriangle}>
            <shaderMaterial
              ref={refDeferred}
              {...shader}
            >
              <RenderTextureMulti
                ref={refGbuffer}
                // FIXME: We'll also need GBUffer, why not imperativehandle
                // ref={mergeRefs([refGbuffer, ref])}
                depthBuffer={true}
                depth={true}
                {..._fboProps}
                {...props}
                // samples={samples}
                renderOn={renderOn}
                frameNum={frameNum}
                renderPriority={renderPriority + 1}
                frames={frames}
                width={_width}
                height={_height}
              >
                <InnerScene
                  frames={frames}
                  refMaterial={refDeferred}
                  //
                >
                  {children}
                </InnerScene>
              </RenderTextureMulti>
            </shaderMaterial>
          </mesh>
        </RenderTextureMulti>
      </DeferredContext.Provider>
    );
  }
);

const InnerScene = ({ frames, children }) => {
  const {
    refDeferred,
    refMaterial,
    refGbuffer,
    renderPriority,
    //
  } = useContext(DeferredContext);

  // Get inner scene camera and update uniforms
  useFrame(({ camera }) => {
    if (!frames) return;

    camera.getWorldPosition(refDeferred.current.uniforms.uCameraPosition.value);
    refDeferred.current.uniforms.uCameraNear.value = camera.near;
    refDeferred.current.uniforms.uCameraFar.value = camera.far;

    refDeferred.current.uniforms.uCameraProjectionMatrix.value.copy(
      camera.projectionMatrix
    );
    refDeferred.current.uniforms.uCameraProjectionMatrixInverse.value.copy(
      camera.projectionMatrixInverse
    );
    refDeferred.current.uniforms.uCameraMatrixWorld.value.copy(
      camera.matrixWorld
    );
  }, renderPriority);

  return <>{children}</>;
};
