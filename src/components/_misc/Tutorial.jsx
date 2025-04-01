import './Tutorial.sass';
import classnames from 'classnames';
import IconHelp from '@/assets/help.svg?react';
import IconPanel from '@/assets/panel.svg?react';

export const Tutorial = ({ id, show, onClick }) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'tutorial', { show }])}>
      <div className="step">{t(`${id}.step`)}</div>
      <div className="preheading">{t(`${id}.tutorial.preheading`)}</div>

      <div className="panel">
        <IconPanel />
        <div className="top">
          <div className="heading">{t(`${id}.tutorial.heading`)}</div>
          <IconHelp className="help" />
        </div>
        <div className="center">
          <div className="wrap">
            <p>{t(`${id}.tutorial.instructions.0`)}</p>
          </div>
        </div>
        <div className="bottom"></div>
      </div>
      <ButtonPrimary onClick={onClick}>{t(`${id}.tutorial.cta`)}</ButtonPrimary>
    </section>
  );
};
