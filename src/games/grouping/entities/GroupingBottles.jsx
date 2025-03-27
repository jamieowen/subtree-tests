import { GroupingECS } from '../state';
import { three } from '@/tunnels';
import { useGroupingStore } from '@/stores/grouping';
import { randomInRange } from '@/helpers/MathUtils';

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
    position: [randomInRange(-2, 2), 8, 0],
  });
};
