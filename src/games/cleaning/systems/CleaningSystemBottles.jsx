import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { useCleaningStore } from '@/stores/cleaning';
import { addBottle } from '../entities/CleaningBottles';
import { gsap } from 'gsap';
import { randomIntRange } from '@/helpers/MathUtils';
import AssetService from '@/services/AssetService';

const beltEntities = CleaningECS.world.with('belt');
const bottleEntities = CleaningECS.world.with('isBottle');
const uncleanEntities = CleaningECS.world.with('unclean');
const cleanedEntities = CleaningECS.world.with('cleaned');

export const CleaningSystemBottles = ({
  playing = false,
  multiplier = 0.01,
  oneDirection = false,
}) => {
  const count = useCleaningStore((state) => state.count);
  const setCount = useCleaningStore((state) => state.setCount);

  const setBeltLocked = (locked) => {
    for (let entity of beltEntities) {
      if (locked) {
        CleaningECS.world.addComponent(entity, 'locked', true);
      } else {
        CleaningECS.world.removeComponent(entity, 'locked', true);
      }
    }
  };

  const cleanBottle = async (entity) => {
    if (entity.cleaning || entity.cleaned) return;

    AssetService.getAsset(`sfx_washbottle0${randomIntRange(1, 3)}`).play();

    setBeltLocked(true);

    CleaningECS.world.addComponent(entity, 'cleaning', true);
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
    CleaningECS.world.removeComponent(entity, 'cleaning', true);
    // entity.cleaned = true;
    CleaningECS.world.removeComponent(entity, 'unclean', true);
    CleaningECS.world.addComponent(entity, 'cleaned', true);

    setBeltLocked(false);
  };

  useFrame((state, delta) => {
    let belt = beltEntities.entities?.[0]?.belt;

    let numBottles = bottleEntities.entities.length;
    if (belt + 5 > numBottles) {
      addBottle();
    }

    if (!playing) return;

    // UNCLEAN
    for (const entity of uncleanEntities) {
      if (belt == entity.idx) {
        cleanBottle(entity);
      }
    }

    // COUNT CLEANED
    let num = cleanedEntities.entities.length;
    if (count != num) {
      setCount(num);
    }
  });

  return null;
};
