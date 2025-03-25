import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { usefillingStore } from '@/stores/filling';
import { addBottle } from '../entities/fillingBottles';
import { FillingECS } from '../state';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');

export const FillingSystemBottles = ({
  multiplier = 0.01,
  oneDirection = false,
}) => {
  const bottleBottle = async (entity) => {
    if (entity.filling || entity.bottled) return;

    beltEntities.entities[0].locked = true;

    entity.filling = true;
    let tl = gsap.timeline();

    tl.to(entity.position, { y: -0.1, duration: 0.1 });
    tl.to(entity, {
      progress: 1,
      y: 0.5,
      duration: 2,
      ease: 'none',
    });
    tl.to(entity.position, { y: 0, duration: 0.1 });

    await tl.then();
    entity.filling = false;
    entity.bottled = true;

    beltEntities.entities[0].locked = false;
  };

  useFrame((state, delta) => {
    let belt = beltEntities.entities[0].belt;

    let numBottles = bottleEntities.entities.length;
    if (belt + 5 > numBottles) {
      addBottle();
    }

    // TODO: Delete bottles that are off screen

    for (const entity of bottleEntities) {
      if (belt == entity.idx) {
        bottleBottle(entity);
      }
    }
  });

  return null;
};
