// ***************************************************************************
//
// Rotation Align to Direction
// SETS the rotation of a particle to align with its velocity direction
// REQUIRES a Velocity module to be present
//
// ***************************************************************************

import { useContext } from 'react';

import directionToQuaternion from '@/webgl/glsl/utils/directionToQuaternion.glsl';

export const RotationSetNormal = function ({}) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'RotationSetNormal',
    simulator,
    variableName: 'Rotation',
    shaderChunks: {
      setup: /*glsl*/ `
        ${directionToQuaternion} 
      `,
      reset: /*glsl*/ `
        vec4 fromNormal = texture(tShapeNormal, st);
        nextRotation = directionToQuaternion(normalize(fromNormal.xyz));
      `,
    },
    uniforms: {},
  });

  return <></>;
};
