// ***************************************************************************
//
// Rotation Billboard
// SETS the rotation of a particle to face the camera
//
// ***************************************************************************

import { useContext } from 'react';
import { Vector3 } from 'three';

// import setup from '@/webgl/glsl/particles/rotation-billboard/setup.glsl';
// import execute from '@/webgl/glsl/particles/rotation-billboard/execute.glsl';
// import directionToQuaternion from '@/webgl/glsl/utils/directionToQuaternion.glsl';
// import quaternion from '@/webgl/glsl/utils/quaternion.glsl';

export const RotationSetBillboard = function ({}) {
  const { simulator, refMesh } = useContext(ParticleSystemContext);
  const camera = useThree((state) => state.camera);

  const { variable } = useSimulatorModule({
    name: 'RotationSetBillboard',
    simulator,
    variableName: 'Rotation',
    shaderChunks: {
      setup: /*glsl*/ `

          // vec4 rotateToFaceCamera(vec3 objectPosition, vec3 cameraPosition) {
          //   // Calculate direction from the object to the camera
          //   vec3 direction = normalize(cameraPosition - objectPosition);
            
          //   // Calculate the rotation quaternion
          //   vec3 upAxis = vec3(0.0, 0.0, 1.0); // Define up axis (you may need to adjust this based on your coordinate system)
          //   vec3 rotationAxis = cross(upAxis, direction);
          //   float dotProduct = dot(upAxis, direction);
          //   float angle = acos(dotProduct);
            
          //   float halfAngle = angle * 0.5;
          //   float sinHalfAngle = sin(halfAngle);
          //   vec4 quaternion = vec4(rotationAxis * sinHalfAngle, cos(halfAngle));
            
          //   return quaternion;
          // }

      `,
      execute: /*glsl*/ `
        // vec3 worldPos = currPosition.xyz + uWorldPos.xyz;
        // vec4 worldRot = qmul(currRotation, uWorldQuat);

        // nextRotation = worldRot / uCameraRotation / uWorldQuat;
        // nextRotation = rotateToFaceCamera(worldPos, uCameraPosition);
        nextRotation = uCameraRotation;
        // nextRotation = 
      `,
    },
  });

  return null;
};
