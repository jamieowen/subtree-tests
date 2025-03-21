import { useContext } from 'react';
import { randFloatSpread } from 'three/src/math/MathUtils.js';
import { randomInRange } from '@/helpers/MathUtils.js';
import { Box } from '@react-three/drei';

export const EmissionRandomVolume = function ({
  range = {
    min: [-1, -1, -1],
    max: [1, 1, 1],
  },
  debug = false,
  ...props
}) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  useEffect(() => {
    let dt = Object.values(simulator.variableData)[0].uniforms.tShapeFrom.value;
    const data = dt.image.data;

    for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
      data[i + 0] = randomInRange(range.min[0], range.max[0]);
      data[i + 1] = randomInRange(range.min[1], range.max[1]);
      data[i + 2] = randomInRange(range.min[2], range.max[2]);
    }

    dt.needsUpdate = true;
  }, [dataSize, range]);

  return (
    <>
      {debug && (
        <Box
          args={[
            range.max[0] - range.min[0],
            range.max[1] - range.min[1],
            range.max[2] - range.min[2],
          ]}
        >
          <GBufferMaterial wireframe>
            <MaterialModuleNormal />
            <MaterialModuleColor color="white" />
          </GBufferMaterial>
        </Box>
      )}
    </>
  );
};
