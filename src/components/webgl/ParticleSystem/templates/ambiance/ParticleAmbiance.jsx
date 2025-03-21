import { Color } from 'three';
import { urls } from '@/config/assets';

import range from '@/webgl/glsl/utils/range.glsl';

export default function ParticleAmbiance({
  _key,
  amount = 32 * 32,
  color = '#ffffff',
  range = {
    min: [-70, -70, -70],
    max: [70, 70, 70],
  },
  size = 1,
  alpha = 1,
  speed = 5,
  acceleration = 0.5,
  debug = false,
  ...props
}) {
  return (
    <ParticleSystem
      _key={_key}
      enabled={true}
      maxParticles={amount}
      looping={true}
      // prewarm={true}
      lifeTime={[10, 20]}
      rate={amount / 20}
      {...props}
    >
      <EmissionRandomVolume
        range={range}
        speed={speed}
        acceleration={acceleration}
        debug={debug}
      />
      <VelocitySetRandom />
      <VelocityAddDirection direction={[-0.01, 0, 0]} />

      <ParticleAmbianceMaterial
        color={color}
        size={size}
        alpha={alpha}
      />
    </ParticleSystem>
  );
}
