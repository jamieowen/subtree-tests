import './TutorialCleaning0.sass';
import gsap from 'gsap';

export const TutorialCleaning0 = () => {
  const refRoot = useRef(null);

  useGSAP(
    () => {
      let tl = gsap.timeline({ repeat: -1 });
      tl.add('start');
      // tl.set('.bottle-outline', { opacity: 1 });

      // tl.to('.bottle-solid-container', {
      //   x: `${-4.5 * 1}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });

      tl.set('.bottle-solid-container', {
        x: `${-4.5 * 2}rem`,
        duration: 0.8,
        ease: 'power3.inOut',
      });
      tl.set('.bottle-solid-container', {
        x: `${-4.5 * 3}rem`,
        duration: 0.8,
        ease: 'power3.inOut',
      });

      // tl.to('.bottle-solid-container', {
      //   x: `${-4.5 * 2}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });
      tl.to('.bottle-solid-container', {
        x: `${-4.5 * 5}rem`,
        duration: 0.8,
        ease: 'power3.inOut',
      });
      tl.to('.bottle-solid-container', {
        x: `${-4.5 * 3}rem`,
        duration: 0.8,
        ease: 'power3.inOut',
      });
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

      <div className="bottle-solid-container">
        {Array.from({ length: 10 }).map((_, i) => (
          <img
            key={i}
            src="/assets/images-next/cleaning-tutorial-solid.webp"
            className="bottle-solid"
          />
        ))}
      </div>
    </div>
  );
};
