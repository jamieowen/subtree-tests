// ***************************************************************************
//
// Velocity Set Shape
// SETS the velocity of the particle to the direction of the shape
// direction = 1: outwards
// direction = -1: inwards
//
// ***************************************************************************

import { useContext, useEffect } from 'react';

export const VelocitySetShape = function ({ direction = 1, speed = 1 }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocitySetShape',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uVelocitySetShape_Direction;
        uniform float uVelocitySetShape_Speed;
      `,
      reset: /*glsl*/ `
        vec4 fromNormal = texture2D(tShapeNormal, st);
        vec3 dir = normalize(fromNormal.xyz);
        nextVelocity.xyz = dir * uVelocitySetShape_Direction * uVelocitySetShape_Speed;
      `,
    },
    uniforms: {
      uVelocitySetShape_Direction: { value: direction },
      uVelocitySetShape_Speed: { value: speed },
    },
  });

  useEffect(() => {
    if (!variable?.instance?.material?.uniforms?.uVelocitySetShape_Direction)
      return;
    variable.instance.material.uniforms.uVelocitySetShape_Direction.value =
      direction;
  }, [variable, direction]);

  useEffect(() => {
    if (!variable?.instance?.material?.uniforms?.uVelocitySetShape_Speed)
      return;
    variable.instance.material.uniforms.uVelocitySetShape_Speed.value = speed;
  }, [variable, speed]);

  return <></>;
};
