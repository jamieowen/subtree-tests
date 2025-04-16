import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import AssetService from '@/services/AssetService';

const beltEntities = CleaningECS.world.with('belt');
const bottleEntities = CleaningECS.world.with('isBottle');
const lockedEntities = CleaningECS.world.with('locked');

export const CleaningSystemControls = forwardRef(
  (
    { playing = false, within = 0.3, multiplier = 0.016, oneDirection = false },
    ref
  ) => {
    const to = useRef(0);
    const current = useRef(0);

    const [wasDown, setWasDown] = useState(false);

    const reset = () => {
      to.current = 0;
      current.current = 0.5;

      for (const entity of bottleEntities) {
        entity.progress = 0;
        CleaningECS.world.addComponent(entity, 'unclean', true);
        CleaningECS.world.removeComponent(entity, 'cleaning', true);
        CleaningECS.world.removeComponent(entity, 'cleaned', true);
      }

      for (const entity of beltEntities) {
        entity.belt = current.current;
        CleaningECS.world.removeComponent(entity, 'locked', true);
      }
    };

    useImperativeHandle(ref, () => ({
      reset,
    }));

    let timeout;

    const onUp = async () => {
      if (!playing) return;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        let remainder = Math.abs(to.current) % 1;
        let isNegative = to.current < 0;

        if (remainder >= 1 - within) {
          to.current = isNegative
            ? Math.floor(to.current)
            : Math.ceil(to.current);
        }
        if (remainder <= within) {
          to.current = isNegative
            ? Math.ceil(to.current)
            : Math.floor(to.current);
        }
      }, 200);
    };

    const onDown = () => {
      if (!playing) return;
      if (timeout) clearTimeout(timeout);
      AssetService.getAsset('sfx_dragscreen').play();
    };

    const isLocked = () => {
      return lockedEntities.entities.length > 0;
    };

    useDrag(
      (state) => {
        if (isLocked()) return;
        if (!playing) return;

        if (oneDirection && to.current < 0) {
          to.current = 0;
          return;
        }

        if (wasDown && !state.down) {
          setWasDown(false);
          onUp();
        }
        if (!wasDown && state.down) {
          setWasDown(true);
          onDown();
        }

        // if (oneDirection && state.delta[0] < 0) return; // ONE DIRECTION ONLY
        to.current += state.delta[0] * multiplier;
      },
      { target: window }
    );

    useFrame((state, delta) => {
      const opts = [
        0.15, // smoothTime
        delta, // delta
        Infinity, // maxSpeed
        exp, // easing
        0.001, // eps
      ];

      damp(current, 'current', to.current, ...opts);
      if (oneDirection && current.current < 0) {
        current.current = 0;
      }

      for (const entity of beltEntities) {
        entity.belt = current.current;
      }
    });

    return null;
  }
);
