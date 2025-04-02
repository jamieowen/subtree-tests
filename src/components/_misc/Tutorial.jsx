import './Tutorial.sass';
import classnames from 'classnames';
import IconHelp from '@/assets/help.svg?react';
import IconPanel from '@/assets/panel.svg?react';

export const Tutorial = ({ id, show, onClick }) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'tutorial', { show }])}>
      <div className="page__top">
        <div className="preheading">{t(`${id}.tutorial.preheading`)}</div>
      </div>

      <div className="page__center panel">
        <IconPanel />
        <div className="panel__top">
          <div className="panel__heading">{t(`${id}.tutorial.heading`)}</div>
          <IconHelp className="help" />
        </div>
        <div className="panel__center">
          <div className="panel__wrap">
            <p>{t(`${id}.tutorial.instructions.0`)}</p>
          </div>
        </div>
        <div className="panel__bottom"></div>
      </div>

      <div className="page__bottom">
        <ButtonPrimary
          onClick={onClick}
          auto={show ? 10 : 0}
        >
          {t(`${id}.tutorial.cta`)}
        </ButtonPrimary>
      </div>
    </section>
  );
};
