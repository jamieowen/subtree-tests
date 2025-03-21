import baseVert from '@/webgl/glsl/utils/base.vert';
import fxaa3 from '@/webgl/glsl/utils/fxaa3.frag';
import { RenderTexture as RenderTextureDrei } from '@react-three/drei';

export const FXAA3 = ({ enabled, children }) => {
  const size = useThree((s) => s.size);
  const viewport = useThree((s) => s.viewport);

  const refTexture = useRef(null);

  const shader = useMemo(() => {
    return {
      uniforms: {
        tDiffuse: { value: refTexture.current },
        resolution: {
          value: new Vector2(
            size.width * viewport.dpr,
            size.height * viewport.dpr
          ),
        },
      },
      vertexShader: baseVert,
      fragmentShader: fxaa3,
    };
  }, [refTexture]);

  useEffect(() => {
    shader.uniforms.tDiffuse.value = refTexture.current;
  });

  useEffect(() => {
    shader.uniforms.resolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  }, [size, viewport]);

  return (
    <>
      {enabled ? (
        <mesh geometry={fsTriangle}>
          <shaderMaterial {...shader} />
          <RenderTextureDrei ref={refTexture}>{children}</RenderTextureDrei>
        </mesh>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
