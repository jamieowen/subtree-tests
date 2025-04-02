import './Intro.sass';
import classnames from 'classnames';

export const Intro = ({ id, show, onClick }) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'intro', { show }])}>
      <div className="step">
        <span>{t(`${id}.step`)}</span>
      </div>
      <h1>{t(`${id}.intro.heading`)}</h1>
      <p>{t(`${id}.intro.desc`)}</p>
      <ButtonPrimary onClick={onClick}>{t('cleaning.intro.cta')}</ButtonPrimary>
    </section>
  );
};
