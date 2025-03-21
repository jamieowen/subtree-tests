import { gsap } from 'gsap';
import useEvent from './useEvent';
// import { useDeepCompareMemo } from 'use-deep-compare';

export const debounce = (func, delay, { leading } = {}) => {
  let timerId;

  return (...args) => {
    if (!timerId && leading) {
      func(...args);
    }
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  };
};

export default function useAnimation(
  { inParams = {}, outParams = {} } = {},
  deps = []
) {
  const tween = useRef();
  const _obj = useRef(0);

  const animateIn = useMemo(
    (_params = {}) =>
      // DOC: https://dmitripavlutin.com/react-throttle-debounce/
      debounce((e) => {
        if (!inParams) return;

        const params = { ...inParams, ..._params };

        if (params.shouldCancel?.(e)) return;
        if (tween.current) tween.current.kill();
        if (_obj.current === 1) _obj.current = 0;

        delete params.event;
        delete params.shouldCancel;

        tween.current = gsap.to(_obj, {
          current: 1,
          ...params,
          onStart: () => {
            // console.log('onStart', params);
            params?.onStart?.();
          },
          onUpdate: () => {
            params?.onUpdate?.(_obj.current);
          },
          onComplete: () => {
            tween.current = null;

            params?.onComplete?.();
          },
        });
      }, inParams?.debounce || 0),
    [inParams, ...deps]
  );

  const animateOut = useMemo(
    (_params = {}) =>
      debounce((e) => {
        if (!outParams) return;

        const params = { ...outParams, ..._params };

        if (tween.current) tween.current.kill();
        if (params.shouldCancel?.(e)) return;
        if (_obj.current === 0) _obj.current = 1;

        delete params.event;
        delete params.shouldCancel;

        tween.current = gsap.to(_obj, {
          current: 0,
          ...params,
          onStart: () => {
            params?.onStart?.();
          },
          onUpdate: () => {
            params?.onUpdate?.(_obj.current);
          },
          onComplete: () => {
            tween.current = null;
            params?.onComplete?.();
          },
        });
      }, inParams?.debounce || 0),
    [outParams, ...deps]
  );

  function kill() {
    tween.current?.kill?.();
  }

  return { animateIn, animateOut, kill };
}
