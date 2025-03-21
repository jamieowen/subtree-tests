import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  GLSL3,
  InstancedBufferAttribute,
  PlaneGeometry,
  SphereGeometry,
} from 'three';
import { fragmentShader, vertexShader } from './shaders';
import { urls } from '@/config/assets';

export default function Grass({ geometry }) {
  const total = 8;
  const mesh = useRef();

  const tNoise = useTexture(urls.t_noise);
  tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

  const lightPos = new Vector3(1, 3, 3);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      tNoise: {
        value: tNoise,
      },
      uLightPos: {
        value: lightPos,
      },
    }),
    []
  );

  useLayoutEffect(() => {
    const dummy = new Object3D();
    const _pos = new Vector3();
    const id = new Float32Array(total);

    for (let i = 0; i < total; i++) {
      dummy.position.copy(_pos);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      id[i] = i;
    }

    mesh.current.geometry.setAttribute(
      'shellIndex',
      new InstancedBufferAttribute(id, 1)
    );

    mesh.current.instanceMatrix.needsUpdate = true;
  }, [mesh.current]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    uniforms['uTime'].value = t;
  });

  return (
    <group>
      <instancedMesh
        ref={mesh}
        args={[null, null, total]}
        geometry={
          geometry ??
          // new PlaneGeometry(planeSize, planeSize, planeDetail, planeDetail)
          new SphereGeometry(1, 32, 32)
        }
        //rotation={[Math.PI / -2 - 0.2, 0, 0]}
      >
        {/* <planeGeometry
          args={[planeSize, planeSize, planeDetail, planeDetail]}
        /> */}
        <shaderMaterial
          transparent
          glslVersion={GLSL3}
          side={FrontSide}
          vertexShader={vertexShader(total)}
          fragmentShader={fragmentShader(total)}
          uniforms={uniforms}
        />
      </instancedMesh>
    </group>
  );
}
