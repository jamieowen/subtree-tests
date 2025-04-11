import './Ending.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

import { urls } from '@/config/assets';

// import IconBottlePattern from '@/assets/bg-pattern.svg?react';

export const Ending = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const [section, setSection] = useState('video');
  const nextSection = () => setSection('intro');

  const showVideo = show && section == 'video';
  const showIntro = show && section == 'intro';

  const emitter = useMitt();
  const onRestart = () => {
    emitter.emit('reset');
    setPage('');
    // window.location.reload();
  };

  const onShare = () => {
    navigator.share({
      title: 'Coke ESG Reborn',
      text: 'Coke ESG Reborn',
      url: window.location.href,
    });
  };

  const onLearnMore = () => {};

  return (
    <div className={classnames(['page', 'page-opacity', 'ending', { show }])}>
      {/* <img
        className="glow"
        src="/assets/images-next/ending-glow.webp"
      /> */}

      <VideoPlayer
        key="ending-video"
        src={urls.v_ending}
        poster={urls.i_ending}
        onEnd={() => {
          nextSection();
        }}
        showSkip={section == 'video'}
      />

      <BottleBg show={showIntro} />

      <div
        className={classnames([
          'page relative',
          'page-opacity',
          { show: showIntro },
        ])}
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
              delay: showIntro ? 0.6 : 0,
            }}
          >
            {t('ending.restart')}
            <div className="line" />
          </motion.button>
        </div>

        <div className="page__bottom">
          <ButtonPrimary
            show={showIntro}
            delay={0.9}
            color="white"
            onClick={onLearnMore}
          >
            {t('ending.cta')}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};
