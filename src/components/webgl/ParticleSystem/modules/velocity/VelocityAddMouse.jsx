// ***************************************************************************
//
// Velocity Add Mouse
// ADDS to the position of a particle based on the mouse position
//
// REQUIRES: VelocityUtilCamera
//
// ***************************************************************************

import { useContext } from 'react';

import worldToNdc from '@/webgl/glsl/utils/worldToNdc.glsl';

export const VelocityAddMouse = function ({ distance = 1, strength = 1 }) {
  const { simulator, dataSize, refMesh } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'VelocityAddMouse',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uVelocityMouse;
        uniform float uVelocityMouse_Distance;
        uniform float uVelocityMouse_Strength;

        ${worldToNdc}
      `,
      execute: /*glsl*/ `
        
        vec3 worldPos = currPosition.xyz + uWorldPos.xyz;
        vec3 ndcSpacePos = worldToNdc(worldPos, uCameraProjectionMatrix, uCameraMatrixWorldInverse, uCameraNear, uCameraFar);

        float len = length(ndcSpacePos.xy - uVelocityMouse.xy);
        vec2 dir = normalize(ndcSpacePos.xy - uVelocityMouse.xy);

        float force = (1. - smoothstep(0., uVelocityMouse_Distance, len)) * uVelocityMouse_Strength;

        nextVelocity.xy += dir * force;

      `,
    },
    uniforms: {
      uVelocityMouse: {
        value: new Vector3(),
      },
      uVelocityMouse_Distance: { value: distance },
      uVelocityMouse_Strength: { value: strength },
    },
  });

  const getMouse = useMouse2();
  useFrame(({ raycaster, camera }, delta) => {
    let { x, y } = getMouse();
    y = 1 - y;

    x = x * 2 - 1;
    y = y * 2 - 1;

    variable.instance.material.uniforms.uVelocityMouse.value.x = x;
    variable.instance.material.uniforms.uVelocityMouse.value.y = y;
  });

  return <></>;
};
