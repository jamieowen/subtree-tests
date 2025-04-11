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

// let idx = 0;
// let negative idx = 0;
export const addBottle = (i) => {
  // const isClean = Math.random() > 0.65;
  const isClean = false;

  const opts = {
    isBottle: true,
    idx: i != undefined ? i : 0,
    position: { x: 0, y: 0 },
    progress: 0,
  };

  if (isClean) {
    // opts.cleaned = true;
    opts.progress = 1;
    opts.precleaned = true;
  } else {
    opts.unclean = true;
  }

  CleaningECS.world.add(opts);
  // idx = idx + 1;
};
