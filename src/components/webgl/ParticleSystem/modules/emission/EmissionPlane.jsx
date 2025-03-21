import { useContext } from 'react';

export const EmissionPlane = function ({
  width = 1,
  height = 1,
  plane = 'xy',
  debug = false,
  maxSamples,
  ...props
}) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  useEffect(() => {
    const dtPos = Object.values(simulator.variableData)[0].uniforms.tShapeFrom
      .value;
    const dataPos = dtPos.image.data;

    // const dtNormal = Object.values(simulator.variableData)[0].uniforms
    //   .tShapeNormal.value;
    // const dataNormal = dtNormal.image.data;

    const _maxSamples = maxSamples || dataSize * dataSize * 0.5;
    for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
      const shouldSample = _maxSamples == undefined || i < _maxSamples * 4;

      if (shouldSample) {
        switch (plane[0]) {
          case 'x':
            dataPos[i + 0] = Math.random() * width - width / 2;
            break;
          case 'y':
            dataPos[i + 1] = Math.random() * height - height / 2;
            break;
          case 'z':
            dataPos[i + 2] = Math.random() * width - width / 2;
            break;
        }
        switch (plane[1]) {
          case 'x':
            dataPos[i + 0] = Math.random() * width - width / 2;
            break;
          case 'y':
            dataPos[i + 1] = Math.random() * height - height / 2;
            break;
          case 'z':
            dataPos[i + 2] = Math.random() * width - width / 2;
            break;
        }
      } else {
        const j = Math.floor(i % (Math.floor(_maxSamples) * 4));

        dataPos[i + 0] = dataPos[j + 0];
        dataPos[i + 1] = dataPos[j + 1];
        dataPos[i + 2] = dataPos[j + 2];

        // dataNormal[i + 0] = dataNormal[j + 0];
        // dataNormal[i + 1] = dataNormal[j + 1];
        // dataNormal[i + 2] = dataNormal[j + 2];
      }
    }

    dtPos.needsUpdate = true;
    // dtNormal.needsUpdate = true;
  }, [dataSize, width, height]);

  return (
    <>
      {debug && (
        <mesh args={[width, height]}>
          <planeGeometry args={[width, height]} />
          {/* <meshBasicMaterial
            color="red"
            wireframe
            side={DoubleSide}
          /> */}
          <GBufferMaterial
            wireframe
            side={DoubleSide}
          >
            <MaterialModuleNormal />
            <MaterialModuleColor color={'red'} />
          </GBufferMaterial>
        </mesh>
      )}
    </>
  );
};
