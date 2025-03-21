import { BufferGeometry, InstancedBufferAttribute, PlaneGeometry } from 'three';

export const GeometryRibbon = ({ count = 1, thickness = 1 }) => {
  const { _key, maxParticles, refMesh } = useContext(ParticleSystemContext);

  const shape = suspend(async () => {
    return generateRibbon(thickness, maxParticles / count);
  }, [`${_key}-GeometryRibbon-${count}-${thickness}`]);

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
  }, [refMesh, shape, count]);
};
