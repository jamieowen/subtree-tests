import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';

const beltEntities = FillingECS.world.with('belt', 'three');
const bottleEntities = FillingECS.world.with('isBottle', 'three');
const spriteEntities = FillingECS.world.with('frame', 'sprite');

export const FillingSystemGraphics = () => {
  const gl = useThree((state) => state.gl);
  const domElement = gl.domElement;

  useFrame((state, delta) => {
    const belt = beltEntities.entities[0].belt;

    const numBottles = bottleEntities.entities.length;

    for (const entity of bottleEntities) {
      // POSITION
      entity.three.position.x = belt - entity.idx * 1;
      entity.three.position.y = entity.position.y;
    }

    // for (const entity of spriteEntities) {
    //   entity.sprite.current.frame = Math.floor(entity.frame);
    // }
  });

  return null;
};
