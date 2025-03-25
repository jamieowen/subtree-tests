import './Cleaning.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useCleaningStore } from '@/stores/cleaning';

export const Cleaning = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const duration = useCleaningStore((state) => state.config.duration);
  const count = useCleaningStore((state) => state.count);
  const setCount = useCleaningStore((state) => state.setCount);
  const resetCount = useCleaningStore((state) => state.resetCount);

  const section = useCleaningStore((state) => state.section);
  const nextSection = useCleaningStore((state) => state.nextSection);

  const replay = useCleaningStore((state) => state.replay);

  const { completed } = useAssetProgress();

  return (
    <div className={classnames(['page', 'game', 'Cleaning', { show }])}>
      <section
        className={classnames(['page', 'intro', { show: section == 'intro' }])}
      >
        <h3>{t('cleaning.intro.preheading')}</h3>
        <h1>{t('cleaning.intro.heading')}</h1>
        <p>{t('cleaning.intro.desc')}</p>
        <button onClick={nextSection}>{t('cleaning.intro.cta')}</button>
      </section>

      <section
        className={classnames([
          'page',
          'tutorial',
          { show: section == 'tutorial' },
        ])}
      >
        <h1>{t('cleaning.tutorial.heading')}</h1>
        <button onClick={nextSection}>{t('cleaning.tutorial.cta')}</button>
      </section>

      {completed && show && <CleaningGame show={section == 'game'} />}

      <section
        className={classnames([
          'page',

          'results',
          { show: section == 'results' },
        ])}
      >
        <h3>{t('cleaning.results.preheading')}</h3>
        <h1>{t('cleaning.results.heading')}</h1>
        <Trans
          i18nKey="cleaning.results.desc"
          values={{
            duration,
            count,
          }}
        ></Trans>
        <div className="buttons">
          <button onClick={replay}>{t('cleaning.results.replay')}</button>
          <button onClick={() => setPage('filling-video')}>
            {t('cleaning.results.next')}
          </button>
        </div>
      </section>
    </div>
  );
};
