import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { GroupingECS } from '../state';
import { useGroupingStore } from '@/stores/grouping';

const boxEntities = GroupingECS.world.with('isBox');

export const GroupingSystemControls = forwardRef(
  (
    {
      playing = false,
      within = 0.25,
      multiplier = 0.015,
      limit = 2,
      oneDirection = false,
    },
    ref
  ) => {
    const gl = useThree((state) => state.gl);

    const to = useRef(0);
    const current = useRef(0);

    const count = useGroupingStore((state) => state.count);

    const smoothTime = useMemo(() => {
      let num = count % 21;
      let out = 0.1 + num * 0.025;
      console.log(num, out);
      return out;
    }, [count]);

    // const multiplier = useMemo(() => {
    //   let num = count % 20;
    //   return 0.015 - num * 0.0005;
    // }, [count]);

    useDrag(
      (state) => {
        if (!playing) return;

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
        // console.log(multiplier);
      },
      { target: window }
    );

    useFrame((state, delta) => {
      const opts = [
        smoothTime, // smoothTime
        delta, // delta
        Infinity, // maxSpeed
        exp, // easing
        0.001, // eps
      ];

      // console.log(100, 'smoothTime', smoothTime);

      damp(current, 'current', to.current, ...opts);

      for (const entity of boxEntities) {
        entity.position[0] = current.current;
      }
    });

    return null;
  }
);
