import CustomShaderMaterial from 'three-custom-shader-material';

import baseVert from '@/webgl/glsl/utils/base.vert';
import baseFrag from '@/webgl/glsl/utils/base.frag';

import smokeVert from '@/webgl/glsl/1_gas/smoke.vert';
import smokeFrag from '@/webgl/glsl/1_gas/smoke.frag';

import { useNoise } from '@funtech-inc/use-shader-fx';

import { forwardRef, useMemo } from 'react';
import { DoubleSide, MeshToonMaterial } from 'three';

export const SmokeMaterial = forwardRef(
  ({ dataSize, tPosition, children, ...props }, ref) => {
    const { size, viewport, camera } = useThree();

    const [updateNoise, , { output }] = useNoise({
      size,
      dpr: viewport.dpr,
    });
    useFrame(updateNoise);

    // UNIFORMS
    const uniforms = useMemo(
      () => ({
        uTime: { value: 0 },
        uDelta: { value: 0 },

        uScaleFactor: { value: 0.85 },

        tMask: { value: output },
      }),
      []
    );

    useFrame((state, delta) => {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uDelta.value = delta;
    });

    return (
      <CustomShaderMaterial
        ref={ref}
        baseMaterial={MeshToonMaterial}
        vertexShader={smokeVert}
        fragmentShader={smokeFrag}
        uniforms={uniforms}
        transparent="true"
        alphaToCoverage="true"
        emissive={0xffffff}
        emissiveIntensity={0.28}
        {...props}
        side={DoubleSide}
        silent
      >
        {children}
      </CustomShaderMaterial>
    );
  }
);

export default SmokeMaterial;
