import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';

export const DragRotate = ({
  enabled = true,
  multiplier = [-5, -5],
  limitX = [-60, 0],
  distance = 10,
  children,
  ...props
}) => {
  const refRotateX = useRef(null);
  const refRotateY = useRef(null);
  const refDistance = useRef(null);

  const gl = useThree((state) => state.gl);
  const domElement = gl.domElement;

  const [target, setTarget] = useState({
    x: 0,
    y: 0,
    z: 0,
  });

  const stage = useAppStore((state) => state.stage);

  useDrag(
    (state) => {
      if (!enabled || !state.dragging || stage != 5) {
        target.x = 0;
        target.y = 0;
        target.z = 0;
        return;
      }

      let y =
        refRotateY.current.rotation.y +
        degToRad(state.delta[0] * multiplier[0]);

      let x =
        refRotateX.current.rotation.x +
        degToRad(state.delta[1] * multiplier[1]);
      x = Math.max(degToRad(limitX[0]), Math.min(degToRad(limitX[1]), x));

      target.x = x;
      target.y = y;
      target.z = distance;
    },
    { target: domElement }
  );

  useFrame((state, delta) => {
    const opts = [
      0.15, // smoothTime
      delta, // delta
      Infinity, // maxSpeed
      exp, // easing
      0.001, // eps
    ];

    damp(refRotateX.current.rotation, 'x', target.x, ...opts);
    damp(refRotateY.current.rotation, 'y', target.y, ...opts);
    damp(refDistance.current.position, 'z', target.z, ...opts);
  });

  return (
    <group
      ref={refRotateY}
      {...props}
    >
      <group ref={refRotateX}>
        <group ref={refDistance}>{children}</group>
      </group>
    </group>
  );
};
