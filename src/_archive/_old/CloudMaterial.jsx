import CustomShaderMaterial from 'three-custom-shader-material';

import cloudVert from '@/webgl/glsl/6_fall/cloud.vert';
import cloudFrag from '@/webgl/glsl/6_fall/cloud.frag';

import { forwardRef, useMemo } from 'react';
import { MeshBasicMaterial } from 'three';

import { urls } from '@/config/assets';

export const CloudMaterial = forwardRef(
  ({ dataSize, children, ...props }, ref) => {
    const cloudTexture = useTexture(urls.t_fall_cloud);

    // UNIFORMS
    const uniforms = useMemo(
      () => ({
        uTime: { value: 0 },
        uDelta: { value: 0 },
        uTexture: { value: cloudTexture },
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
        baseMaterial={MeshBasicMaterial}
        vertexShader={cloudVert}
        fragmentShader={cloudFrag}
        uniforms={uniforms}
        alphaTest={0.5}
        // transparent={true}
        {...props}
        silent
      />
    );
  }
);
