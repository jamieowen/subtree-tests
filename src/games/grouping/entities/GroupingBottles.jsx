import { GroupingECS } from '../state';
import { three } from '@/tunnels';
import { useGroupingStore } from '@/stores/grouping';
import { randomInRange, randomSign } from '@/helpers/MathUtils';
import sample from 'lodash/sample';

const bottles = GroupingECS.world.with('isBottle');

export const GroupingBottles = () => {
  return (
    <>
      <GroupingECS.Entities
        in={bottles}
        children={GroupingBottle}
      />
    </>
  );
};

export const addBottle = () => {
  GroupingECS.world.add({
    isBottle: true,
    notHit: true,
    opacity: 1,
    position: [
      //
      randomInRange(-2, 2),
      8,
      randomInRange(-1, 0),
    ],
    rotationSpeed: randomInRange(0.2, 0.5),
    rotationDirection: sample(['clockwise', 'counterclockwise']),
    progress: 0,
  });
};
