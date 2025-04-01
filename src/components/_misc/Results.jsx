import './Results.sass';
import classnames from 'classnames';

export const Results = ({ id, show, count, points, onReplay, onNext }) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'results', { show }])}>
      <div className="wrap">
        <h1>{t(`${id}.results.heading`)}</h1>
        <Trans
          i18nKey={`${id}.results.desc`}
          values={{
            count: count || 0,
            points: points || 0,
          }}
        ></Trans>
        <button
          className="btn-secondary"
          onClick={onReplay}
        >
          {t(`${id}.results.replay`)}
        </button>
      </div>
      <ButtonPrimary onClick={onNext}>{t(`${id}.results.next`)}</ButtonPrimary>
    </section>
  );
};
