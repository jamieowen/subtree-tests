// ***************************************************************************
//
// Rotation Noise
// ADDS noise to the position of a particle
//
// ***************************************************************************

import { useContext, useRef } from 'react';

import curl from '@/webgl/glsl/utils/curl.glsl';

export const RotationGroundLimit = function ({ y = 0 }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'RotationGroundLimit',
    simulator,
    variableName: 'Rotation',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uRotationGroundLimit;
      `,
      execute: /*glsl*/ `
        vec3 pos = currPosition.xyz + uWorldPos.xyz;
        if (pos.y <= uRotationGroundLimit) {
          nextRotation.xyzw = currRotation.xyzw;
        }
      `,
    },
    uniforms: {
      uRotationGroundLimit: { value: y },
    },
  });

  useEffect(() => {
    variable.instance.material.uniforms.uRotationGroundLimit.value = y;
  }, [variable, y]);

  return null;
};
