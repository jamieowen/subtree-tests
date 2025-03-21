import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
import oceanFrag from '@/webgl/glsl/6_fall/ocean.frag';
import { urls } from '@/config/assets';

export const OceanMaterial = ({ color, map, ...props }) => {
  // const [tNoise] = useTexture([
  //   urls.t_noise,
  // ]);
  // tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

  const shaderProps = useMemo(() => {
    return {
      vertexShader: baseVert,
      fragmentShader: oceanFrag,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new Color(color) },
        tMap: { value: map },
        // tNoise: { value: tNoise },
      },
    };
  }, []);

  useFrame((state, delta) => {
    shaderProps.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <shaderMaterial
      {...shaderProps}
      // transparent={true}
      depthWrite={false}
    />
  );
};
