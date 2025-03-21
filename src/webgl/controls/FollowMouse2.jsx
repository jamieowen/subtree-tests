import { exp } from 'maath/easing';
import { useMouse3 } from '@/webgl/hooks/useMouse3';

export const FollowMouse2 = ({
  smoothTime = 0.15,
  maxSpeed = Infinity,
  easing = exp,
  eps = 0.001,
  children,
  out = 0.5,
  multiplier = [0.5, 0.5],
  ...props
}) => {
  const refRoot = useRef();

  const getMouse = useMouse2(out);

  const viewport = useThree((s) => s.viewport);

  useFrame((state, delta) => {
    if (!refRoot.current) return;
    const mouse2 = getMouse(smoothTime, delta);
    refRoot.current.position.x = ((mouse2.x * 2 - 1) * viewport.width) / 2;
    refRoot.current.position.y =
      (((mouse2.y * 2 - 1) * viewport.height) / 2) * -1;

    // console.log(mouse2.x, mouse2.y);
  }, -3);

  return <group ref={refRoot}>{children}</group>;
};

export default FollowMouse;
