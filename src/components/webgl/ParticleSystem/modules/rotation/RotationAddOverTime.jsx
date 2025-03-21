import { useEffect, useMemo } from 'react';
import { DataTexture, FloatType, RGBAFormat, Vector3 } from 'three';
import { randFloat, randFloatSpread } from 'three/src/math/MathUtils.js';
import quaternion from '@/webgl/glsl/utils/quaternion.glsl';

const getRandomAxis = (_v) => {
  const v = _v || new Vector3();

  v.x = randFloatSpread(0.1, 2);
  v.y = randFloatSpread(0.1, 2);
  v.z = randFloatSpread(0.1, 2);
  v.normalize();

  return v;
};

export default function RotationAddOverTime({ axis, speed = 100 }) {
  const { _key, simulator, refMesh, dataSize } = useContext(
    ParticleSystemContext
  );

  const _axis = useMemo(() => {
    if (axis) {
      return new Vector3(...axis);
    } else {
      const rotAxis = new Vector3();
      getRandomAxis(rotAxis);
      return rotAxis;
    }
  }, [axis]);

  const { variable } = useSimulatorModule({
    name: 'RotationAddOverTime',
    simulator,
    variableName: 'Rotation',
    uniforms: {
      uRotationAddOverTime_Axis: { value: _axis },
      uRotationAddOverTime_Speed: { value: speed },
    },
    shaderChunks: {
      setup: /*glsl*/ `
        uniform vec3 uRotationAddOverTime_Axis;
        uniform float uRotationAddOverTime_Speed;

      `,
      execute: /*glsl*/ `
        // nextRotation.xyz *= quatFromAxisAngle(uRotationAddOverTime_Axis, uRotationAddOverTime_Speed * uDelta).xyz;
        nextRotation.xyz *= uDelta;
      `,
    },
  });

  useEffect(() => {
    if (!variable?.instance?.material?.uniforms) return;
    const uniforms = variable.instance.material.uniforms;
    uniforms.uRotationAddOverTime_Axis.value = _axis;
    uniforms.uRotationAddOverTime_Speed.value = speed;
  }, [variable, _axis, speed]);

  return null;
}
