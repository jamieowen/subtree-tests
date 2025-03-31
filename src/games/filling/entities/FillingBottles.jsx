import { FillingECS } from '../state';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';

const bottles = FillingECS.world.with('isBottle');

export const FillingBottles = ({}) => {
  return (
    <>
      <FillingECS.Entities
        in={bottles}
        children={FillingBottle}
      />
    </>
  );
};

let idx = 0;
export const addBottle = () => {
  FillingECS.world.add({
    isBottle: true,
    idx,
    position: { x: 0, y: 0 },
    frame: 0,
  });
  idx = idx + 1;
};
