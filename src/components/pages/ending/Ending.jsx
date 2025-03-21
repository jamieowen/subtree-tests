import './Ending.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Ending = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);
  return (
    <div className={classnames(['page', 'Ending', { show }])}>
      <h1>Ending</h1>
    </div>
  );
};
