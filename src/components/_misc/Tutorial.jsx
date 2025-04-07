import './Tutorial.sass';
import classnames from 'classnames';
import IconPanel from '@/assets/panel.svg?react';

export const Tutorial = ({ id, show, onClick }) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'tutorial', { show }])}>
      <div className="page__top">
        <motion.div
          className="preheading"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
          transition={{ duration: 0.6, delay: show ? 0.2 : 0 }}
        >
          {t(`${id}.tutorial.preheading`)}
        </motion.div>
      </div>

      <motion.div
        className="page__center panel"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{ duration: show ? 0.6 : 0.2, delay: show ? 0.3 : 0 }}
      >
        <IconPanel className="panel__frame" />
        <div className="panel__top">
          <div className="panel__heading">{t(`${id}.tutorial.heading`)}</div>
        </div>
        <div className="panel__center">
          <div className="panel__wrap">
            <p>{t(`${id}.tutorial.instructions.0`)}</p>

            <div className="panel__icon">
              {id == 'cleaning' && <TutorialCleaning />}
              {id == 'filling' && <TutorialFilling />}
              {id == 'grouping' && <TutorialGrouping />}
            </div>
          </div>
        </div>
        <div className="panel__bottom"></div>
      </motion.div>

      <div className="page__bottom">
        <ButtonPrimary
          show={show}
          delay={show ? 0.6 : 0}
          onClick={onClick}
          auto={show ? 10 : 0}
        >
          {t(`${id}.tutorial.cta`)}
        </ButtonPrimary>
      </div>
    </section>
  );
};
