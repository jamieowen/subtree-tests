// ***************************************************************************
//
// Velocity Noise
// ADDS to the velocity of the particle based on a noise texture
//
// ***************************************************************************

import { useContext, useRef } from 'react';

// import setup from '@/webgl/glsl/particles/velocity-noise/setup.glsl';
// import execute from '@/webgl/glsl/particles/velocity-noise/execute.glsl';

import curl from '@/webgl/glsl/lygia/generative/curl.glsl';

export const VelocityAddNoise = function ({ children, ...props }) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const refTexture = useRef(null);

  const { variable } = useSimulatorModule({
    name: 'VelocityAddNoise',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        ${curl}

        uniform sampler2D uVelocityNoise;
      `,
      execute: /*glsl*/ `
        vec4 n = texture2D(uVelocityNoise, uv);
        nextVelocity.xyz += n.xyz;
      `,
    },
    uniforms: {
      uVelocityNoise: { value: refTexture.current },
    },
  });

  useEffect(() => {
    variable.instance.material.uniforms.uVelocityNoise.value =
      refTexture.current;
  }, [variable]);

  return (
    <>
      <NoiseTexture
        ref={refTexture}
        size={dataSize}
        {...props}
      />
    </>
  );
};
