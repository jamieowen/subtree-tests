// ***************************************************************************
//
// Position Add Mouse
// ADDS to the position of a particle based on the mouse position
//
// REQUIRES: PositionUtilCamera
//
// ***************************************************************************

import { useContext } from 'react';

import worldToNdc from '@/webgl/glsl/utils/worldToNdc.glsl';

export const PositionAddMouse = function ({ distance = 0.5, strength = 1 }) {
  const { simulator, dataSize, refMesh } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'PositionAddMouse',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uPositionMouse;
        uniform float uPositionMouse_Distance;
        uniform float uPositionMouse_Strength;

        ${worldToNdc}
      `,
      execute: /*glsl*/ `
        
        vec3 worldPos = currPosition.xyz + uWorldPos.xyz;
        // vec4 clipSpacePos = uCameraProjectionMatrix * (uCameraMatrixWorldInverse * vec4(worldPos, 1.0));
        // vec3 ndcSpacePos = clipSpacePos.xyz / clipSpacePos.w;
        // ndcSpacePos.z /= uCameraFar - uCameraNear;

        vec3 ndcSpacePos = worldToNdc(worldPos, uCameraProjectionMatrix, uCameraMatrixWorldInverse, uCameraNear, uCameraFar);

        // Without Z
        float len = length(ndcSpacePos.xy - uPositionMouse.xy);
        vec2 dir = normalize(ndcSpacePos.xy - uPositionMouse.xy);
        float force = (1. - smoothstep(0., uPositionMouse_Distance, len)) * uPositionMouse_Strength;
        nextPosition.xy += dir * force;

        // With Z?
        // float len = length(ndcSpacePos.xyz - uPositionMouse.xyz);
        // vec3 dir = normalize(ndcSpacePos.xyz - uPositionMouse.xyz);
        // float force = (1. - smoothstep(0., uPositionMouse_Distance, len)) * uPositionMouse_Strength;
        // nextPosition.xyz += dir * force;

      `,
    },
    uniforms: {
      uPositionMouse: {
        value: new Vector3(),
      },
      uPositionMouse_Distance: { value: distance },
      uPositionMouse_Strength: { value: strength },
    },
  });

  const getMouse = useMouse2();
  useFrame(({ raycaster, camera }, delta) => {
    let { x, y } = getMouse();
    y = 1 - y;

    x = x * 2 - 1;
    y = y * 2 - 1;

    variable.instance.material.uniforms.uPositionMouse.value.x = x;
    variable.instance.material.uniforms.uPositionMouse.value.y = y;
  });

  return <></>;
};
