import { ECS } from '../state';
import { three } from '@/tunnels';
import { usefillingStore } from '@/stores/filling';

const bottles = ECS.world.with('isBottle');

export const fillingBottles = () => {
  return (
    <>
      <ECS.Entities
        in={bottles}
        children={fillingBottle}
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
    filling: false,
    bottled: false,
  });
  idx = idx + 1;
};
