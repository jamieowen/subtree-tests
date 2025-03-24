import { ECS } from '../state';
import { three } from '@/tunnels';
import { useCleaningStore } from '@/stores/cleaning';

const bottles = ECS.world.with('isBottle');

export const CleaningBottles = () => {
  return (
    <>
      <ECS.Entities
        in={bottles}
        children={CleaningBottle}
      />
    </>
  );
};

let idx = 0;
export const addBottle = () => {
  ECS.world.add({
    isBottle: true,
    idx,
    position: { x: 0, y: 0 },
    progress: 0,
    cleaning: false,
    cleaned: false,
  });
  idx = idx + 1;
};
