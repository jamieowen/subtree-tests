import './Tutorial.sass';
import classnames from 'classnames';
import IconPanel from '@/assets/panel.svg?react';

const stepTime = 6;

export const Tutorial = ({ id, show, steps = 2, onClick }) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(0);

  useEffect(() => {
    if (show) {
      setStep(0);
    }
  }, [show]);

  return (
    <section className={classnames(['page', 'tutorial', { show }])}>
      <div className="page__top">
        <motion.div
          className="preheading"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.3, delay: show ? 0.2 : 0 }}
        >
          {t(`${id}.tutorial.preheading`)}
        </motion.div>
      </div>

      <motion.div
        className="page__center panel"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{
          duration: show ? 0.3 : 0.2,
          delay: show ? 0.3 : 0,
          ease: 'backOut',
        }}
      >
        <IconPanel className="panel__frame" />
        <div className="panel__top">
          <div className="panel__heading">{t(`${id}.tutorial.heading`)}</div>
        </div>
        <div className="panel__center">
          <div className="panel__wrap">
            <p>{t(`${id}.tutorial.instructions.${step}`)}</p>

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
      </motion.div>

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
};
