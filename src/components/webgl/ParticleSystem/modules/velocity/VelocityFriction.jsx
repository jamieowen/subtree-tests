// ***************************************************************************
//
// Velocity Friction
// ADDS to the velocity of the particle towards 0
//
// ***************************************************************************

import { useContext } from 'react';

export const VelocityFriction = function ({ amount = 1 }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocityFriction',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uVelocityFriction;
      `,
      execute: /*glsl*/ `
        nextVelocity.xyz *= uVelocityFriction;
      `,
    },
    uniforms: {
      uVelocityFriction: { value: amount },
    },
  });

  useEffect(() => {
    variable.instance.material.uniforms.uVelocityFriction.value = amount;
  }, [variable, amount]);

  return <></>;
};
