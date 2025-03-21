import { useThree } from '@react-three/fiber';

export const useMeshClick = (ref, callback) => {
  const gl = useThree((state) => state.gl);
  const size = useThree((state) => state.size);
  const raycaster = useThree((state) => state.raycaster);
  const camera = useThree((state) => state.camera);

  const pointer = useMemo(() => {
    return new Vector2();
  }, []);

  const onClick = useCallback(
    (evt) => {
      pointer.x = (evt.clientX / size.width) * 2 - 1;
      pointer.y = -(evt.clientY / size.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects([ref.current]);
      let intersecting = intersects.length > 0;

      if (intersecting) {
        callback?.();
      }
    },
    [size, pointer, camera, ref, callback]
  );

  useEffect(() => {
    gl.domElement.addEventListener('click', onClick);
    return () => {
      gl.domElement.removeEventListener('click', onClick);
    };
  }, [gl, onClick]);
};
