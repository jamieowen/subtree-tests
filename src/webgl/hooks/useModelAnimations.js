import { AnimationMixer } from 'three';

export function useModelAnimations(ref, clips, speed = 1) {
  const mixer = useRef(null);
  const actions = useRef([]);

  useEffect(() => {
    mixer.current = new AnimationMixer(ref.current);

    actions.current = [];
    for (let clip of clips) {
      let action = mixer.current.clipAction(clip);
      actions.current.push(action);
    }
  }, [ref, clips]);

  useFrame((state, delta) => {
    if (!mixer.current) return;
    mixer.current.update(delta * speed);
  });

  return {
    mixer,
    actions,
  };
}
