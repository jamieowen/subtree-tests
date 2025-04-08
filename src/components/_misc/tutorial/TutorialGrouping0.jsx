import './TutorialGrouping0.sass';
import { gsap } from 'gsap';

export const TutorialGrouping0 = () => {
  const refNub = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      refNub.current,
      { x: '-40%' },
      {
        x: '40%',
        duration: 1,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      }
    );
  }, []);

  return (
    <div className="tutorial-grouping0">
      <div className="circle">
        <div
          className="nub"
          ref={refNub}
        />
      </div>
    </div>
  );
};
