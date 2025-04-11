import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { useCleaningStore } from '@/stores/cleaning';
import { addBottle } from '../entities/CleaningBottles';
import { gsap } from 'gsap';
import { randomIntRange } from '@/helpers/MathUtils';
import AssetService from '@/services/AssetService';
import { useEffect, useRef } from 'react';

const beltEntities = CleaningECS.world.with('belt');
const bottleEntities = CleaningECS.world.with('isBottle');
const uncleanEntities = CleaningECS.world.with('unclean');
const cleanedEntities = CleaningECS.world.with('cleaned');

export const CleaningSystemBottles = forwardRef(
  ({ playing = false, multiplier = 0.01, oneDirection = false }, ref) => {
    const count = useCleaningStore((state) => state.count);
    const setCount = useCleaningStore((state) => state.setCount);
    const lastBottleIdx = useRef(0);
    const minBottles = 5; // Minimum number of bottles to keep on screen

    const setBeltLocked = (locked) => {
      for (let entity of beltEntities) {
        if (locked) {
          CleaningECS.world.addComponent(entity, 'locked', true);
        } else {
          CleaningECS.world.removeComponent(entity, 'locked', true);
        }
      }
    };

    const cleanBottle = async (entity) => {
      if (entity.cleaning || entity.cleaned) return;

      AssetService.getAsset(`sfx_washbottle0${randomIntRange(1, 3)}`).play();

      setBeltLocked(true);

      CleaningECS.world.addComponent(entity, 'cleaning', true);
      let tl = gsap.timeline();

      tl.to(entity.position, { y: -0.25, duration: 0.1 });
      tl.to(entity, {
        progress: 1,
        y: 0.5,
        duration: 1.25,
        ease: 'none',
      });
      tl.to(entity.position, { y: 0, duration: 0.1 });

      await tl.then();
      CleaningECS.world.removeComponent(entity, 'cleaning', true);
      // entity.cleaned = true;
      CleaningECS.world.removeComponent(entity, 'unclean', true);
      CleaningECS.world.addComponent(entity, 'cleaned', true);

      setBeltLocked(false);
    };

    const emitter = useMitt();
    const onPointerDown = () => {
      let belt = beltEntities.entities?.[0]?.belt;
      for (const entity of uncleanEntities) {
        if (belt == entity.idx) {
          cleanBottle(entity);
        }
      }

      for (const entity of cleanedEntities) {
        console.log('onPointerDown', entity.idx, belt);
        if (belt == entity.idx) {
          emitter.emit('cleaning-cleaned');
        }
      }
    };

    // Initialize bottles when component mounts

    const initBottles = () => {
      // Add initial bottles
      for (let i = 0; i < minBottles; i++) {
        addBottle(i);
        lastBottleIdx.current = i;
      }

      // Add bottles in the negative direction
      for (let i = -1; i >= -minBottles; i--) {
        addBottle(i);
      }
    };
    useEffect(initBottles, []);

    const resetBottles = () => {
      // console.log('resetBottles');
      bottleEntities.entities.forEach((entity) => {
        CleaningECS.world.remove(entity);
      });
      initBottles();
    };

    useImperativeHandle(ref, () => ({
      resetBottles,
    }));

    // Function to check and add more bottles as needed
    const ensureBottlesVisible = (beltPosition) => {
      // Get all bottle indices
      const bottleIndices = Array.from(bottleEntities).map(
        (entity) => entity.idx
      );

      // Find the highest and lowest indices
      const maxIdx = Math.max(...bottleIndices);
      const minIdx = Math.min(...bottleIndices);

      // console.log(Math.round(beltPosition), minIdx, maxIdx);

      // Check if we need more bottles in the positive direction
      if (maxIdx < beltPosition + minBottles) {
        const newIdx = maxIdx + 1;
        addBottle(newIdx);
        lastBottleIdx.current = newIdx;
      }

      // Check if we need more bottles in the negative direction
      if (minIdx > beltPosition - minBottles) {
        const newIdx = minIdx - 1;
        addBottle(newIdx);
      }
    };

    useEffect(() => {
      // let el = gl.domElement
      let el = document.querySelector('.game-cleaning .btn-cta');
      el.addEventListener('pointerdown', onPointerDown);

      return () => {
        let el = document.querySelector('.game-cleaning .btn-cta');
        if (!el) return;
        el.removeEventListener('pointerdown', onPointerDown);
      };
    }, []);

    useFrame((state, delta) => {
      let belt = beltEntities.entities?.[0]?.belt;
      // console.log('belt', belt);

      if (!playing) return;

      // Ensure there are always bottles visible on screen
      ensureBottlesVisible(belt);

      // AUTO TRIGGER CLEAN
      // for (const entity of uncleanEntities) {
      //   if (belt == entity.idx) {
      //     cleanBottle(entity);
      //   }
      // }

      // COUNT CLEANED
      let num = cleanedEntities.entities.length;
      if (count != num) {
        setCount(num);
      }
    });

    return null;
  }
);
