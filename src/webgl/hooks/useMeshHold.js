import { useThree } from '@react-three/fiber';
import { clamp } from '@/helpers/MathUtils';

export const useMeshHold = (
  ref,
  {
    // enabled,
    time = 1,
    onPointerDown = () => {},
    onPointerUp = () => {},
    onComplete = () => {},
    once = false,
  }
) => {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);

  const pointer = useMemo(() => {
    return new Vector2();
  }, []);

  // const [isHolding, setIsHolding] = useState(false);

  const isHolding = create(() => false);
  const timeHeld = useRef(0);
  const progress = useRef(0);
  const triggered = useRef(false);

  const _onPointerDown = useCallback(
    (evt) => {
      // if (!enabled.getState()) return;
      if (once && triggered.current) return;
      pointer.x = (evt.clientX / size.width) * 2 - 1;
      pointer.y = -(evt.clientY / size.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects([ref.current]);
      let intersecting = intersects.length > 0;

      if (intersecting) {
        isHolding.setState(true);
        onPointerDown();
      }
    },
    [size, pointer, camera, ref, isHolding, onPointerDown]
  );

  const _onPointerMove = useCallback(
    (evt) => {
      if (once && triggered.current) return;
      pointer.x = (evt.clientX / size.width) * 2 - 1;
      pointer.y = -(evt.clientY / size.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects([ref.current]);
      let intersecting = intersects.length > 0;

      // if (intersecting) {
      //   isHolding.setState(true);
      //   onPointerDown();
      // }
      if (!intersecting && isHolding.getState()) {
        isHolding.setState(false);
        timeHeld.current = 0;
        onPointerUp();
      }
    },
    [size, pointer, camera, ref, isHolding, onPointerDown]
  );

  const _onPointerUp = useCallback(
    (evt) => {
      // console.log(
      //   'useMeshHold._onPointerUp',
      //   once,
      //   triggered.current,
      //   isHolding.getState()
      // );
      if (once && triggered.current) return;
      if (!isHolding.getState()) return;
      isHolding.setState(false);
      timeHeld.current = 0;
      onPointerUp();
    },
    [once, isHolding, triggered, timeHeld, onPointerUp]
  );

  const onContextMenu = (evt) => {
    evt.preventDefault();
  };

  useEffect(() => {
    gl.domElement.addEventListener('pointerdown', _onPointerDown);
    gl.domElement.addEventListener('pointermove', _onPointerMove);
    gl.domElement.addEventListener('pointerup', _onPointerUp);
    gl.domElement.addEventListener('pointerleave', _onPointerUp);
    gl.domElement.addEventListener('pointercancel', _onPointerUp);
    gl.domElement.addEventListener('pointerout', _onPointerUp);
    gl.domElement.addEventListener('contextmenu', onContextMenu);

    return () => {
      gl.domElement.removeEventListener('pointerdown', _onPointerDown);
      gl.domElement.removeEventListener('pointermove', _onPointerMove);
      gl.domElement.removeEventListener('pointerup', _onPointerUp);
      gl.domElement.removeEventListener('pointerleave', _onPointerUp);
      gl.domElement.removeEventListener('pointercancel', _onPointerUp);
      gl.domElement.removeEventListener('pointerout', _onPointerUp);
      gl.domElement.removeEventListener('contextmenu', onContextMenu);
    };
  }, [gl, _onPointerDown, _onPointerUp, _onPointerMove]);

  useFrame((state, delta) => {
    if (once && triggered.current) return;
    if (isHolding.getState()) {
      timeHeld.current += delta;
    }
    progress.current = clamp(timeHeld.current / time);

    if (progress.current >= 1) {
      // console.log('useMeshHold.completed');
      triggered.current = true;
      onComplete();
    }
  });

  return { isHolding, timeHeld, progress, triggered };
};
