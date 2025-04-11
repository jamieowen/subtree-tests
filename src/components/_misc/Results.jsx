import './Results.sass';
import classnames from 'classnames';
import AssetService from '@/services/AssetService';
import gsap from 'gsap';

export const Results = ({
  id,
  show,
  count = 0,
  points = 0,
  onReplay,
  onNext,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!show) return;
    AssetService.getAsset('sfx_showresult').play();
  }, [show]);

  // ANIMATE IN
  const refRoot = useRef(null);
  const { contextSafe } = useGSAP({ scope: refRoot });
  const _tl = useRef(null);

  const animateIn = contextSafe(() => {
    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;
    tl.set(refRoot.current, { opacity: 1 });

    tl.add('start');
    tl.fromTo(
      '.scores .bg',
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
      ['.scores .value', '.scores .label'],
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'back.out(2)',
      },
      'start+=0.2'
    );

    tl.fromTo(
      '.btn-secondary',
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(2)',
      },
      'start+=0.5'
    );

    tl.fromTo(
      '.btn-secondary .line',
      {
        scaleX: 0,
      },
      {
        scaleX: 1,
        transformOrigin: 'left',
        duration: 0.8,
        ease: 'power3.out',
      },
      'start+=0.6'
    );
  });

  const animateOut = contextSafe(() => {
    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;
    tl.add('start');

    tl.to(refRoot.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
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
    <section
      className={classnames(['page', 'results', { show }])}
      ref={refRoot}
    >
      <BottleBg show={show} />

      <div className="wrap">
        <Heading1 show={show}>{t(`${id}.results.heading`)}</Heading1>

        <ul className="scores">
          <li>
            <div className="bg" />
            <div className="value">{count}</div>
            <div className="label">{t(`${id}.results.desc`)}</div>
          </li>
        </ul>

        <button
          className="btn-secondary"
          onClick={onReplay}
        >
          {t(`${id}.results.replay`)}
          <div className="line" />
        </button>
      </div>
      <ButtonPrimary
        onClick={onNext}
        show={show}
        delay={show ? 1 : 0}
        auto={show ? 8 : 0}
      >
        {t(`${id}.results.next`)}
      </ButtonPrimary>
    </section>
  );
};
