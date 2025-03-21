import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { damp, dampQ, dampE } from 'maath/easing';

export const ScrollRotate = ({ amount = 15, children, ...props }) => {
  const refRoot = useRef();
  const { scroll } = useScroller();

  const toAngle = useRef(0);

  useFrame((state, delta) => {
    toAngle.current += degToRad(
      amount * Math.min(scroll.current.velocity, 10) * delta
    );
    damp(toAngle, 'current', 0, 1, delta);
    dampE(refRoot.current.rotation, [toAngle.current, 0, 0], 0.15, delta);
  });

  return <group ref={refRoot}>{children}</group>;
};
