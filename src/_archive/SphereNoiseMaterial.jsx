import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
import sphereNoiseFrag from '@/webgl/glsl/utils/sphereNoise.frag';

export const SphereNoiseMaterial = ({ map, speed, amount, ...props }) => {
  const shaderProps = useMemo(() => {
    return {
      vertexShader: baseVert,
      fragmentShader: sphereNoiseFrag,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: speed },
        uAmount: { value: amount },

        tMap: { value: map },
      },
    };
  }, []);

  useEffect(() => {
    shaderProps.uniforms.tMap.value = map;
  }, [map]);

  useEffect(() => {
    shaderProps.uniforms.uSpeed.value = speed;
  }, [speed]);

  useEffect(() => {
    shaderProps.uniforms.uAmount.value = amount;
  }, [amount]);

  useFrame((state, delta) => {
    shaderProps.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <shaderMaterial
      {...shaderProps}
      {...props}
    />
  );
};
