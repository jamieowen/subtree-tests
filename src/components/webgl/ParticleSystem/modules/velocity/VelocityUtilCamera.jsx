// ***************************************************************************
//
// VelocityUtilCamera
// Adds Camera uniforms
//
// ***************************************************************************

import { useContext, useRef } from 'react';

import curl from '@/webgl/glsl/utils/curl.glsl';

export const VelocityUtilCamera = function () {
  const { simulator } = useContext(ParticleSystemContext);

  const uniforms = useMemo(() => {
    return {
      // uCameraVelocity: { value: new Vector3() },
      uCameraNear: { value: 0 },
      uCameraFar: { value: 0 },
      uCameraProjectionMatrix: { value: new Matrix4() },
      // uCameraProjectionMatrixInverse: { value: new Matrix4() },
      // uCameraMatrixWorld: { value: new Matrix4() },
      uCameraMatrixWorldInverse: { value: new Matrix4() },
    };
  }, []);

  const { variable } = useSimulatorModule({
    name: 'VelocityUtilCamera',
    simulator,
    variableName: 'Velocity',
    shaderChunks: {
      setup: /*glsl*/ `
        // uniform vec3 uCameraVelocity;
        uniform float uCameraNear;
        uniform float uCameraFar;
        uniform mat4 uCameraProjectionMatrix;
        // uniform mat4 uCameraProjectionMatrixInverse;
        // uniform mat4 uCameraMatrixWorld;
        uniform mat4 uCameraMatrixWorldInverse;
      `,
    },
    uniforms,
  });

  useFrame(({ camera }) => {
    const u = uniforms;

    // camera.getWorldVelocity(u.uCameraVelocity.value);
    u.uCameraNear.value = camera.near;
    u.uCameraFar.value = camera.far;
    u.uCameraProjectionMatrix.value.copy(camera.projectionMatrix);
    // u.uCameraProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
    // u.uCameraMatrixWorld.value.copy(camera.matrixWorld);
    u.uCameraMatrixWorldInverse.value.copy(camera.matrixWorldInverse);
  });

  return null;
};
