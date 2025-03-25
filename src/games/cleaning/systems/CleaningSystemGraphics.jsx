import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';

const beltEntities = CleaningECS.world.with('belt');
const bottleEntities = CleaningECS.world.with('isBottle', 'three');
const cleaningEntities = CleaningECS.world.with('cleaning', 'sprite', 'three');

export const CleaningSystemGraphics = ({}) => {
  const gl = useThree((state) => state.gl);
  const domElement = gl.domElement;

  useFrame((state, delta) => {
    const belt = beltEntities.entities?.[0]?.belt;
    // if (!belt) return;

    const numBottles = bottleEntities.entities.length;

    for (const entity of bottleEntities) {
      // POSITION
      entity.three.position.x = belt - entity.idx * 1;
      entity.three.position.y = entity.position.y;
      // ((belt + entity.idx) % numBottles) - numBottles / 2 + 0.5;
    }

    for (const entity of cleaningEntities) {
      if (!entity.cleaning) continue;
      entity.sprite.current.progress = entity.progress;
    }
  });

  return null;
};
