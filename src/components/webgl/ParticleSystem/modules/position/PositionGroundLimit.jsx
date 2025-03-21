// ***************************************************************************
//
// Position Noise
// ADDS noise to the position of a particle
//
// ***************************************************************************

import { useContext, useRef } from 'react';

import curl from '@/webgl/glsl/utils/curl.glsl';

export const PositionGroundLimit = function ({ y = 0, debug }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'PositionGroundLimit',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform float uPositionGroundLimit;
      `,
      execute: /*glsl*/ `
        vec3 pos = currPosition.xyz + uWorldPos.xyz;
        if (pos.y <= uPositionGroundLimit) {
          nextPosition.xyz = currPosition.xyz;
        }
      `,
    },
    uniforms: {
      uPositionGroundLimit: { value: y },
    },
  });

  useEffect(() => {
    variable.instance.material.uniforms.uPositionGroundLimit.value = y;
  }, [variable, y]);

  return (
    <>
      {debug && (
        <Plane
          args={[debug || 100, debug || 100]}
          position={[0, y, 0]}
          rotation-x={[degToRad(-90)]}
        >
          <GBufferMaterial
            side={DoubleSide}
            wireframe
          >
            <MaterialModuleNormal />
            <MaterialModuleColor />
          </GBufferMaterial>
        </Plane>
      )}
    </>
  );
};
