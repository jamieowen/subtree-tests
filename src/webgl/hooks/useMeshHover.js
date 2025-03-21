export const useMeshHover = (ref, enabled = true) => {
  const gl = useThree((state) => state.gl);

  const [hovering, setHovering] = useState(false);
  // const hovering = create(() => false);

  const pointer = useMemo(() => {
    return new Vector2(-1, -1);
  }, []);

  useEffect(() => {
    const onPointerMove = (evt) => {
      pointer.x = (evt.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(evt.clientY / window.innerHeight) * 2 + 1;
    };
    gl.domElement.addEventListener('pointermove', onPointerMove);

    return () => {
      gl.domElement.removeEventListener('pointermove', onPointerMove);
    };
  }, [gl, enabled]);

  useFrame(({ raycaster, camera }, delta) => {
    if (!enabled) return;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects([ref.current]);

    let intersecting = intersects.length > 0;

    // hovering.setState(intersecting);
    setHovering(intersecting);
  });

  useEffect(() => {
    // console.log('useMeshHover.enabled', enabled);
    if (!enabled) {
      // hovering.setState(false);
      setHovering(false);
    }
  }, [enabled, hovering]);

  return hovering;
};
