import './Bottling.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Bottling = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);
  return (
    <div className={classnames(['page', 'Bottling', { show }])}>
      <h1>{t('landing.title')}</h1>
      <p>{t('landing.desc')}</p>
      <button>{t('landing.cta')}</button>
    </div>
  );
};
