import { BufferGeometry, InstancedBufferAttribute, PlaneGeometry } from 'three';

export const GeometryTube = ({ count = 1, thickness = 1 }) => {
  const { _key, maxParticles, refMesh } = useContext(ParticleSystemContext);

  const segments = useMemo(() => maxParticles / count, [maxParticles, count]);

  const shape = suspend(async () => {
    return generateTube(thickness, segments);
  }, [`${_key}-GeometryTubes-${segments}-${thickness}`]);

  useEffect(() => {
    const geometry = new BufferGeometry();

    for (let key in shape.attributes) {
      geometry.setAttribute(key, shape.attributes[key]);
    }

    const cNumber = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      cNumber[i] = i;
    }

    geometry.setAttribute('cNumber', new InstancedBufferAttribute(cNumber, 1));

    refMesh.current.count = count;
    refMesh.current.geometry = geometry;

    console.log(cNumber, geometry.attributes);
  }, [refMesh, shape, count]);
};
