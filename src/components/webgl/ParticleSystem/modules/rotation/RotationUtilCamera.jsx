// ***************************************************************************
//
// RotationUtilCamera
// Adds Camera uniforms
//
// ***************************************************************************

import { useContext, useRef } from 'react';

import curl from '@/webgl/glsl/utils/curl.glsl';

export const RotationUtilCamera = function () {
  const { simulator } = useContext(ParticleSystemContext);

  const uniforms = useMemo(() => {
    return {
      uCameraPosition: { value: new Vector3() },
      uCameraRotation: { value: new Quaternion() },
      uCameraNear: { value: 0 },
      uCameraFar: { value: 0 },
      uCameraProjectionMatrix: { value: new Matrix4() },
      // uCameraProjectionMatrixInverse: { value: new Matrix4() },
      // uCameraMatrixWorld: { value: new Matrix4() },
      uCameraMatrixWorldInverse: { value: new Matrix4() },
    };
  }, []);

  const { variable } = useSimulatorModule({
    name: 'RotationUtilCamera',
    simulator,
    variableName: 'Rotation',
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uCameraPosition;
        uniform vec4 uCameraRotation;
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

    camera.getWorldPosition(u.uCameraPosition.value);
    camera.getWorldQuaternion(u.uCameraRotation.value);
    u.uCameraNear.value = camera.near;
    u.uCameraFar.value = camera.far;
    u.uCameraProjectionMatrix.value.copy(camera.projectionMatrix);
    // u.uCameraProjectionMatrixInverse.value.copy(camera.projectionMatrixInverse);
    // u.uCameraMatrixWorld.value.copy(camera.matrixWorld);
    u.uCameraMatrixWorldInverse.value.copy(camera.matrixWorldInverse);
  });

  return null;
};
