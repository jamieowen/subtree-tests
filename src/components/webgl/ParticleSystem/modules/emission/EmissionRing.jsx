function getRandomPointsOnRing(R, r, count = 1000) {
  return new Array(count).fill(0).map((p) => {
    let rand = Math.random();
    let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
    return new THREE.Vector3().setFromSphericalCoords(
      radius,
      Math.PI * 0.5,
      Math.random() * 2 * Math.PI
    );
  });
}

import { useContext } from 'react';

export const EmissionRing = function ({
  innerRadius = 0.5,
  outerRadius = 1,
  debug = false,
  ...props
}) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  useEffect(() => {
    const dtPos = Object.values(simulator.variableData)[0].uniforms.tShapeFrom
      .value;
    const dataPos = dtPos.image.data;

    const dtNormal = Object.values(simulator.variableData)[0].uniforms
      .tShapeNormal.value;
    const dataNormal = dtNormal.image.data;

    const stub = new Vector3();

    const R = outerRadius;
    const r = innerRadius;

    for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
      let rand = Math.random();
      let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
      stub.setFromSphericalCoords(
        radius,
        Math.PI * 0.5,
        Math.random() * 2 * Math.PI
      );

      dataPos[i + 0] = stub.x;
      dataPos[i + 1] = stub.y;
      dataPos[i + 2] = stub.z;

      dataNormal[i + 0] = 0;
      dataNormal[i + 1] = 1;
      dataNormal[i + 2] = 0;
    }

    dtPos.needsUpdate = true;
    dtNormal.needsUpdate = true;
  }, [dataSize, innerRadius, outerRadius]);

  return (
    <>
      {debug && (
        <mesh>
          <ringGeometry args={[innerRadius, outerRadius, 16, 1]} />
          <MeshMaterialWithNormalPos wireframe={true} />
        </mesh>
      )}
    </>
  );
};
