export const FloatRough = ({ amplitude = 0.1, children, ...props }) => {
  const refRoot = useRef();

  useEffect(() => {
    const ease = `rough()`;

    let tween = gsap.to(refRoot.current.position, {
      y: amplitude,
      ease,
      duration: 1,
      repeat: -1,
      yoyo: true,
    });
    return () => {
      tween.kill();
    };
  }, [amplitude]);

  return <group ref={refRoot}>{children}</group>;
};
