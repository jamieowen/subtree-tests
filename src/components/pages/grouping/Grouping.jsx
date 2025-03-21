import './Grouping.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Grouping = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);
  return (
    <div className={classnames(['page', 'Grouping', { show }])}>
      <h1>Grouping</h1>
    </div>
  );
};
