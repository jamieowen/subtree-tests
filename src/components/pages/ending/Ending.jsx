import './Ending.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Ending = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);
  return (
    <div className={classnames(['page', 'ending', { show }])}>
      <div className="wrap">
        <div className="preheading">{t('ending.preheading')}</div>
        <h1>{t('ending.heading')}</h1>
        <button className="btn-secondary">{t('ending.restart')}</button>
      </div>
      <ButtonPrimary>{t('ending.cta')}</ButtonPrimary>
    </div>
  );
};
