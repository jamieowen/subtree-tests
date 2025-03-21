import { Fog as ThreeFog } from 'three';

export const Fog = function ({ color, near = 1, far = 1000 }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.fog = new ThreeFog(new Color(color), near, far);

    return () => {
      scene.fog = null;
    };
  }, [scene, color, near, far]);

  return <></>;
};

export default Fog;
