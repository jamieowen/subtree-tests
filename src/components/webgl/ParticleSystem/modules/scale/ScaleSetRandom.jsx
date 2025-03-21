// ***************************************************************************
//
// Position Noise
// ADDS noise to the position of a particle
//
// ***************************************************************************

import { useContext, useMemo, useRef } from 'react';

import range from '@/webgl/glsl/utils/range.glsl';

export const ScaleSetRandom = function ({
  min = [1, 1, 1],
  max = [1.3, 1.3, 1.3],
  uniformScalar = true,
}) {
  const { simulator } = useContext(ParticleSystemContext);

  const reset = useMemo(() => {
    if (uniformScalar) {
      return /*glsl*/ `
        vec3 scale = crange(
          vec3(iterationRandom.xxx),
          vec3(0.),
          vec3(1.),
          uScaleMin,
          uScaleMax
        );
        nextPosition.xyz *= 0.1;
    `;
    } else {
      return /*glsl*/ `
        vec3 scale = crange(
          iterationRandom.xyz,
          vec3(0.),
          vec3(1.),
          uScaleMin,
          uScaleMax
        );
        nextPosition.xyz *= scale;
      `;
    }
  }, []);
  useSimulatorModule({
    name: 'PositionAddNoise',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uScaleMin;  
        uniform vec3 uScaleMax;

        ${range}
      `,
      reset,
    },
    uniforms: {
      uScaleMin: { value: min },
      uScaleMax: { value: max },
    },
  });

  return null;
};
