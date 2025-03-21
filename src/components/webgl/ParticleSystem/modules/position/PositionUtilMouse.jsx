// ***************************************************************************
//
// PositionUtilCamera
// Adds Camera uniforms
//
// ***************************************************************************

import { useContext, useRef } from 'react';

export const PositionUtilMouse = function () {
  const { simulator } = useContext(ParticleSystemContext);

  const uniforms = useMemo(() => {
    return {
      uPositionMouse: { value: new Vector2() },
    };
  }, []);

  const { variable } = useSimulatorModule({
    name: 'PositionUtilMouse',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec2 uPositionMouse;
      `,
    },
    uniforms,
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

  return null;
};
