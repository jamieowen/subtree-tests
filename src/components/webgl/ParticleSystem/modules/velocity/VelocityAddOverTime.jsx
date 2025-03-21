// ***************************************************************************
//
// Velocity Outwards
// ADDS to the velocity of the particle based on a direction over time
//
// ***************************************************************************

import { useContext } from 'react';

// Add velocity over time
// velocity += direction * deltaTime
// e.g. Gravity = [0, -9.81, 0]

export const VelocityAddOverTime = function ({ direction = [0, -1, 0] }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocityAddOverTime',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uVelocityOverTime;
      `,
      execute: /*glsl*/ `
        nextVelocity.xyz += uVelocityOverTime * uDelta;
      `,
    },
    uniforms: {
      uVelocityOverTime: { value: direction },
    },
  });

  useEffect(() => {
    const u = variable.instance.material.uniforms.uVelocityOverTime;
    u.value[0] = direction[0];
    u.value[1] = direction[1];
    u.value[2] = direction[2];
  }, [direction]);

  return <></>;
};
