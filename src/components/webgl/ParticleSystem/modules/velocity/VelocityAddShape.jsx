// ***************************************************************************
//
// Velocity Add Shape
// ADDS the velocity of the particle to the direction of the shape
// direction = 1: outwards
// direction = -1: inwards
//
// ***************************************************************************

import { useContext, useEffect } from 'react';

export const VelocityAddShape = forwardRef(
  ({ direction = 1, speed = 1 }, ref) => {
    const { simulator, dataSize } = useContext(ParticleSystemContext);

    const { variable } = useSimulatorModule({
      name: 'VelocityAddShape',
      simulator,
      variableName: 'Velocity',
      shaderChunks: {
        setup: /*glsl*/ `
        uniform float uVelocityAddShape_Direction;
        uniform float uVelocityAddShape_Speed;
      `,
        execute: /*glsl*/ `
        vec4 iterationRandom = random4(vec2(index, nextVelocity.w));
        vec2 st = iterationRandom.xy;

        vec4 fromNormal = texture2D(tShapeNormal, st);
        vec3 dir = normalize(fromNormal.xyz);
        nextVelocity.xyz += dir * uVelocityAddShape_Direction * uVelocityAddShape_Speed * uDelta;
      `,
      },
      uniforms: {
        uVelocityAddShape_Direction: { value: direction },
        uVelocityAddShape_Speed: { value: speed },
      },
    });

    useEffect(() => {
      if (!variable?.instance?.material?.uniforms?.uVelocityAddShape_Direction)
        return;

      variable.instance.material.uniforms.uVelocityAddShape_Direction.value =
        direction;
      variable.instance.material.uniforms.uVelocityAddShape_Speed.value = speed;
    }, [variable, direction, speed]);

    useImperativeHandle(
      ref,
      () => ({
        get direction() {
          return variable.instance.material.uniforms.uVelocityAddShape_Direction
            .value;
        },
        set direction(val) {
          variable.instance.material.uniforms.uVelocityAddShape_Direction.value =
            val;
        },
        get speed() {
          return variable.instance.material.uniforms.uVelocityAddShape_Speed
            .value;
        },
        set speed(val) {
          variable.instance.material.uniforms.uVelocityAddShape_Speed.value =
            val;
        },
      }),
      [variable]
    );

    return <></>;
  }
);
