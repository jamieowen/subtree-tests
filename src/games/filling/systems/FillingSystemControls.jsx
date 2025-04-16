import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';
import { urls } from '@/config/assets';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';
import { forwardRef } from 'react';
import { gsap } from 'gsap';
import * as config from '@/config/games/filling';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');
const fillingEntities = FillingECS.world.with('filling');
const filledEntities = FillingECS.world.with('filled');
const nozzleEntities = FillingECS.world.with('isNozzle');
const pouringEntities = FillingECS.world.with('pouring');
const cappingEntities = FillingECS.world.with('capping');
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
    const speed = useRef(config.initialSpeed);
    const timeToFill = useRef(config.initialTimeToFill);

    const reset = () => {
      current.current = 0;
      speed.current = config.initialSpeed;
      timeToFill.current = config.initialTimeToFill;

      for (const entity of bottleEntities) {
        FillingECS.world.removeComponent(entity, 'filling', true);
        FillingECS.world.removeComponent(entity, 'filled', true);
        FillingECS.world.removeComponent(entity, 'capped', true);
        FillingECS.world.removeComponent(entity, 'ended', true);
        entity.progress = 0;
      }

      for (const entity of nozzleEntities) {
        FillingECS.world.removeComponent(entity, 'pouring', true);
        FillingECS.world.removeComponent(entity, 'capping', true);
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
    const setNozzleCapping = (capping) => {
      for (let entity of nozzleEntities) {
        if (capping) {
          FillingECS.world.addComponent(entity, 'capping', true);
        } else {
          FillingECS.world.removeComponent(entity, 'capping', true);
        }
      }
    };

    const isPouring = () => {
      return pouringEntities.entities.length > 0;
    };
    const isCapping = () => {
      return cappingEntities.entities.length > 0;
    };

    let tween = useRef(null);

    const onFill = async (pos) => {
      setBeltLocked(true);

      const distance = Math.abs(current.current - pos);
      if (distance > 0) {
        tween.current = gsap.to(current, {
          current: pos,
          duration: (distance * 1) / speed.current,
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
      let filled = false;
      if (bottleToFill) {
        FillingECS.world.removeComponent(bottleToFill, 'filling', true);
        FillingECS.world.addComponent(bottleToFill, 'ended', true);

        filled =
          bottleToFill.progress >= config.threshold &&
          bottleToFill.progress <= 1.0;
        if (filled) {
          FillingECS.world.addComponent(bottleToFill, 'filled', true);
        } else {
          FillingECS.world.removeComponent(bottleToFill, 'filled', true);
        }
      }

      if (isPouring()) {
        setNozzlePouring(false);
        await PromiseTimeout(300);
      }
      if (filled) {
        setNozzleCapping(true);
        let endFrame = 25;
        await PromiseTimeout((endFrame / config.cappingFps) * 1000);
        FillingECS.world.addComponent(bottleToFill, 'capped', true);
        await PromiseTimeout(((48 - endFrame) / config.cappingFps) * 1000);
        setNozzleCapping(false);
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
        speed.current = Math.min(
          config.initialSpeed + count * config.speedIncrease,
          config.maxSpeed
        );
        current.current += delta * speed.current; // DEBUG
      }
      for (const entity of beltEntities) {
        entity.belt = current.current;
        entity.speed = speed.current;
      }

      // FILL
      timeToFill.current = Math.max(
        config.fillTimeMin,
        config.initialTimeToFill - count * config.fillTimeDecrease
      );

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
