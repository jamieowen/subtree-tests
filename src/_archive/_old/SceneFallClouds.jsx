import { useMemo } from 'react';
import { urls } from '@/config/assets';
import { PlaneGeometry, RingGeometry, SphereGeometry } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import { damp, exp } from 'maath/easing';
import { map } from '@/helpers/MathUtils';

export const SceneFallClouds = memo(
  forwardRef(({ maxParticles = 2048 * 2, enabled, ...props }, ref) => {
    const cloudGeometry = suspend(async () => {
      const s = 0.2;
      return new PlaneGeometry(1 * s, 0.5 * s);
    }, ['plane-0.2-0.1']);
    // useEffect(() => {
    //   return () => {
    //     cloudGeometry.dispose();
    //   };
    // }, [cloudGeometry]);

    const shapeGeometry = suspend(async () => {
      return new RingGeometry(0.15, 0.4);
    }, ['ring-0.15-0.4']);
    // useEffect(() => {
    //   return () => {
    //     shapeGeometry.dispose();
    //   };
    // }, [shapeGeometry]);

    // *****************************************************************
    //
    // CLOUD SPEED
    //
    // *****************************************************************
    const refParticleSystem = useRef(null);
    const speedMin = 0.5;
    const speedMax = speedMin * 2.5;
    const onUpdate = (v) => {
      if (!refParticleSystem.current) return;
      refParticleSystem.current.speed = map(v, 0, 1, speedMin, speedMax);
    };

    useToggleEventAnimation({
      inParams: {
        event: ON_FALL_SCENE_PRESS_DOWN,
        ease: 'power2.out',
        duration: 2,
        onComplete: () => {
          // refParticleSystem.current.off();
        },
        onUpdate,
      },
      outParams: {
        event: ON_FALL_SCENE_PRESS_UP,
        ease: 'power2.inOut',
        duration: 2,
        onStart: () => {
          // refParticleSystem.current.on();
        },
        onUpdate,
      },
    });

    return (
      <group
        position={[0, 0, 0]}
        {...props}
      >
        <ParticleSystem
          _key="SceneFallClouds"
          ref={refParticleSystem}
          enabled={enabled}
          geometry={cloudGeometry}
          maxParticles={maxParticles}
          speed={speedMin}
          lifeTime={3}
          rate={300}
          // prewarm={10}
          rotation={[0, degToRad(0), 0]}
          // debug={'Life'}
        >
          <EmissionShape
            ordered={true}
            visible={false}
          >
            <primitive
              object={shapeGeometry}
              attach="geometry"
            />
            <meshBasicMaterial wireframe={true} />
          </EmissionShape>

          <VelocitySetDirection direction={[0, 0, 1]} />

          <CloudMaterial />
        </ParticleSystem>
      </group>
    );
  })
);
