import baseVert from '@/webgl/glsl/utils/base.vert';
// import fxaa from '@/webgl/glsl/utils/fxaa.frag';
import fxaa from '@/webgl/glsl/utils/fxaa-ogl.frag';
import { RenderTexture as RenderTextureDrei } from '@react-three/drei';

export const FXAA = ({ enabled, children }) => {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);

  const refTexture = useRef(null);

  const shader = useMemo(() => {
    return {
      uniforms: {
        uTexture: { value: refTexture.current },
        tDepth: { type: 't' },
        uResolution: {
          value: new Vector2(
            size.width * viewport.dpr,
            size.height * viewport.dpr
          ),
        },
      },
      vertexShader: baseVert,
      fragmentShader: /*glsl*/ `
        uniform sampler2D uTexture;
        uniform sampler2D tDepth;
        uniform vec2 uResolution;
        varying vec2 vUv;

        ${fxaa}

        void main() {
          // vec4 color = texture2D(uTexture, vUv); 
          vec4 aa = fxaa(uTexture, vUv, uResolution * 1.); 
          gl_FragColor = aa;
        }
      `,
    };
  }, [refTexture]);

  useEffect(() => {
    shader.uniforms.uTexture.value = refTexture.current;
    // shader.uniforms.tDepth.value = refTexture.current.tDepth;
  });

  useEffect(() => {
    shader.uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size, viewport]);

  return (
    <>
      {enabled ? (
        <mesh geometry={fsTriangle}>
          <shaderMaterial {...shader} />
          {/* <RenderTextureMulti ref={refTexture}>{children}</RenderTextureMulti> */}
          <RenderTextureDrei ref={refTexture}>{children}</RenderTextureDrei>
        </mesh>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
