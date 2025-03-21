import { useMitt } from '@/contexts/mitt';
import { addHandler } from '../contexts/mitt';

export default function useEvent(
  event,
  _handler,
  callUnregisteredHandler = false,
  ...deps
) {
  const emitter = useMitt();

  const hasRunOnce = useRef(false);

  const handler = useCallback(
    (...args) => {
      if (!emitter) return;

      _handler(...args);

      hasRunOnce.current = true;
    },
    [emitter, ...deps]
  );

  useEffect(() => {
    if (!emitter) {
      console.warn('useEvent: missing emitter', event);
      return;
    }
    if (!event || !_handler) {
      console.warn('useEvent: missing event or handler', event, _handler);
      return;
    }

    addHandler(event, handler, callUnregisteredHandler);

    return () => {
      removeHandler(event, handler);
    };
  }, [emitter, ...deps]);
}
