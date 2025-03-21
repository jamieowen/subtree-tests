import { BufferGeometry, BufferAttribute } from 'three';

export const ParticleSystemPointsGeometry = ({ dataSize = 1 }) => {
  // const { _key } = useContext(ParticleSystemContext);
  // const key = useMemo(() => {
  //   return _key || '';
  // });

  const geometry = suspend(async () => {
    const geo = new BufferGeometry();
    const positions = new Float32Array(dataSize * dataSize * 3);
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    return geo;
  }, [`ParticleSystemPointsGeometry-${dataSize}`]);

  // useEffect(() => {
  //   return () => {
  //     geometry.dispose();
  //     clear([`ParticleSystemPointsGeometry-${dataSize}`]);
  //   };
  // }, [geometry]);

  return (
    <primitive
      object={geometry}
      attach="geometry"
    />
  );
};
