import './Results.sass';
import classnames from 'classnames';

export const Results = ({
  id,
  show,
  count = 0,
  points = 0,
  onReplay,
  onNext,
}) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'results', { show }])}>
      <div className="wrap">
        <h1>{t(`${id}.results.heading`)}</h1>
        <Trans
          i18nKey={`${id}.results.desc`}
          values={{
            count,
            points,
          }}
        ></Trans>

        <ul className="scores">
          <li>
            <div className="value">{count}</div>
            <div className="label">{t('general.bottles')}</div>
          </li>
          <li>
            <div className="value">{points}</div>
            <div className="label">{t('general.points')}</div>
          </li>
        </ul>

        <button
          className="btn-secondary"
          onClick={onReplay}
        >
          {t(`${id}.results.replay`)}
        </button>
      </div>
      <ButtonPrimary
        onClick={onNext}
        auto={show ? 10 : 0}
      >
        {t(`${id}.results.next`)}
      </ButtonPrimary>
    </section>
  );
};
