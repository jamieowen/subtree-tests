import { useContext } from 'react';

export const VelocityAddDirection = function ({ direction = [0, 1, 0] }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocityAddDirection',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uVelocityDirection_Direction;
      `,
      execute: /*glsl*/ `
        nextVelocity.xyz += uVelocityDirection_Direction.xyz;
      `,
    },
    uniforms: {
      uVelocityDirection_Direction: { value: direction },
    },
  });

  useEffect(() => {
    if (!variable?.instance?.material?.uniforms?.uVelocityDirection_Direction)
      return;
    const u = variable.instance.material.uniforms.uVelocityDirection_Direction;
    u.value[0] = direction[0];
    u.value[1] = direction[1];
    u.value[2] = direction[2];
  }, [variable, direction]);

  return <></>;
};
