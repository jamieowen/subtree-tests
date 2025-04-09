import './Tutorial.sass';
import classnames from 'classnames';
import IconPanel from '@/assets/panel.svg?react';
import { useDrag } from '@use-gesture/react';
import gsap from 'gsap';

const stepTime = 6;

export const Tutorial = memo(({ id, show, steps = 2, onClick }) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const nextStep = () => {
    if (step == steps - 1) return;
    setStep(step + 1);
  };
  const prevStep = () => {
    if (step == 0) return;
    setStep(step - 1);
  };

  useEffect(() => {
    if (show) {
      setStep(0);
    }
  }, [show]);

  // ***************************************************************************
  //
  // SWIPE
  //
  // ***************************************************************************
  const refPanel = useRef(null);
  const bind = useDrag((state) => {
    console.log(state.swipe[0], step);
    if (state.swipe[0] == 1) {
      prevStep();
    } else if (state.swipe[0] == -1) {
      nextStep();
    }
  });

  // ***************************************************************************
  //
  // SWIPE
  //
  // ***************************************************************************
  const refRoot = useRef(null);
  const { contextSafe } = useGSAP({ scope: refRoot });

  const _tl = useRef(null);

  const reset = contextSafe(() => {
    console.log('reset', id);
    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;
    tl.add('reset');
    tl.set('.preheading', { opacity: 0 }, 'reset');
    tl.set('.panel', { opacity: 0, scale: 0.5 }, 'reset');
    tl.set('.panel__heading', { opacity: 0, y: 20 }, 'reset');
    tl.set('.panel__text', { opacity: 0, y: 20 }, 'reset');
  });

  const animateIn = contextSafe(() => {
    reset();

    console.log('animateIn', id);

    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;

    // RESET

    // START
    tl.add('start');
    tl.to(
      '.preheading',
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(2)',
      },
      'start'
    );

    tl.to(
      '.panel',
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(2)',
      },
      'start+=0.2'
    );

    tl.to(
      ['.panel__heading', '.panel__text'],
      { opacity: 1, y: 0, duration: 0.5, ease: 'back.out(2)', stagger: 0.2 },
      'start+=0.15'
    );
  });

  const animateOut = contextSafe(() => {
    console.log('animateOut', id);

    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;

    tl.add('start');
    tl.to(
      ['.preheading', '.panel__heading', '.panel__text'],
      {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out',
      },
      'start'
    );

    tl.to(
      '.panel',
      {
        opacity: 0,
        scale: 0.5,
        duration: 0.3,
        ease: 'back.in(2)',
      },
      'start+=0.2'
    );
  });

  useEffect(reset, []);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (show) {
      animateIn();
    } else {
      animateOut();
    }
  }, [show]);

  return (
    <section
      className={classnames(['page', 'tutorial', { show }])}
      ref={refRoot}
    >
      <div className="page__top">
        <div className="preheading">{t(`${id}.tutorial.preheading`)}</div>
      </div>

      <div className="page__center panel">
        <IconPanel className="panel__frame" />
        <div className="panel__top">
          <div className="panel__heading">{t(`${id}.tutorial.heading`)}</div>
        </div>
        <div
          className="panel__center"
          ref={refPanel}
          {...bind()}
        >
          <div className="panel__wrap">
            <p className="panel__text">
              {t(`${id}.tutorial.instructions.${step}`)}
            </p>

            <div className="panel__icon">
              {id == 'cleaning' && <TutorialCleaning0 />}
              {/* {id == 'cleaning' && step == 1 && <TutorialCleaning1 />} */}
              {id == 'filling' && step == 0 && <TutorialFilling0 />}
              {id == 'filling' && step == 1 && <TutorialFilling1 />}
              {id == 'grouping' && step == 0 && <TutorialGrouping0 />}
              {id == 'grouping' && step == 1 && <TutorialGrouping1 />}
            </div>
          </div>
        </div>
        <div className="panel__bottom">
          <Pagination
            show={show}
            steps={steps}
            step={step}
            setStep={setStep}
            onComplete={onClick}
            stepTime={stepTime}
          />
        </div>
      </div>

      <div className="page__bottom">
        <ButtonPrimary
          show={show}
          delay={show ? 0.4 : 0}
          onClick={onClick}
          // auto={show ? stepTime * steps : 0}
        >
          {t(`${id}.tutorial.cta`)}
        </ButtonPrimary>
      </div>
    </section>
  );
});
