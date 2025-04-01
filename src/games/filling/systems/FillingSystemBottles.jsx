import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { useFillingStore } from '@/stores/filling';
import { addBottle } from '../entities/FillingBottles';
import { FillingECS } from '../state';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');

export const FillingSystemBottles = () => {
  useFrame((state, delta) => {
    let belt = beltEntities.entities[0].belt;

    let numBottles = bottleEntities.entities.length;
    if (belt + 5 > numBottles) {
      addBottle();
    }
  });

  return null;
};
