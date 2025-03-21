import { forwardRef } from 'react';

import { RenderTexture, OrthographicCamera } from '@react-three/drei';

import baseVert from '@/webgl/glsl/utils/base.vert';
import noiseFrag from '@/webgl/glsl/noise/curl.frag';

export const NoiseTexture = forwardRef(
  (
    {
      size = 128,
      strength = 1, // float | vec3
      scrollSpeed = [0.5, 1], // float | vec2
      offset = 0, // float | vec2
    },
    ref
  ) => {
    const refMaterial = useRef(null);

    // *********************************************
    //
    // UNIFORMS
    //
    // *********************************************
    const _strength = useMemo(() => {
      if (Array.isArray(strength)) {
        return strength;
      } else {
        return [strength, strength, strength];
      }
    }, []);

    const _scrollSpeed = useMemo(() => {
      if (Array.isArray(scrollSpeed)) {
        return scrollSpeed;
      } else {
        return [scrollSpeed, scrollSpeed];
      }
    }, []);

    const _offset = useMemo(() => {
      if (Array.isArray(offset)) {
        return offset;
      } else {
        return [offset, offset];
      }
    }, []);

    const uniforms = useMemo(() => {
      return {
        uTime: { value: 0 },
        uDelta: { value: 0 },
        uStrength: { value: _strength },
        uScrollSpeed: { value: scrollSpeed },
        uOffset: { value: _offset },
      };
    }, []);

    useEffect(() => {
      const u = uniforms.uStrength;
      u.value[0] = _strength[0];
      u.value[1] = _strength[1];
      u.value[2] = _strength[2];
    }, [_strength]);

    useEffect(() => {
      uniforms.uScrollSpeed[0] = _scrollSpeed[0];
      uniforms.uScrollSpeed[1] = _scrollSpeed[1];
    }, [_scrollSpeed]);

    useEffect(() => {
      uniforms.uOffset[0] = _offset[0];
      uniforms.uOffset[1] = _offset[1];
    }, [_offset]);

    useFrame((state, delta) => {
      uniforms.uTime.value = state.clock.getElapsedTime();
      uniforms.uDelta.value = delta;
    });

    return (
      <RenderTexture
        ref={ref}
        width={size}
        height={size}
        depthBuffer={false}
        attach="map"
      >
        <FsTriangleCamera />
        <mesh>
          <planeGeometry args={[2, 2]} />
          <shaderMaterial
            ref={refMaterial}
            vertexShader={baseVert}
            fragmentShader={noiseFrag}
            uniforms={uniforms}
          />
        </mesh>
      </RenderTexture>
    );
  }
);
