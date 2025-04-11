import './TheHeader.sass';
import IconSoundOn from '@/assets/sound-on.svg?react';
import IconSoundOff from '@/assets/sound-off.svg?react';
import IconClose from '@/assets/close.svg?react';
import IconCocaCola from '@/assets/cocacola.svg?react';
import { useAppStore } from '@/stores/app';

export const TheHeader = () => {
  const { t } = useTranslation();
  const page = useAppStore((state) => state.page);

  const showLogo = page == '' || page == 'ending';
  const isVideo = page.includes('video') || page == 'cleaning-intro';

  const showQuit = useAppStore((state) => state.showQuit);
  const setShowQuit = useAppStore((state) => state.setShowQuit);
  const muted = useAppStore((state) => state.muted);
  const toggleMuted = useAppStore((state) => state.toggleMuted);

  const showHeading = !showLogo && !isVideo;

  return (
    <div className="the-header">
      <button
        className="btn-audio"
        onClick={() => toggleMuted()}
      >
        {!muted && <IconSoundOn />}
        {muted && <IconSoundOff />}
      </button>

      <div className="center">
        <AnimatePresence>
          {showLogo && (
            <IconCocaCola
              className="logo"
              key="logo"
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* <AnimatePresence>
          {showHeading && (
            <Heading1
              className="type-caption"
              key={page}
              show={showHeading}
            >
              {t(`${page}.name`)}
            </Heading1>
          )}
        </AnimatePresence> */}

        <Heading1
          className="type-caption"
          show={page == 'cleaning'}
        >
          {t(`cleaning.name`)}
        </Heading1>

        <Heading1
          className="type-caption"
          show={page == 'filling'}
        >
          {t(`filling.name`)}
        </Heading1>

        <Heading1
          className="type-caption"
          show={page == 'grouping'}
        >
          {t(`grouping.name`)}
        </Heading1>
      </div>
      <button
        className="btn-quit"
        onClick={() => setShowQuit(true)}
      >
        <IconClose />
      </button>
    </div>
  );
};
