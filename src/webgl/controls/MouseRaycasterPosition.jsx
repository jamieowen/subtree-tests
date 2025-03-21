export const MouseRaycasterPosition = ({
  target,
  children,
  offset = [0, 0, 0],
  onClick = () => {},
  ...props
}) => {
  const refRoot = useRef();

  const getMouse = useMouse2();

  // const pointer = useMemo(() => {
  //   return new Vector2();
  // }, []);

  // useEffect(() => {
  //   const onPointerMove = (evt) => {
  //     pointer.x = (evt.clientX / window.innerWidth) * 2 - 1;
  //     pointer.y = -(evt.clientY / window.innerHeight) * 2 + 1;
  //   };
  //   window.addEventListener('pointermove', onPointerMove);
  //   return () => {
  //     window.removeEventListener('pointermove', onPointerMove);
  //   };
  // }, []);

  useFrame(({ raycaster, camera }, delta) => {
    const mouse = getMouse();
    const pointer = new Vector2(mouse.x * 2 - 1, mouse.y * -2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects([target.current]);
    let intersecting = intersects.length > 0;

    if (intersecting) {
      const intersect = intersects[0];
      console.log(intersect.point);
      refRoot.current.position.copy(intersect.point);
    }
  });

  const _onClick = useCallback(() => {
    onClick({
      x: refRoot.current.position.x,
      y: refRoot.current.position.y,
      z: refRoot.current.position.z,
    });
  });

  useEffect(() => {
    window.addEventListener('click', _onClick);
    return () => {
      window.removeEventListener('click', _onClick);
    };
  }, [_onClick]);

  return (
    <group ref={refRoot}>
      <group position={offset}>{children}</group>
    </group>
  );
};
