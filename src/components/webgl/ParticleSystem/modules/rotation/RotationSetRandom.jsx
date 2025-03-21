import { useEffect, useMemo } from 'react';
import { DataTexture, FloatType, RGBAFormat, Vector3 } from 'three';
import { randFloat, randFloatSpread } from 'three/src/math/MathUtils.js';
import quaternion from '@/webgl/glsl/utils/quaternion.glsl';
import range from '@/webgl/glsl/utils/range.glsl';

const getRandomAxis = (_v) => {
  const v = _v || new Vector3();

  v.x = randFloatSpread(0.1, 2);
  v.y = randFloatSpread(0.1, 2);
  v.z = randFloatSpread(0.1, 2);
  v.normalize();

  return v;
};

export default function RotationSetRandom({ axis, speed: _speed = 0 }) {
  const { _key, simulator, refMesh, dataSize } = useContext(
    ParticleSystemContext
  );

  const speed = useMemo(() => {
    if (Array.isArray(_speed)) {
      return _speed;
    } else {
      return [_speed, _speed];
    }
  }, []);

  const dataTexture = suspend(async () => {
    const data = new Float32Array(dataSize * dataSize * 4);
    const dt = new DataTexture(data, dataSize, dataSize, RGBAFormat, FloatType);
    dt.needsUpdate = true;
    return dt;
  }, [`${_key}-RotationSetRandom-${dataSize}`]);

  // useEffect(() => {
  //   return () => {
  //     dataTexture.dispose();
  //     clear([`${_key}-RotationSetRandom-${dataSize}`]);
  //   };
  // }, []);

  const _axis = useMemo(() => {
    if (axis) {
      return new Vector3(...axis);
    } else {
      const rotAxis = new Vector3();
      getRandomAxis(rotAxis);
      return rotAxis;
    }
  }, [axis]);

  useEffect(() => {
    // if (!refMesh.current) return;
    const dt = dataTexture;
    const data = dt.image.data;

    for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
      const angle = randFloat(0, Math.PI * 2);
      // const angle = degToRad(45);

      data[i] = _axis.x;
      data[i + 1] = _axis.y;
      data[i + 2] = _axis.z;
      data[i + 3] = angle;
    }

    dt.needsUpdate = true;
  }, [refMesh, dataSize, _axis]);

  const { variable } = useSimulatorModule({
    name: 'RotationSetRandom',
    simulator,
    variableName: 'Rotation',
    uniforms: {
      uRotationSetRandom_tRandom: { value: dataTexture },
      uRotationSetRandom_Speed: { value: speed },
    },
    shaderChunks: {
      setup: /*glsl*/ `
        uniform sampler2D uRotationSetRandom_tRandom;
        uniform vec2 uRotationSetRandom_Speed;
        ${quaternion}
        ${range}
      `,
      // reset: /*glsl*/ `
      //   vec4 randomRotation = texture2D(uRotationSetRandom_tRandom, uv);
      //   vec3 axis = randomRotation.xyz;
      //   float angle = randomRotation.w;
      //   nextRotation = quatFromAxisAngle(axis, angle);
      // `,
      execute: /*glsl*/ `
        vec4 randomRotation = texture2D(uRotationSetRandom_tRandom, uv);
        vec3 axis = randomRotation.xyz;
        float angle = randomRotation.w;
        angle += uTime * crange(rand.z, 0., 1., uRotationSetRandom_Speed.x, uRotationSetRandom_Speed.y);
        nextRotation = quatFromAxisAngle(axis, angle);
      `,
    },
  });

  useEffect(() => {
    if (!variable?.instance?.material?.uniforms) return;
    const uniforms = variable.instance.material.uniforms;
    uniforms.uRotationSetRandom_Speed.value = speed;
  }, [variable, speed]);

  return null;
}
