import { useFPSLimiter, useNoise } from '@funtech-inc/use-shader-fx';

export const MixTextureNoise = forwardRef(function (
  { enabled, id, mixRatio, shaderProps = {}, ...props },
  ref
) {
  const { size, viewport } = useThree();

  const [updateNoise, , { output }] = useNoise({
    size,
    dpr: viewport.dpr,
  });

  useFrame((p) => {
    if (!enabled) return;
    updateNoise(p, {
      warpStrength: 8 + mixRatio.current * 10,
    });
  });

  // useImperativeHandle(
  //   ref,
  //   () => {
  //     return output;
  //   },
  //   [output]
  // );

  return (
    <primitive
      ref={ref}
      object={output}
      {...props}
    />
  );
});
