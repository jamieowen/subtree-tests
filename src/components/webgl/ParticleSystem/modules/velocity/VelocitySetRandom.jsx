import { useContext } from 'react';

export const VelocitySetRandom = function ({ speed = 1, acceleration = 0.1 }) {
  const { simulator } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocitySetRandom',
    simulator,
    variableName: 'Velocity',

    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uVelocitySetRandom_Speed;
        uniform float uVelocitySetRandom_Acceleration;
      `,
      execute: /*glsl*/ `
        vec3 acc = (rand.xyz) * uVelocitySetRandom_Acceleration;
        float m = rand.x < 0.5 ? 1.0 : -1.0;
        vec3 vel = rand.xyz * uVelocitySetRandom_Speed * m;

        vel *= acc;
        
        nextVelocity = vec4(vel, 1.0);
      `,
      reset: /*glsl*/ `
        nextVelocity.xyz = vec3(0.0);
      `,
    },
    uniforms: {
      uVelocitySetRandom_Speed: { value: speed },
      uVelocitySetRandom_Acceleration: { value: acceleration },
    },
  });

  useEffect(() => {
    variable.instance.material.uniforms.uVelocitySetRandom_Speed.value = speed;
  }, [variable, speed]);

  useEffect(() => {
    variable.instance.material.uniforms.uVelocitySetRandom_Acceleration.value =
      acceleration;
  }, [variable, acceleration]);

  return null;
};
