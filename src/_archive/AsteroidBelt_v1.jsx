import { Sphere } from '@react-three/drei';

export const AsteroidBelt_v1 = ({
  amount = 16 * 16,
  distance = 5,
  debug = false,
  ...props
}) => {
  return (
    <group {...props}>
      <group rotation={[0, degToRad(-53), 0]}>
        {debug && (
          <Sphere args={[1.5, 32, 32]}>
            <meshBasicMaterial wireframe={true} />
          </Sphere>
        )}
        <ParticleSystem
          _key="asteroid-belt-v1"
          enabled={true}
          maxParticles={amount}
          lifeTime={100}
          rate={amount * 0.1}
          position={[distance * -1, 0, 0]}
          rotation={[degToRad(90), 0, 0]}
        >
          <EmissionShape visible={debug}>
            <sphereGeometry args={[1.5]} />
            {debug && <meshBasicMaterial wireframe={true} />}
          </EmissionShape>

          <PositionSetSpline
            debug={debug}
            spline={[
              new Vector4(0, 0, 0, 0.1),
              new Vector4(distance, -distance, 0, 0.1),
              new Vector4(distance * 2, 0, 0, 0.1),
              new Vector4(distance, distance, 0, 0.1),
            ]}
            closed={true}
          />
          <PositionAddNoise
            size={amount}
            strength={0.2}
            scrollSpeed={[0.02, 0]}
          />

          <ParticleSystemPointsMaterial
            color={0x1405bf}
            size={10}
            rounded={true}
            randomSize={true}
          />
        </ParticleSystem>
      </group>
    </group>
  );
};
