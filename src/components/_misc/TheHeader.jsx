import './TheHeader.sass';
import IconAudio from '@/assets/audio.svg?react';
import IconClose from '@/assets/close.svg?react';
import IconCocaCola from '@/assets/cocacola.svg?react';
import { useAppStore } from '@/stores/app';

export const TheHeader = () => {
  const { t } = useTranslation();
  const page = useAppStore((state) => state.page);

  const showLogo = page == 'landing' || page == 'results';
  const isVideo = page.includes('video');

  return (
    <div className="the-header">
      <button>
        <IconAudio />
      </button>
      <div className="center">
        {showLogo && <IconCocaCola className="logo" />}
        {!showLogo && !isVideo && (
          <span className="type-caption">{t(`${page}.name`)}</span>
        )}
      </div>
      <button>
        <IconClose />
      </button>
    </div>
  );
};
