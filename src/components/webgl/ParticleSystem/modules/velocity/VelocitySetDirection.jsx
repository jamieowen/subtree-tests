// ***************************************************************************
//
// Velocity Direction
// SETS the velocity of the particle to a specific direction
//
// ***************************************************************************

import { useContext } from 'react';

// Velocity is set

export const VelocitySetDirection = function ({ direction = [0, 1, 0] }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocitySetDirection',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uVelocityDirection_Direction;
      `,
      reset: /*glsl*/ `
        nextVelocity.xyz = uVelocityDirection_Direction.xyz;
      `,
    },
    uniforms: {
      uVelocityDirection_Direction: { value: direction },
    },
  });

  useEffect(() => {
    const u = variable.instance.material.uniforms.uVelocityDirection_Direction;
    u.value[0] = direction[0];
    u.value[1] = direction[1];
    u.value[2] = direction[2];
  }, [direction]);

  return <></>;
};
