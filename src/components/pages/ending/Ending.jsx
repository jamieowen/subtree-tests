import './Ending.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';
import IconPattern from '@/assets/bottle-pattern.svg?react';
import { urls } from '@/config/assets';

// import IconBottlePattern from '@/assets/bg-pattern.svg?react';

export const Ending = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const [section, setSection] = useState('video');
  const nextSection = () => setSection('intro');

  const showVideo = show && section == 'video';
  const showIntro = show && section == 'intro';

  const onRestart = () => {
    // setPage('');
    window.location.reload();
  };

  const onShare = () => {
    navigator.share({
      title: 'Coke ESG Reborn',
      text: 'Coke ESG Reborn',
      url: window.location.href,
    });
  };

  return (
    <div className={classnames(['page', 'page-opacity', 'ending', { show }])}>
      <div className="bg">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="contents"
          >
            {/* <img src="/assets/images/bottle-pattern-red.svg" /> */}
            {/* <img src="/assets/images/bottle-pattern-green.svg" /> */}
            <IconPattern className="red" />
            <IconPattern className="green" />
          </div>
        ))}
      </div>

      {/* <img
        className="glow"
        src="/assets/images-next/ending-glow.webp"
      /> */}

      <AnimatePresence>
        {showVideo && (
          <VideoPlayer
            key="ending-video"
            src="/assets/videos/ending.mp4"
            poster={urls.i_ending}
            onEnd={() => {
              nextSection();
            }}
            exit={{ opacity: 0 }}
            showSkip={section == 'video'}
          />
        )}
      </AnimatePresence>

      <div
        className={classnames(['page', 'page-opacity', { show: showIntro }])}
      >
        <div className="page__top" />

        <div className="page__center">
          <motion.div
            className="preheading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showIntro ? 1 : 0, scale: showIntro ? 1 : 0.8 }}
            transition={{
              duration: showIntro ? 0.6 : 0.2,
            }}
          >
            {t('ending.preheading')}
          </motion.div>
          <Heading1 show={showIntro}>{t('ending.heading')}</Heading1>
          <motion.button
            className="btn-secondary"
            onClick={onRestart}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showIntro ? 1 : 0, scale: showIntro ? 1 : 0.8 }}
            transition={{
              duration: showIntro ? 0.6 : 0.2,
              delay: showIntro ? 1.5 : 0,
            }}
          >
            {t('ending.restart')}
          </motion.button>
        </div>

        <div className="page__bottom">
          <ButtonPrimary
            show={showIntro}
            delay={2}
            color="white"
            onClick={onShare}
          >
            {t('ending.cta')}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};
