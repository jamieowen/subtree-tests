import { mouse } from '@/stores/mouse';

export const POINTER_DOWN = 'POINTER_DOWN';
export const POINTER_UP = 'POINTER_UP';

export const MouseTracker = () => {
  const emitter = useMitt();

  const onPointerEnter = (evt) => {};
  const onPointerMove = (evt) => {
    Object.assign(mouse, {
      clientX: evt.clientX,
      clientY: evt.clientY,
      x: evt.clientX / window.innerWidth,
      y: evt.clientY / window.innerHeight,
    });
  };
  const onPointerLeave = (evt) => {
    Object.assign(mouse, {
      clientX: undefined,
      clientY: undefined,
      x: undefined,
      y: undefined,
    });
  };
  const onPointerDown = (evt) => {
    Object.assign(mouse, {
      isDown: true,
      clientX: evt.clientX,
      clientY: evt.clientY,
      x: evt.clientX / window.innerWidth,
      y: evt.clientY / window.innerHeight,
    });
    emitter.emit(POINTER_DOWN, evt);
  };
  const onPointerUp = (evt) => {
    Object.assign(mouse, {
      isDown: false,
      clientX: evt.clientX,
      clientY: evt.clientY,
      x: evt.clientX / window.innerWidth,
      y: evt.clientY / window.innerHeight,
    });
    emitter.emit(POINTER_UP, evt);
  };

  useEffect(() => {
    window.addEventListener('pointerenter', onPointerEnter);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerout', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('pointerenter', onPointerEnter);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
    };
  });
};
