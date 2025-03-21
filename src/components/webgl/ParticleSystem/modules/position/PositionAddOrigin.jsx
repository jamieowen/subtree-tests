// ***************************************************************************
//
// Position Add Origin
// ADDS to the position of a particle towards where it came from
//
// ***************************************************************************

import { useContext } from 'react';

export const PositionAddOrigin = function ({ strength = 1 }) {
  const { simulator } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'PositionAddOrigin',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uPositionAddOrigin_Strength;
      `,
      execute: /*glsl*/ `

        vec4 iterationRandom = random4(vec2(index, currPosition.w));
        vec2 st = iterationRandom.xy;
        vec4 fromPosition = texture2D(tShapeFrom, st);

        vec3 dir = normalize(currPosition.xyz - fromPosition.xyz);

        nextPosition.xyz += dir * uPositionAddOrigin_Strength * uDelta;
      `,
    },
    uniforms: {
      uPositionAddOrigin_Strength: {
        value: strength,
      },
    },
  });

  useEffect(() => {
    variable.instance.material.uniforms.uPositionAddOrigin_Strength.value =
      strength;
  }, [strength]);

  return <></>;
};
