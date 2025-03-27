import './Grouping.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useGroupingStore } from '@/stores/grouping';

export const Grouping = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const duration = useGroupingStore((state) => state.config.duration);
  const count = useGroupingStore((state) => state.count);
  const setCount = useGroupingStore((state) => state.setCount);
  const resetCount = useGroupingStore((state) => state.resetCount);

  const section = useGroupingStore((state) => state.section);
  const nextSection = useGroupingStore((state) => state.nextSection);

  const replay = useGroupingStore((state) => state.replay);

  const { completed } = useAssetProgress();

  return (
    <div className={classnames(['page', 'game', 'Grouping', { show }])}>
      <section
        className={classnames(['page', 'intro', { show: section == 'intro' }])}
      >
        <h3>{t('grouping.intro.preheading')}</h3>
        <h1>{t('grouping.intro.heading')}</h1>
        <p>{t('grouping.intro.desc')}</p>
        <button onClick={nextSection}>{t('grouping.intro.cta')}</button>
      </section>

      <section
        className={classnames([
          'page',
          'tutorial',
          { show: section == 'tutorial' },
        ])}
      >
        <h1>{t('grouping.tutorial.heading')}</h1>
        <button onClick={nextSection}>{t('grouping.tutorial.cta')}</button>
      </section>

      {completed && show && (
        <GroupingGame
          show={section == 'game'}
          onEnded={nextSection}
        />
      )}

      <section
        className={classnames([
          'page',

          'results',
          { show: section == 'results' },
        ])}
      >
        <h3>{t('grouping.results.preheading')}</h3>
        <h1>{t('grouping.results.heading')}</h1>
        <Trans
          i18nKey="grouping.results.desc"
          values={{
            duration,
            count,
          }}
        ></Trans>
        <div className="buttons">
          <button onClick={replay}>{t('grouping.results.replay')}</button>
          <button onClick={() => setPage('ending-video')}>
            {t('grouping.results.next')}
          </button>
        </div>
      </section>
    </div>
  );
};
