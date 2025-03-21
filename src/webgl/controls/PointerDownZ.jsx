export const PointerDownZ = ({ children, to = [0, 0, -1], ...props }) => {
  const refRoot = useRef(null);
  const isHovering = useMeshHover(refRoot);
  useZCursor(isHovering);

  const { contextSafe } = useGSAP({ scope: refRoot });

  const onClick = contextSafe(() => {
    console.log('onClick');
    let tl = new gsap.timeline({ options: { overwrite: true } });
    tl.to(refRoot.current.position, {
      x: to[0],
      y: to[1],
      z: to[2],
      duration: 0.1,
      ease: 'expo.out',
    });
    tl.to(refRoot.current.position, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: 'power1.out',
    });
  });

  useMeshClick(refRoot, onClick);

  return <group ref={refRoot}>{children}</group>;
};
