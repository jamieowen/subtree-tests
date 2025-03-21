import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';

const beltEntities = ECS.world.with('belt');
const bottleEntities = ECS.world.with('isBottle');

export const SystemControls = ({
  within = 0.25,
  multiplier = 0.01,
  oneDirection = false,
}) => {
  const to = useRef(0);
  const current = useRef(0);

  const [wasDown, setWasDown] = useState(false);

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

  useDrag(
    (state) => {
      const isLocked = beltEntities.entities[0].locked;
      if (isLocked) return;

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
};
