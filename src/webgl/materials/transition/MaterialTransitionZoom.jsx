import baseVert from '@/webgl/glsl/utils/base.vert';
import zoomFrag from '@/webgl/glsl/transitions/zoom.frag';

export const MaterialTransitionZoom = forwardRef(
  ({ state, children, ...props }, ref) => {
    const uniforms = useMemo(() => {
      return {
        mixRatio: { value: 0 },
        tDiffuse1: { value: null },
        tDiffuse2: { value: null },
        tMixTexture: { value: null },

        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uTime: { value: 0 },
        uFishEyeStrength: { value: 0.07 },
        uBlurStrength: { value: 0.15 },
      };
    }, []);

    useFrame(({ clock }, delta) => {
      const state = transitionState.getState();
      // if (state?.config?.material?.name !== 'MaterialTransitionZoom') return;

      if (state.fboNext?.texture) {
        uniforms.tDiffuse1.value = state.fboNext.texture;
      }
      if (state.fboCurr?.texture) {
        uniforms.tDiffuse2.value = state.fboCurr.texture;
      }
      uniforms.mixRatio.value = state.mixRatio;

      uniforms.uTime.value = clock.getElapsedTime();

      if (
        state.config.material.name == 'MaterialTransitionZoom' &&
        state.config.material.uniforms
      ) {
        for (let [name, value] of Object.entries(
          state.config.material.uniforms
        )) {
          uniforms[name].value = value;
        }
      }
    });

    return (
      <mesh>
        <shaderMaterial
          ref={ref}
          vertexShader={baseVert}
          fragmentShader={zoomFrag}
          uniforms={uniforms}
        />
      </mesh>
    );
  }
);
