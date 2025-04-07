import { CleaningECS } from '../state';
import { three } from '@/tunnels';
import { useCleaningStore } from '@/stores/cleaning';

const bottles = CleaningECS.world.with('isBottle');

export const CleaningBottles = () => {
  return (
    <>
      <CleaningECS.Entities
        in={bottles}
        children={CleaningBottle}
      />
    </>
  );
};

let idx = 0;
export const addBottle = () => {
  // console.log('CleaningBottles.addBottle');
  CleaningECS.world.add({
    isBottle: true,
    idx,
    position: { x: 0, y: 0 },
    progress: 0,
    unclean: true,
  });
  idx = idx + 1;
};
