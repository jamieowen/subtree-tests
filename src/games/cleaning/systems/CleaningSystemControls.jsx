import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';

const beltEntities = CleaningECS.world.with('belt');
const bottleEntities = CleaningECS.world.with('isBottle');
const lockedEntities = FillingECS.world.with('locked');

export const CleaningSystemControls = forwardRef(
  (
    { playing = false, within = 0.25, multiplier = 0.01, oneDirection = false },
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
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        let remainder = Math.abs(to.current) % 1;

        if (remainder >= 1 - within) {
          to.current = Math.ceil(to.current);
        }
        if (remainder <= within) {
          to.current = Math.floor(to.current);
        }
      }, 200);
    };

    const onDown = () => {
      if (timeout) clearTimeout(timeout);
    };

    const isLocked = () => {
      return lockedEntities.entities.length > 0;
    };

    useDrag(
      (state) => {
        if (isLocked()) return;

        if (to.current < 0) {
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

        if (oneDirection && state.delta[0] < 0) return;
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
      if (current.current < 0) {
        current.current = 0;
      }

      for (const entity of beltEntities) {
        entity.belt = current.current;
      }
    });

    return null;
  }
);
