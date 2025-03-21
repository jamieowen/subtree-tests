import baseVert from '@/webgl/glsl/utils/base.vert';
import mixFrag from '@/webgl/glsl/transitions/mix.frag';
import { transitionState } from '../../../components/webgl/scenes/NoseScenes';

export const MaterialTransitionMix = forwardRef(
  ({ children, ...props }, ref) => {
    const refTextureLine = useRef(null);
    const refTextureImage = useRef(null);
    const refTextureDevice = useRef(null);
    const refTextureFrame = useRef(null);

    const uniforms = useMemo(() => {
      return {
        mixRatio: { value: 0 },
        threshold: { value: 0 },
        tDiffuse1: { value: null },
        tDiffuse2: { value: null },
        tMixTexture: { value: null },
      };
    }, []);

    useFrame(() => {
      // if (!state.current?.config?.material?.name) return;

      const state = transitionState.getState();
      // if (state?.config?.material?.name !== 'MaterialTransitionMix') return;

      if (state.fboNext?.texture) {
        uniforms.tDiffuse1.value = state.fboNext.texture;
      }
      if (state.fboCurr?.texture) {
        uniforms.tDiffuse2.value = state.fboCurr.texture;
      }
      uniforms.mixRatio.value = state.mixRatio;

      uniforms.threshold.value = state.config.material?.props?.threshold || 0;

      if (!state.config.material?.props?.texture) return;
      switch (state.config.material.props.texture.name) {
        case 'MixTextureLine':
          uniforms.tMixTexture.value = refTextureLine.current;
          break;
        case 'MixTextureImage':
          uniforms.tMixTexture.value = refTextureImage.current;
          break;
        case 'MixTextureDevice':
          uniforms.tMixTexture.value = refTextureDevice.current;
          break;
        case 'MixTextureFrame':
          uniforms.tMixTexture.value = refTextureFrame.current;
          break;
        default:
          break;
      }
    });

    return (
      <mesh>
        <shaderMaterial
          ref={ref}
          vertexShader={baseVert}
          fragmentShader={mixFrag}
          uniforms={uniforms}
        >
          <MixTextureLine ref={refTextureLine} />
          <MixTextureImage ref={refTextureImage} />
          <MixTextureDevice ref={refTextureDevice} />
          <MixTextureFrame ref={refTextureFrame} />
        </shaderMaterial>
      </mesh>
    );
  }
);
