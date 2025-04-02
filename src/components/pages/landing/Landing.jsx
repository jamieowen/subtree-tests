import './Landing.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Landing = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  return (
    <div
      className={classnames(['page', 'Landing', { show }])}
      onClick={() => setPage('cleaning')}
    >
      <video
        src="/assets/videos/intro.mp4"
        muted
        playsInline
        autoPlay
        loop
      />

      <div className="darken" />

      <div className="wrap">
        <h1>{t('landing.heading')}</h1>
        <p>{t('landing.desc')}</p>
        <ButtonPrimary>{t('landing.cta')}</ButtonPrimary>
      </div>
    </div>
  );
};
