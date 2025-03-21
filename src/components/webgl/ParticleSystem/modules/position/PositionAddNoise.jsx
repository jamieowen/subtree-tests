// ***************************************************************************
//
// Position Noise
// ADDS noise to the position of a particle
//
// ***************************************************************************

import { useContext, useRef } from 'react';

import curl from '@/webgl/glsl/utils/curl.glsl';

export const PositionAddNoise = function ({
  frequency = 0.201,
  amplitude = 0.3,
  timeScale = 0.05,
  temporalOffset = 0.1,
  spatialOffset = 0.1,
}) {
  const { simulator, dataSize } = useContext(ParticleSystemContext);

  const { variable } = useSimulatorModule({
    name: 'PositionAddNoise',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `
          ${curl}

          uniform float uCurlAmplitude;
          uniform float uCurlFrequency;
          uniform float uCurlTimeScale;
          uniform float uCurlTemporalOffset;
          uniform float uCurlSpatialOffset;
      `,
      execute: /*glsl*/ `
        // TODO: temporal + spatial

        vec3 pos = nextPosition.xyz;
        nextPosition.xyz += fastCurl(
          pos * uCurlFrequency + 
          (uTime * uCurlTimeScale)
        ) * uCurlAmplitude;
      `,
    },
    uniforms: {
      uCurlAmplitude: { value: amplitude },
      uCurlFrequency: { value: frequency },
      uCurlTimeScale: { value: timeScale },
      uCurlTemporalOffset: { value: temporalOffset },
      uCurlSpatialOffset: { value: spatialOffset },
    },
  });

  return null;
};
