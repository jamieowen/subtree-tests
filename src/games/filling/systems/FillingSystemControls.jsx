import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');
const fillingEntities = FillingECS.world.with('filling');
const filledEntities = FillingECS.world.with('filled');

export const FillingSystemControls = ({
  within = 0.25,
  multiplier = 0.01,
  oneDirection = false,
}) => {
  const current = useRef(0);
  const speed = useRef(1.5);
  const fillTime = useRef(1);

  const setBeltLocked = (locked) => {
    for (let entity of beltEntities) {
      entity.locked = locked;
    }
  };

  // const fillBottle = async (entity) => {
  //   console.log('fillBottle');
  //   if (entity.filling || entity.filled) return;

  //   FillingECS.world.addComponent(entity, 'filling', true);
  //   entity.filling = true;
  //   let tl = gsap.timeline();

  //   tl.to(entity, {
  //     progress: 1,
  //     y: 0.5,
  //     duration: 2,
  //     ease: 'none',
  //   });

  //   await tl.then();
  //   FillingECS.world.removeComponent(entity, 'filling', true);
  //   FillingECS.world.addComponent(entity, 'filled', true);
  //   // entity.filling = false;
  //   // entity.filled = true;
  // };

  const onFill = async (pos) => {
    console.log('onFill');

    setBeltLocked(true);

    const distance = Math.abs(current.current - pos);
    console.log('distance', distance);
    await gsap
      .to(current, {
        current: pos,
        duration: distance,
      })
      .then();

    let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
    FillingECS.world.addComponent(bottleToFill, 'filling', true);
  };

  const gl = useThree((state) => state.gl);

  const onPointerDown = () => {
    const isLocked = beltEntities.entities[0].locked;
    if (isLocked) return;

    let pos = current.current;
    let remainder = Math.abs(pos) % 1;
    // console.log('onPointerDown', remainder);
    if (remainder >= 1 - within) {
      onFill(Math.ceil(pos));
    }
  };

  const onPointerUp = () => {
    let pos = current.current;
    let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
    if (bottleToFill) {
      FillingECS.world.removeComponent(bottleToFill, 'filling', true);
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
    const isLocked = beltEntities.entities[0].locked;
    if (!isLocked) {
      const count = filledEntities.entities.length;
      speed.current = 1.5 + count * 0.5;
      current.current += delta * speed.current;
    }

    for (const entity of beltEntities) {
      entity.belt = current.current;
    }

    for (const entity of fillingEntities) {
      entity.progress += delta / fillTime.current;
      if (entity.progress >= 1) {
        FillingECS.world.removeComponent(entity, 'filling', true);
        FillingECS.world.addComponent(entity, 'filled', true);
      }
      console.log('progress', delta, fillTime.current, entity.progress);
    }
  });

  return null;
};
