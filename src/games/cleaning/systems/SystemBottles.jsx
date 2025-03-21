import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';

const beltEntities = ECS.world.with('belt');
const bottleEntities = ECS.world.with('isBottle');

export const SystemBottles = ({ multiplier = 0.01, oneDirection = false }) => {
  const idx = useRef(0);

  const addBottle = () => {
    let bottle = {
      idx,
      isBottle: true,
      frame: 0,
      cleaning: false,
      cleaned: false,
    };

    ECS.world.add(bottle);

    idx.current++;
  };

  const cleanBottle = async (entity) => {
    if (entity.cleaning || entity.cleaned) return;

    beltEntities.entities[0].locked = true;

    entity.cleaning = true;
    let tl = gsap.timeline();

    tl.to(entity.position, { y: -0.1, duration: 0.1 });
    tl.to(entity, {
      progress: 1,
      y: 0.5,
      duration: 1.5,
      ease: 'none',
    });
    tl.to(entity.position, { y: 0, duration: 0.1 });

    await tl.then();
    entity.cleaning = false;
    entity.cleaned = true;

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
        cleanBottle(entity);
      }
    }
  });

  return null;
};
