import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { GroupingECS } from '../state';

const positionEntities = GroupingECS.world.with('position', 'three');
const spriteEntities = GroupingECS.world.with('progress', 'sprite');
const opacityEntities = GroupingECS.world.with('opacity', 'three');

export const GroupingSystemGraphics = ({}) => {
  // const gl = useThree((state) => state.gl);
  // const domElement = gl.domElement;

  useFrame((state, delta) => {
    // POSITION
    for (const entity of positionEntities) {
      entity.three.position.x = entity.position[0];
      entity.three.position.y = entity.position[1];
      entity.three.position.z = entity.position[2];
    }

    // SPRITE
    for (const entity of spriteEntities) {
      entity.sprite.current.progress = entity.progress % 1;
    }
    // OPACITY
    for (const entity of opacityEntities) {
      // entity.three. = entity.progress % 1;
      entity.three.traverse((child) => {
        if (!child.material) return;
        child.material.opacity = entity.opacity;
      });
    }
  });

  return null;
};
