import './Ending.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

// import IconBottlePattern from '@/assets/bg-pattern.svg?react';

export const Ending = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const [section, setSection] = useState('video');
  const nextSection = () => setSection('intro');

  const showVideo = show && section == 'video';

  const onRestart = () => {
    setPage('');
  };

  return (
    <div className={classnames(['page', 'ending', { show }])}>
      <div className="bg">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="contents"
          >
            <img src="/assets/images/bottle-pattern-red.svg" />
            <img src="/assets/images/bottle-pattern-green.svg" />
          </div>
        ))}
      </div>

      <img
        className="glow"
        src="/assets/images-next/ending-glow.webp"
      />

      <AnimatePresence>
        {showVideo && (
          <VideoPlayer
            key="ending-video"
            src="/assets/videos/ending.mp4"
            onEnd={() => {
              nextSection();
            }}
            exit={{ opacity: 0 }}
            showSkip={section == 'video'}
          />
        )}
      </AnimatePresence>

      <div className={classnames(['page', { show: section == 'intro' }])}>
        <div className="page__top" />

        <div className="page__center">
          <div className="preheading">{t('ending.preheading')}</div>
          <h1>{t('ending.heading')}</h1>
          <button
            className="btn-secondary"
            onClick={onRestart}
          >
            {t('ending.restart')}
          </button>
        </div>

        <div className="page__bottom">
          <ButtonPrimary
            show={section == 'intro'}
            color="white"
          >
            {t('ending.cta')}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};
