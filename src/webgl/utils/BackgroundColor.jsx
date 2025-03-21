export const BackgroundColor = function ({ color }) {
  const { scene } = useThree();

  const _color = useColor(color);

  useEffect(() => {
    scene.background = _color;
  }, [scene, _color]);

  return <></>;
};

export default BackgroundColor;
