import './Filling.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useFillingStore } from '@/stores/filling';

export const Filling = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const duration = useFillingStore((state) => state.config.duration);
  const count = useFillingStore((state) => state.count);
  const setCount = useFillingStore((state) => state.setCount);
  const resetCount = useFillingStore((state) => state.resetCount);

  const section = useFillingStore((state) => state.section);
  const nextSection = useFillingStore((state) => state.nextSection);

  const replay = useFillingStore((state) => state.replay);

  const { completed } = useAssetProgress();

  return (
    <div className={classnames(['page', 'game', 'Filling', { show }])}>
      <section
        className={classnames(['page', 'intro', { show: section == 'intro' }])}
      >
        <h3>{t('filling.intro.preheading')}</h3>
        <h1>{t('filling.intro.heading')}</h1>
        <p>{t('filling.intro.desc')}</p>
        <button onClick={nextSection}>{t('filling.intro.cta')}</button>
      </section>

      <section
        className={classnames([
          'page',
          'tutorial',
          { show: section == 'tutorial' },
        ])}
      >
        <h1>{t('filling.tutorial.heading')}</h1>
        <button onClick={nextSection}>{t('filling.tutorial.cta')}</button>
      </section>

      {/* {completed && show && <FillingGame show={section == 'game'} />} */}

      <section
        className={classnames([
          'page',

          'results',
          { show: section == 'results' },
        ])}
      >
        <h3>{t('filling.results.preheading')}</h3>
        <h1>{t('filling.results.heading')}</h1>
        <Trans
          i18nKey="filling.results.desc"
          values={{
            duration,
            count,
          }}
        ></Trans>
        <div className="buttons">
          <button onClick={replay}>{t('filling.results.replay')}</button>
          <button onClick={() => setPage('filling-video')}>
            {t('filling.results.next')}
          </button>
        </div>
      </section>
    </div>
  );
};
