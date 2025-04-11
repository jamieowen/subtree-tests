import './TutorialCleaning1.sass';
import gsap from 'gsap';

export const TutorialCleaning1 = () => {
  const refRoot = useRef(null);

  useGSAP(
    () => {
      let tl = gsap.timeline({ repeat: -1 });
      tl.add('start');
      // tl.set('.bottle-outline', { opacity: 1 });

      tl.to(
        '.inner2',
        {
          scale: 0.8,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        'start'
      );
      tl.to(
        '.bottle',
        {
          filter: 'brightness(1)',
          duration: 0.8,
          ease: 'power3.inOut',
        },
        'start'
      );
      tl.to(
        '.inner0',
        {
          scale: 1.2,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.inOut',
        },
        'start'
      );

      tl.add('out');
      tl.to(
        '.inner2',
        {
          scale: 1,
          duration: 0.3,
          ease: 'power3.out',
        },
        'out'
      );
      tl.to(
        '.bottle',
        {
          filter: 'brightness(0.9)',
          duration: 0.3,
          ease: 'power3.out',
        },
        'out'
      );

      // tl.set('.bottle-solid-container', {
      //   x: `${-4.5 * 2}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });
      // tl.set('.bottle-solid-container', {
      //   x: `${-4.5 * 3}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });

      // tl.to('.bottle-solid-container', {
      //   x: `${-4.5 * 2}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });
      // tl.to('.bottle-solid-container', {
      //   x: `${-4.5 * 5}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });
      // tl.to('.bottle-solid-container', {
      //   x: `${-4.5 * 3}rem`,
      //   duration: 0.8,
      //   ease: 'power3.inOut',
      // });
    },
    { scope: refRoot }
  );

  return (
    <div
      className="tutorial-cleaning1"
      ref={refRoot}
    >
      <img
        src="/assets/images-next/cleaning-tutorial-solid.webp"
        className="bottle"
      />

      <div className="circle">
        <div className="inner0" />
        <div className="inner1" />
        <div className="inner2" />
      </div>
    </div>
  );
};
