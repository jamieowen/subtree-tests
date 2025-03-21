import { useFPSLimiter, useMarble } from '@funtech-inc/use-shader-fx';

export const MixTextureMarble = forwardRef(function (
  { enabled, id, mixRatio, shaderProps = {}, ...props },
  ref
) {
  const { size, viewport } = useThree();

  const [updateMarble, , { output }] = useMarble({
    size,
    dpr: viewport.dpr,
  });

  useFrame((p) => {
    if (!enabled) return;
    updateMarble(p, {
      // warpStrength: 8 + uniforms.current.mixRatio.value * 10,
      // timeStrength: 0.2 + mixRatio.current * 0.1,
    });
  });

  useImperativeHandle(
    ref,
    () => {
      return output;
    },
    [output]
  );

  return (
    <>
      <primitive
        ref={ref}
        object={output}
        {...props}
      />
    </>
  );
});
