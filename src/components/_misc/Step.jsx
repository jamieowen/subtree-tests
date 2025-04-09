import './Step.sass';
import gsap from 'gsap';

export const Step = ({ id, show }) => {
  const { t } = useTranslation();

  const refRoot = useRef(null);

  const { contextSafe } = useGSAP({ scope: refRoot });

  const _tl = useRef(null);

  const reset = () => {
    if (_tl.current) _tl.current.kill();
    gsap.set(refRoot.current, { opacity: 0 });
  };
  useEffect(reset, []);

  const animateIn = contextSafe(() => {
    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;
    tl.add('start');
    tl.set(refRoot.current, { opacity: 1 });
    tl.fromTo(
      '.bg',
      {
        opacity: 0,
        scale: 0.5,
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(2)',
      },
      'start'
    );
    tl.fromTo(
      '.label',
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(2)',
      },
      'start+=0.2'
    );
  });

  const animateOut = contextSafe(() => {
    if (_tl.current) _tl.current.kill();
    gsap.to(refRoot.current, {
      opacity: 0,
      duration: 0.3,
    });
  });

  useEffect(() => {
    if (show) {
      animateIn();
    } else {
      animateOut();
    }
  }, [show]);

  return (
    <div
      className="step"
      ref={refRoot}
    >
      <div className="bg" />
      <span className="label">{t(`${id}.step`)}</span>
    </div>
  );
};
