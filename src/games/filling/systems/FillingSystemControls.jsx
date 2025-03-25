import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');
const filledEntities = FillingECS.world.with('filled');

export const FillingSystemControls = ({
  within = 0.25,
  multiplier = 0.01,
  oneDirection = false,
}) => {
  const current = useRef(0);
  const speed = useRef(1.5);

  const setBeltLocked = (locked) => {
    for (let entity of beltEntities) {
      entity.locked = locked;
    }
  };

  const fillBottle = async (entity) => {
    console.log('fillBottle');
    if (entity.filling || entity.filled) return;

    FillingECS.world.addComponent(entity, 'filling', true);
    entity.filling = true;
    let tl = gsap.timeline();

    tl.to(entity, {
      progress: 1,
      y: 0.5,
      duration: 2,
      ease: 'none',
    });

    await tl.then();
    FillingECS.world.removeComponent(entity, 'filling', true);
    FillingECS.world.addComponent(entity, 'filled', true);
    // entity.filling = false;
    // entity.filled = true;
  };

  const onFill = async (pos) => {
    console.log('onFill');

    setBeltLocked(true);
    await gsap.to(current, { current: pos, duration: 0.1 }).then();

    const promises = [];
    for (const entity of bottleEntities) {
      if (pos == entity.idx) {
        let p = fillBottle(entity);
        promises.push(p);
      }
      await Promise.all(promises);
    }

    setBeltLocked(false);
  };

  const gl = useThree((state) => state.gl);

  const onPointerDown = () => {
    const isLocked = beltEntities.entities[0].locked;
    if (isLocked) return;

    let pos = current.current;
    let remainder = Math.abs(pos) % 1;
    console.log('onPointerDown', remainder);
    if (remainder >= 1 - within) {
      onFill(Math.ceil(pos));
    }
    if (remainder <= within) {
      onFill(Math.floor(pos));
    }
  };

  useEffect(() => {
    gl.domElement.addEventListener('pointerdown', onPointerDown);
    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  useFrame((state, delta) => {
    const isLocked = beltEntities.entities[0].locked;
    if (!isLocked) {
      const count = filledEntities.entities.length;
      speed.current = 1.5 + count * 0.5;
      console.log('count', count, speed.current);
      current.current += delta * speed.current;
    }

    for (const entity of beltEntities) {
      entity.belt = current.current;
    }
  });

  return null;
};
