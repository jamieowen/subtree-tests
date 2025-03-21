import { clamp } from '@/helpers/MathUtils';
import { AnimationMixer } from 'three';

export const useModelAnimationProgress = (ref, clip, progress, fps) => {
  let mixer = useRef(null);
  let action = useRef(null);
  let duration = useRef(null);

  useEffect(() => {
    mixer.current = new AnimationMixer(ref.current);
    action.current = mixer.current.clipAction(clip, ref.current);
    action.current.play();
    duration.current = clip.duration * 0.999999999;
  }, [ref, clip]);

  useFrameFps(
    (state, delta) => {
      if (!mixer.current) return;
      if (!progress) return;

      mixer.current.time = 0;
      action.current.time = 0;
      let p = clamp(progress.current, 0, 1);
      mixer.current.update(p * duration.current);
    },
    null,
    fps
  );

  return {
    mixer,
    action,
  };
};
