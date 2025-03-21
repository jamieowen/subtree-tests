import { forwardRef } from 'react';

export const Sound = forwardRef(({ id, loop = true, volume = 1.0 }, ref) => {
  const sound = useAsset(urls[id]);

  useEffect(() => {
    sound.loop = loop;
    if (loop) {
      sound.play();
    } else {
      sound.stop();
    }
  }, [loop]);

  useEffect(() => {
    sound.volume = volume;
  }, [volume]);

  useImperativeHandle(ref, () => ({
    play: () => {
      sound.play();
    },
    stop: () => {
      sound.stop();
    },
    get volume() {
      return sound.volume;
    },
    set volume(value) {
      sound.volume = value;
    },
  }));

  return <></>;
});
