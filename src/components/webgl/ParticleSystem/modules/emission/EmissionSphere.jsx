import { useContext } from 'react';

export const EmissionSphere = function ({
  radius = 1,
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

    for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
      stub.randomDirection();
      dataPos[i + 0] = stub.x * radius;
      dataPos[i + 1] = stub.y * radius;
      dataPos[i + 2] = stub.z * radius;

      dataNormal[i + 0] = stub.x;
      dataNormal[i + 1] = stub.y;
      dataNormal[i + 2] = stub.z;
    }

    dtPos.needsUpdate = true;
    dtNormal.needsUpdate = true;
  }, [dataSize, radius]);

  return (
    <>
      {debug && (
        <Sphere args={[radius, 32, 32]}>
          {/* <MeshMaterialWithNormalPos wireframe={true} /> */}
          <GBufferMaterial
            side={DoubleSide}
            wireframe
          >
            <MaterialModuleColor color={0xffffff} />
          </GBufferMaterial>
        </Sphere>
      )}
    </>
  );
};
