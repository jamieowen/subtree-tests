import './Landing.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Landing = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  return (
    <div
      className={classnames(['page', 'Landing', { show }])}
      onClick={() => setPage('cleaning-video')}
    >
      <h1>{t('landing.heading')}</h1>
      <p>{t('landing.desc')}</p>
      <button>{t('landing.cta')}</button>
    </div>
  );
};
