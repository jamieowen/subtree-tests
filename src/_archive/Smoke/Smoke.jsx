import { RenderTexture, useFBO } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import { create } from 'zustand';
import { RenderTexturePingpong } from '../../../webgl/utils/RenderTexture/RenderTexturePingpong';
import { useFrame } from '@react-three/fiber';

const scale = 50;

export const smokeRT = create(() => ({
  RTCurr: null,
  RTPrev: null,
}));

export default function Smoke({ maxParticles = 16 * 16, enabled, ...props }) {
  const particlesRT = useRef();

  useEffect(() => {
    smokeRT.setState({
      RTCurr: particlesRT.current.fbo.texture,
      RTPrev: particlesRT.current.fbo2.texture,
    });
  }, []);

  return (
    <RenderTexturePingpong ref={particlesRT}>
      <ParticleSystem
        _key="smoke"
        enabled={enabled}
        maxParticles={maxParticles}
        duration={1}
        lifeTime={2}
        rate={maxParticles / 4}
        rotation={[0, degToRad(0), 0]}
        {...props}
      >
        <EmissionShape>
          <sphereGeometry args={[2, 8, 8, 0]} />
          <meshBasicMaterial wireframe={true} />
        </EmissionShape>
        <VelocitySetShape />
        <ParticleSystemPointsMaterial
          size={100}
          //rounded={true}
          randomSize={true}
        />
      </ParticleSystem>
    </RenderTexturePingpong>
  );
}
