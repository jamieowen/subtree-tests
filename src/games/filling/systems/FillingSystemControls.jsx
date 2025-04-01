import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';
import { urls } from '@/config/assets';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');
const fillingEntities = FillingECS.world.with('filling');
const filledEntities = FillingECS.world.with('filled');
const nozzleEntities = FillingECS.world.with('isNozzle');
const pouringEntities = FillingECS.world.with('pouring');

export const FillingSystemControls = ({
  within = 0.25,
  multiplier = 0.01,
  oneDirection = false,
  textureConfigs,
}) => {
  const current = useRef(0);
  const speed = useRef(1.5);
  const timeToFill = useRef(4);

  const setBeltLocked = (locked) => {
    for (let entity of beltEntities) {
      entity.locked = locked;
    }
  };

  const setNozzlePouring = (pouring) => {
    for (let entity of nozzleEntities) {
      if (pouring) {
        FillingECS.world.addComponent(entity, 'pouring', true);
      } else {
        FillingECS.world.removeComponent(entity, 'pouring', true);
      }
    }
  };

  const isPouring = () => {
    return pouringEntities.entities.length > 0;
  };

  const onFill = async (pos) => {
    setBeltLocked(true);

    const distance = Math.abs(current.current - pos);
    if (distance > 0) {
      await gsap
        .to(current, {
          current: pos,
          duration: distance,
        })
        .then();
    }

    setNozzlePouring(true);
    let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
    FillingECS.world.addComponent(bottleToFill, 'filling', true);
  };

  const gl = useThree((state) => state.gl);

  const onPointerDown = () => {
    const isLocked = beltEntities.entities[0].locked;
    if (isLocked) return;

    let pos = current.current;
    let remainder = Math.abs(pos) % 1;
    // onFill(0); // TODO
    if (remainder >= 1 - within) {
      onFill(Math.ceil(pos));
    }
  };

  const onPointerUp = async () => {
    let pos = current.current;
    let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
    if (bottleToFill) {
      FillingECS.world.removeComponent(bottleToFill, 'filling', true);
      FillingECS.world.addComponent(bottleToFill, 'ended', true);
    }

    if (isPouring()) {
      setNozzlePouring(false);
      await PromiseTimeout(300);
    }
    setBeltLocked(false);
  };

  useEffect(() => {
    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointerup', onPointerUp);
    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  useFrame((state, delta) => {
    // MOVE BELT
    const count = filledEntities.entities.length;
    const isLocked = beltEntities.entities[0].locked;
    if (!isLocked) {
      speed.current = Math.min(1 + count * 0.15, 2);
      current.current += delta * speed.current; // TODO
    }
    for (const entity of beltEntities) {
      entity.belt = current.current;
    }

    // FILL
    // timeToFill.current = Math.max(1, 3 - count * 0.5);
    timeToFill.current = 3;

    let complete = false;
    for (const entity of fillingEntities) {
      if (entity.filling) {
        entity.progress += delta / timeToFill.current;
      }

      if (entity.progress >= 1) {
        entity.progress = 1;
        FillingECS.world.removeComponent(entity, 'filling', true);
        FillingECS.world.addComponent(entity, 'filled', true);
        complete = true;
      }
    }

    if (complete) {
      for (const entity of pouringEntities) {
        FillingECS.world.removeComponent(entity, 'pouring', true);
      }
    }
  });

  return null;
};
