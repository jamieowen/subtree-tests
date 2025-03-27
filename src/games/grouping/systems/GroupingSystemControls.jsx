import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { GroupingECS } from '../state';

const boxEntities = GroupingECS.world.with('isBox');

export const GroupingSystemControls = ({
  within = 0.25,
  multiplier = 0.015,
  limit = 2,
  oneDirection = false,
}) => {
  const gl = useThree((state) => state.gl);

  const to = useRef(0);
  const current = useRef(0);

  useDrag(
    (state) => {
      // TODO: LIMIT
      if (to.current > limit) {
        to.current = limit;
        return;
      }
      if (to.current < -limit) {
        to.current = -limit;
        return;
      }

      to.current += state.delta[0] * multiplier;
    },
    { target: window }
  );

  useFrame((state, delta) => {
    const opts = [
      0.1, // smoothTime
      delta, // delta
      Infinity, // maxSpeed
      exp, // easing
      0.001, // eps
    ];

    damp(current, 'current', to.current, ...opts);

    for (const entity of boxEntities) {
      entity.position[0] = current.current;
    }
  });

  return null;
};
