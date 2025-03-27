import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { useGroupingStore } from '@/stores/grouping';
import { addBottle } from '../entities/GroupingBottles';
import { GroupingECS } from '../state';

const boxEntities = GroupingECS.world.with('isBox');
const bottleEntities = GroupingECS.world.with('isBottle');
const notHitEntities = GroupingECS.world.with('isBottle', 'notHit');
const hitEntities = GroupingECS.world.with('isBottle', 'hit');

export const GroupingSystemBottles = ({
  multiplier = 0.01,
  oneDirection = false,
}) => {
  const speed = useRef(0);
  const gravity = useRef(1);

  const add = () => {
    addBottle();
    setTimeout(add, 1500 - speed.current);
    speed.current += 10;
    speed.current = Math.min(speed.current, 1450);
    // console.log('add', speed.current);
  };

  useEffect(() => {
    add();
  }, []);

  useFrame((state, delta) => {
    gravity.current += 0.5 * delta;
    gravity.current = Math.min(gravity.current, 10);

    const box = boxEntities.entities[0];
    const width = 2;

    for (const entity of bottleEntities) {
      if (entity.hit) continue;
      // Gravity
      entity.position[1] -= delta * gravity.current;

      // Remove bottles off screen
      // if (entity.position[1] < -5) {
      //   entity.remove();
      // }
    }

    // Check Hit
    for (const entity of notHitEntities) {
      if (
        entity.position[1] <= 0 &&
        entity.position[1] >= -0.5 &&
        entity.position[0] > box.position[0] - width / 2 &&
        entity.position[0] < box.position[0] + width / 2
      ) {
        // console.log('hit');
        GroupingECS.world.removeComponent(entity, 'notHit');
        GroupingECS.world.addComponent(entity, 'hit', true);
      }
    }

    for (const entity of hitEntities) {
      entity.opacity -= 0.5 * delta;
    }
  });

  return null;
};
