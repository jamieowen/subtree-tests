import './TutorialCleaning0.sass';
import gsap from 'gsap';

export const TutorialCleaning0 = () => {
  const refRoot = useRef(null);

  useGSAP(
    () => {
      let tl = gsap.timeline({ repeat: -1 });
      tl.add('start');
      tl.set('.bottle-outline', { opacity: 1 });
      tl.set('.bottle-solid', { y: '-50%' });
      tl.fromTo(
        '.bottle-solid',
        { x: '-100%' },
        { x: '-50%', duration: 1, ease: 'power2.out' },
        'start'
      );
      tl.to('.bottle-solid', { opacity: 0, duration: 0.3 });
    },
    { scope: refRoot }
  );

  return (
    <div
      className="tutorial-cleaning0"
      ref={refRoot}
    >
      <img
        src="/assets/images-next/cleaning-tutorial-outline.webp"
        className="bottle-outline"
      />
      <img
        src="/assets/images-next/cleaning-tutorial-solid.webp"
        className="bottle-solid"
      />
    </div>
  );
};
