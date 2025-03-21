import { AnimationMixer } from 'three';

export function useModelAnimation(
  ref,
  clip,
  speed = { current: 1 },
  enabled = true,
  fps
) {
  let mixer = useRef(null);
  let action = useRef(null);

  useEffect(() => {
    mixer.current = new AnimationMixer(ref.current);
    action.current = mixer.current.clipAction(clip);

    action.current.play();

    return () => {
      action.current.stop();
    };
  }, [ref, clip]);

  useFrameFps(
    (state, delta) => {
      if (!mixer.current) return;

      mixer.current.update(delta * speed.current);
    },
    null,
    fps
  );

  useEffect(() => {
    if (!enabled) {
      action.current.stop();
    } else {
      action.current.play();
    }
  }, [enabled]);

  return {
    mixer,
    action,
  };
}
