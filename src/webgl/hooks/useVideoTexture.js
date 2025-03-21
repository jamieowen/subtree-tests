import { VideoTexture } from 'three';

import { suspend, preload, clear } from 'suspend-react';

export function useVideoTexture(src, props = {}) {
  const { unsuspend, start, crossOrigin, muted, loop, ...rest } = {
    unsuspend: 'loadedmetadata',
    crossOrigin: 'Anonymous',
    muted: true,
    loop: true,
    start: true,
    playsInline: true,
    ...props,
  };
  const gl = useThree((state) => state.gl);
  const texture = suspend(
    () =>
      new Promise((res, rej) => {
        const video = Object.assign(document.querySelector('#video'), {
          src: (typeof src === 'string' && src) || undefined,
          srcObject: (src instanceof MediaStream && src) || undefined,
          crossOrigin,
          loop,
          muted,
          ...rest,
        });
        const texture = new VideoTexture(video);
        if ('colorSpace' in texture) texture.colorSpace = gl.outputColorSpace;
        else texture.encoding = gl.outputEncoding;

        video.addEventListener(unsuspend, () => res(texture));
      }),
    [src]
  );
  useEffect(() => {
    start && texture.image.play();
  }, [texture, start]);
  return texture;
}
