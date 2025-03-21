import { exp } from 'maath/easing';
import { useMouse3 } from '@/webgl/hooks/useMouse3';

export const FollowMouse = ({
  smoothTime = 0.15,
  maxSpeed = Infinity,
  easing = exp,
  eps = 0.001,
  children,
  out = [0, 0, 0],
  multiplier = [1, 1, 1],
  ...props
}) => {
  const refRoot = useRef();

  const getMouse = useMouse3({ out });

  useFrame((state, delta) => {
    if (!refRoot.current) return;
    const { mouse3 } = getMouse(smoothTime, delta, maxSpeed, easing, eps);
    refRoot.current.position.x = mouse3.x * multiplier[0];
    refRoot.current.position.y = mouse3.y * multiplier[1];
    refRoot.current.position.z = mouse3.y * multiplier[2];

    // console.log(mouse3.x, mouse3.y);

    // refRoot.current.position.x = mouse3.x;
  }, -3);

  return <group ref={refRoot}>{children}</group>;
};

export default FollowMouse;
