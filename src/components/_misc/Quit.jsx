import './Quit.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';

export const Quit = () => {
  const { t } = useTranslation();

  const showQuit = useAppStore((state) => state.showQuit);
  const setShowQuit = useAppStore((state) => state.setShowQuit);

  const onQuit = () => {
    // TODO
  };

  return (
    <div className={classnames('quit', { show: showQuit })}>
      <motion.div
        className="bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: showQuit ? 1 : 0 }}
      >
        <img src="/assets/images-next/noise-overlay.webp" />
      </motion.div>

      <div className="content">
        <Heading1
          show={showQuit}
          delay={0}
        >
          {t('general.quit')}
        </Heading1>
        <div className="buttons">
          <ButtonPrimary
            show={showQuit}
            onClick={onQuit}
            delay={0.15}
          >
            {t('general.yes')}
          </ButtonPrimary>
          <ButtonPrimary
            show={showQuit}
            onClick={() => setShowQuit(false)}
            delay={0.15}
          >
            {t('general.no')}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};
