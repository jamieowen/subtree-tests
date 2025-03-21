// https://www.youtube.com/watch?v=tu-Qe66AvtY

import { Noise } from 'noisejs';
import { randomInRange } from '@/helpers/MathUtils';

export const CameraShake = ({
  trauma = { current: 0 },
  pow = 2,
  maxYaw = 1,
  maxPitch = 1,
  maxRoll = 1,
  maxOffset = 0,
  speed = { current: 1 },
  children,
  ...props
}) => {
  const refRoot = useRef(null);

  const [seed] = useState(Math.random());

  const noise = useRef(null);
  useEffect(() => {
    noise.current = new Noise(seed);
  }, [seed]);

  let time = useMemo(() => 0, []);

  useFrame(({ clock }, delta) => {
    if (!noise.current) return;

    let t = trauma.current;
    // t = 1;
    const shake = Math.pow(t, pow);

    // const time = clock.getElapsedTime();
    time += delta * speed.current;

    let yaw = maxYaw * shake * noise.current.simplex2(1, time);
    let pitch = maxPitch * shake * noise.current.simplex2(2, time);
    let roll = maxRoll * shake * noise.current.simplex2(3, time);
    refRoot.current.rotation.set(
      degToRad(yaw),
      degToRad(pitch),
      degToRad(roll)
    );

    if (maxOffset > 0) {
      let offsetX = maxOffset * shake * noise.current.simplex2(4, time);
      let offsetY = maxOffset * shake * noise.current.simplex2(5, time);
      let offsetZ = maxOffset * shake * noise.current.simplex2(6, time);
      refRoot.current.position.set(offsetX, offsetY, offsetZ);
    }
  });

  return <group ref={refRoot}>{children}</group>;
};
