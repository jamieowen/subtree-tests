// ***************************************************************************
//
// Rotation Align to Direction
// SETS the rotation of a particle to align with its velocity direction
// REQUIRES a Velocity module to be present
//
// ***************************************************************************

import { useContext } from 'react';

import directionToQuaternion from '@/webgl/glsl/utils/directionToQuaternion.glsl';

export const RotationSetAlignToDirection = function ({}) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'RotationSetAlignToDirection',
    simulator,
    variableName: 'Rotation',
    shaderChunks: {
      setup: /*glsl*/ `
        ${directionToQuaternion} 
      `,
      execute: /*glsl*/ `
        nextRotation = directionToQuaternion(normalize(currVelocity.xyz));
      `,
    },
    uniforms: {},
  });

  return <></>;
};
