import { urls } from '@/config/assets';
import radialPosition from '@/webgl/glsl/transitions/radialPosition.frag';
import baseVert from '@/webgl/glsl/utils/base.vert';
import { useFrame } from '@react-three/fiber';
import { RepeatWrapping } from 'three';

// ********************************************************************************
// MaterialMixRadialPosition
// ********************************************************************************

export const MaterialMixRadialPosition = forwardRef(
  (
    { fboCurr, fboNext, mixRatio, range = 30, startPosition = [0, 0, 0] },
    ref
  ) => {
    const [tTransition, tNoise] = useTexture([
      urls.t_radial_transition,
      urls.t_noise,
    ]);
    tTransition.wrapS = tTransition.wrapT = RepeatWrapping;
    tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

    const uniforms = useMemo(
      () => ({
        uRange: { value: range },
        uStartPosition: { value: startPosition },

        uMixRatio: { value: 0 },
        uTime: { value: 0 },
        tTransition: { value: tTransition },
        tNoise: { value: tNoise },
        tDiffuseCurr: { value: null },
        tWorldPosCurr: { value: null },
        tDiffuseNext: { value: null },
        tWorldPosNext: { value: null },
      }),
      [tNoise, tTransition]
    );

    useFrame(({ clock }) => {
      if (fboCurr.current?.refMaterial) {
        const diffuse = fboCurr.current.refMaterial.current.fbo.textures[0];
        const worldPos = fboCurr.current.refGbuffer.current.fbo.textures[2];
        uniforms.tDiffuseCurr.value = diffuse;
        uniforms.tWorldPosCurr.value = worldPos;
      }
      if (fboNext.current?.refMaterial) {
        // const [diffuse, normal, worldPos] = fboNext.current?.fbo.textures;
        const diffuse = fboNext.current.refMaterial.current.fbo.textures[0];
        const worldPos = fboNext.current.refGbuffer.current.fbo.textures[2];
        uniforms.tDiffuseNext.value = diffuse;
        uniforms.tWorldPosNext.value = worldPos;
      }

      uniforms.uMixRatio.value = mixRatio.current;
      uniforms.uTime.value = clock.elapsedTime;
    });

    return (
      <shaderMaterial
        ref={ref}
        vertexShader={baseVert}
        fragmentShader={radialPosition}
        uniforms={uniforms}
      />
    );
  }
);
