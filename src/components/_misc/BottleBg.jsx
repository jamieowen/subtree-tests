import IconPattern from '@/assets/bottle-pattern.svg?react';
import './BottleBg.sass';
import gsap from 'gsap';

export const BottleBg = ({ show }) => {
  const refRoot = useRef(null);
  const refPattern = useRef(null);

  const { contextSafe } = useGSAP({ scope: refRoot });

  const _tl = useRef(null);
  const loop = useRef(null);

  const animateIn = contextSafe(() => {
    console.log('BottleBg', 'animateIn');
    if (_tl.current) _tl.current.kill();
    if (loop.current) loop.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;
    tl.add('start');
    tl.set(refRoot.current, { opacity: 1, y: '150lvh' });
    tl.to(refRoot.current, {
      y: 0,
      duration: 1,
      ease: 'power3.out',
    });

    loop.current = gsap.fromTo(
      refPattern.current,
      { y: 0 },
      {
        y: '-50%',
        duration: 15,
        ease: 'none',
        repeat: -1,
      }
    );
  });

  // const animateOut = contextSafe(() => {
  //   if (_tl.current) _tl.current.kill();
  //   let tl = gsap.timeline();
  //   _tl.current = tl;
  //   tl.add('start');
  //   tl.to(refRoot.current, {
  //     opacity: 0,
  //     duration: 0.3,
  //     ease: 'power2.out',
  //   });
  // });

  useEffect(() => {
    if (show) {
      animateIn();
    }
    // else {
    //   animateOut();
    // }
  }, [show]);

  return (
    <div
      className="bottleBg"
      ref={refRoot}
    >
      <div
        className="bottleBg__pattern"
        ref={refPattern}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="contents"
          >
            <IconPattern className="bottleBg__bottle red" />
            <IconPattern className="bottleBg__bottle green" />
          </div>
        ))}
      </div>
      <div className="bottleBg__circle" />
    </div>
  );
};
