import './TheHeader.sass';
import IconAudio from '@/assets/audio.svg?react';
import IconClose from '@/assets/close.svg?react';
import IconCocaCola from '@/assets/cocacola.svg?react';
import { useAppStore } from '@/stores/app';

export const TheHeader = () => {
  const { t } = useTranslation();
  const page = useAppStore((state) => state.page);

  const showLogo = page == '' || page == 'ending';
  const isVideo = page.includes('video');

  return (
    <div className="the-header">
      <button>
        <IconAudio />
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

        <AnimatePresence>
          {!showLogo && !isVideo && (
            <span
              className="type-caption"
              key={page}
              exit={{ opacity: 0 }}
            >
              {t(`${page}.name`)}
            </span>
          )}
        </AnimatePresence>
      </div>
      <button>
        <IconClose />
      </button>
    </div>
  );
};
