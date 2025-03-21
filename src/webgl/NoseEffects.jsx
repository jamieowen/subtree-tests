import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  Scanline,
  SMAA,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useAppStore } from '@/stores/app';
import { damp, dampC } from 'maath/easing';

export const NoseEffects = () => {
  // const refBloom = useRef(null);

  const lightConfig = useAppStore((state) => state.lightConfig);

  return (
    <>
      <EffectComposer
        depthBuffer={true}
        multisampling={0}
      >
        <Bloom
          // ref={refBloom}
          intensity={lightConfig?.bloom?.intensity || 1}
          luminanceThreshold={lightConfig?.bloom?.luminanceThreshold || 1}
          luminanceSmoothing={lightConfig?.bloom?.luminanceSmoothing || 0.025}
          // KAWASE BLUR
          // resolutionScale={0.5}
          // kernelSize={KernelSize.LARGE}
          // MIP MAP BLUR
          mipmapBlur={true} // Enables or disables mipmap blur.
          radius={1.0}
          levels={6}
        />
      </EffectComposer>
    </>
  );
};
