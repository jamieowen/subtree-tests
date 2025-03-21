import swirl from '@/webgl/glsl/utils/swirl.glsl';
import range from '@/webgl/glsl/utils/range.glsl';
import quaternionToMatrix4 from '@/webgl/glsl/utils/quaternionToMatrix4.glsl';

import { urls } from '@/config/assets';
import { DoubleSide, PlaneGeometry, SphereGeometry } from 'three';
import { ParticleSystemMaterial } from '../../components/webgl/ParticleSystem/ParticleSystemMaterial';
import { useEffect, useRef } from 'react';

export const MonolithParticles = ({ name, geometry, ...props }) => {
  const shader = useMemo(
    () => ({
      vertexShader: /*glsl*/ `
        precision mediump float;

        attribute vec2 reference;
        attribute float index;

        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vWorldPos;
        flat varying vec2 vReference;
        varying float vProgress;

        uniform float uTime;

        uniform sampler2D uLifeTexture;
        uniform sampler2D uVelocityTexture;
        uniform sampler2D uPositionTexture;
        uniform sampler2D uRotationTexture;
        
        ${quaternionToMatrix4}        

        void main() {
          vec4 life = texture2D(uLifeTexture, reference);
          vec3 transformed = position;
          
          // Rotate
          vec4 rot = texture2D(uRotationTexture, reference);
          //modelPosition *= quaternionToMatrix4(rot);

          // Translate
          vec4 pos = texture2D(uPositionTexture, reference);
          transformed += pos.xyz;

          gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);

          vUv = uv;
          vWorldPos = (modelMatrix * vec4(transformed, 1.0)).xyz;
          vReference = reference;
        
          vProgress = life.y;
          vNormal = normal;
        }
      `,
      fragmentShader: /*glsl*/ `
        varying vec2 vUv;

        layout(location=1) out vec4 gNormal;
        layout(location=2) out vec4 gOutline;
        
        void main() {
          pc_fragColor = vec4(vUv, 1., 1.);

          gNormal = vec4(1.);
          gOutline = vec4(1.);
        }
    `,
      uniforms: {
        // tNoise: {
        //   // value: noise,
        // },
        uTime: {
          value: 0,
        },
      },
      side: DoubleSide,
    }),
    []
  );

  const total = 16 * 16;

  const system = useRef();

  return (
    <ParticleSystem
      _key={name}
      enabled={true}
      maxParticles={total}
      geometry={new PlaneGeometry(50, 100)}
      looping={true}
      prewarm={true}
      ref={system}
      // debug={'Position'}
      lifeTime={3}
      rate={total / 3}
      {...props}
    >
      <EmissionShape
        // scale={[1, 1, 1]}
        visible={false}
        geometry={geometry}
      >
        <GBufferMaterial wireframe>
          <MaterialModuleNormal />
          <MaterialModuleColor color="white" />
        </GBufferMaterial>
      </EmissionShape>

      {/* <RotationSetBillboard /> */}

      <VelocitySetShape
        direction={1}
        speed={100}
      />

      {/* <ParticleSystemMaterial
        color={0xffffff}
        side={DoubleSide}
        // fallOff={[6, 4, 0.5]}
        transparent={true}
      /> */}
      {/* <ParticleAmbianceMaterial
        color={0xed6975}
        size={0.4}
        alpha={2}
      /> */}

      <shaderMaterial args={[shader]} />
    </ParticleSystem>
  );
};
