import './Ending.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

// import IconBottlePattern from '@/assets/bg-pattern.svg?react';

export const Ending = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const [section, setSection] = useState('video');
  const nextSection = () => setSection('intro');

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
        src="/assets/images/ending-glow.png"
      />

      <VideoPlayer
        src="/assets/videos/ending.mp4"
        show={section == 'video'}
        onEnd={nextSection}
      />

      <motion.div
        className="wrap"
        animate={{ opacity: section == 'intro' ? 1 : 0 }}
      >
        <div className="preheading">{t('ending.preheading')}</div>
        <h1>{t('ending.heading')}</h1>
        <button className="btn-secondary">{t('ending.restart')}</button>
      </motion.div>
      <ButtonPrimary>{t('ending.cta')}</ButtonPrimary>
    </div>
  );
};
