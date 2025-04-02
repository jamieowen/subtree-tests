import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';
import { urls } from '@/config/assets';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';
import { forwardRef } from 'react';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');
const fillingEntities = FillingECS.world.with('filling');
const filledEntities = FillingECS.world.with('filled');
const nozzleEntities = FillingECS.world.with('isNozzle');
const pouringEntities = FillingECS.world.with('pouring');
const lockedEntities = FillingECS.world.with('locked');

export const FillingSystemControls = forwardRef(
  (
    {
      playing = false,
      within = 0.25,
      multiplier = 0.01,
      oneDirection = false,
      textureConfigs,
    },
    ref
  ) => {
    const current = useRef(0);
    const speed = useRef(0.5);
    const timeToFill = useRef(0.5);

    const reset = () => {
      current.current = 0;
      speed.current = 0.5;
      timeToFill.current = 0.5;

      for (const entity of bottleEntities) {
        FillingECS.world.removeComponent(entity, 'filling', true);
        FillingECS.world.removeComponent(entity, 'filled', true);
        FillingECS.world.removeComponent(entity, 'pouring', true);
        FillingECS.world.removeComponent(entity, 'ended', true);
        entity.progress = 0;
      }

      for (const entity of beltEntities) {
        entity.belt = current.current;
        entity.speed = speed.current;
        FillingECS.world.removeComponent(entity, 'locked', true);
      }
    };

    useImperativeHandle(ref, () => ({
      reset,
    }));

    const setBeltLocked = (locked) => {
      for (let entity of beltEntities) {
        if (locked) {
          FillingECS.world.addComponent(entity, 'locked', true);
        } else {
          FillingECS.world.removeComponent(entity, 'locked', true);
        }
      }
    };

    const isLocked = () => {
      return lockedEntities.entities.length > 0;
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

    let tween = useRef(null);

    const onFill = async (pos) => {
      setBeltLocked(true);

      const distance = Math.abs(current.current - pos);
      if (distance > 0) {
        tween.current = gsap.to(current, {
          current: pos,
          duration: distance * 2 * speed.current,
          ease: 'none',
        });
        await tween.current.then();
      }

      if (!isLocked()) return;
      setNozzlePouring(true);
      let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
      FillingECS.world.addComponent(bottleToFill, 'filling', true);
    };

    const gl = useThree((state) => state.gl);

    const onPointerDown = () => {
      if (isLocked()) return;
      if (tween.current) tween.current.kill();

      let pos = current.current;
      let remainder = Math.abs(pos) % 1;

      // return onFill(0); // DEBUG
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
        FillingECS.world.removeComponent(bottleToFill, 'pouring', true);

        if (bottleToFill.progress >= 0.75 && bottleToFill.progress <= 1.0) {
          FillingECS.world.addComponent(bottleToFill, 'filled', true);
        } else {
          FillingECS.world.removeComponent(bottleToFill, 'filled', true);
        }
      }

      if (isPouring()) {
        setNozzlePouring(false);
        await PromiseTimeout(300);
      }
      setBeltLocked(false);
    };

    useEffect(() => {
      // let el = gl.domElement
      let el = document.querySelector('.game-filling .btn-cta');
      el.addEventListener('pointerdown', onPointerDown);
      el.addEventListener('pointerup', onPointerUp);

      return () => {
        let el = document.querySelector('.game-filling .btn-cta');
        if (!el) return;
        el.removeEventListener('pointerdown', onPointerDown);
        el.removeEventListener('pointerup', onPointerUp);
      };
    }, []);

    useFrame((state, delta) => {
      if (!playing) return;

      // MOVE BELT
      const count = filledEntities.entities.length;
      if (!isLocked()) {
        speed.current = Math.min(0.5 + count * 0.1, 1);
        current.current += delta * speed.current; // DEBUG
      }
      for (const entity of beltEntities) {
        entity.belt = current.current;
        entity.speed = speed.current;
      }

      // FILL
      timeToFill.current = Math.max(0.5, 3 - count * 0.5);

      let complete = false;
      for (const entity of fillingEntities) {
        if (entity.filling) {
          entity.progress += delta / timeToFill.current;
          entity.progress = Math.min(entity.progress, 1);
        }
      }

      if (complete) {
        for (const entity of pouringEntities) {
          if (entity.progress >= 1) {
            FillingECS.world.removeComponent(entity, 'pouring', true);
          }
        }
      }
    });

    return null;
  }
);
