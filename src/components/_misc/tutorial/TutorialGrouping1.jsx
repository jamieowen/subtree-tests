import './TutorialGrouping1.sass';
import { gsap } from 'gsap';
import IconFall from '@/assets/grouping-tutorial-fall.svg?react';

export const TutorialGrouping1 = () => {
  const refNub = useRef(null);

  // useEffect(() => {
  //   gsap.fromTo(
  //     refNub.current,
  //     { x: '-40%' },
  //     {
  //       x: '40%',
  //       duration: 1,
  //       ease: 'power2.inOut',
  //       repeat: -1,
  //       yoyo: true,
  //     }
  //   );
  // }, []);

  return (
    <div className="tutorial-grouping1">
      <div className="fall-wrap">
        <IconFall />
        <IconFall />
        <IconFall />
      </div>

      {/* {Array.from({ length: 6 }).map((_, idx) => (
        <img
          key={idx}
          src="/assets/images-next/filling-tutorial-solid.webp"
        />
      ))} */}
    </div>
  );
};
