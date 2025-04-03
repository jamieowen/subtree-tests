import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { useGroupingStore } from '@/stores/grouping';
import { addBottle } from '../entities/GroupingBottles';
import { GroupingECS } from '../state';
import { forwardRef } from 'react';

const boxEntities = GroupingECS.world.with('isBox');
const bottleEntities = GroupingECS.world.with('isBottle');
const notHitEntities = GroupingECS.world.with('isBottle', 'notHit');
const hitEntities = GroupingECS.world.with('isBottle', 'hit');

export const GroupingSystemBottles = forwardRef(
  ({ playing = false, multiplier = 0.01, oneDirection = false }, ref) => {
    const count = useGroupingStore((state) => state.count);
    const setCount = useGroupingStore((state) => state.setCount);

    const speed = useRef(0);
    const gravity = useRef(1);

    const reset = () => {
      speed.current = 0;
      gravity.current = 1;

      for (const entity of bottleEntities) {
        GroupingECS.world.addComponent(entity, 'notHit', true);
        GroupingECS.world.removeComponent(entity, 'hit', true);
      }
    };

    useImperativeHandle(ref, () => ({
      reset,
    }));

    const add = () => {
      // console.log('add', playing);
      addBottle();
      let startTime = 1000;
      addTimeout.current = setTimeout(add, startTime - speed.current);
      speed.current += 12;
      speed.current = Math.min(speed.current, startTime - 150);

      return addTimeout.current;
    };

    let addTimeout = useRef(null);
    useEffect(() => {
      if (playing) {
        add();
      }

      return () => {
        clearTimeout(addTimeout.current);
      };
    }, [playing]);

    useFrame((state, delta) => {
      gravity.current += 0.5 * delta;
      gravity.current = Math.min(gravity.current, 10);

      const box = boxEntities.entities[0];
      const width = 2;

      for (const entity of bottleEntities) {
        entity.progress += delta * entity.rotationSpeed;

        if (entity.hit) continue;
        // Gravity
        entity.position[1] -= delta * gravity.current;

        // Progress
        // console.log(entity.progress, delta, entity.rotationSpeed);

        // Remove bottles off screen
        // if (entity.position[1] < -5) {
        //   entity.remove();
        // }
      }

      // Hit fade out
      for (const entity of hitEntities) {
        // entity.opacity -= 0.5 * delta;
        entity.opacity = 0;
      }

      // Check Hit
      if (!playing) return;
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
    });

    useFrame(() => {
      let num = hitEntities.entities.length;
      if (count != num) {
        setCount(num);
      }
    });

    return null;
  }
);
