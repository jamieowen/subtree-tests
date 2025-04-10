import './TutorialCleaning0.sass';
import gsap from 'gsap';

export const TutorialCleaning0 = () => {
  const refRoot = useRef(null);

  useGSAP(
    () => {
      let tl = gsap.timeline({ repeat: -1 });
      tl.add('start');
      tl.set('.bottle-outline', { opacity: 1 });
      tl.set('.bottle-solid-left', { y: '-50%' });
      tl.set('.bottle-solid-right', { y: '-50%' });
      tl.fromTo(
        '.bottle-solid-left',
        { x: '-100%' },
        { x: '-50%', duration: 1, ease: 'power2.out' },
        'start'
      );
      tl.fromTo(
        '.bottle-solid-right',
        { x: '50%' },
        { x: '-50%', duration: 1, ease: 'power2.out' }
      );
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
        className="bottle-solid-left"
      />
      <img
        src="/assets/images-next/cleaning-tutorial-solid.webp"
        className="bottle-solid-right"
      />
    </div>
  );
};
