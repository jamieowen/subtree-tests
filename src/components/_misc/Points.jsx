import './Points.sass';
import classnames from 'classnames';

export const Points = ({ id, points, show = false }) => {
  const { t } = useTranslation();

  return (
    <div className={classnames('points', { show })}>
      <div className="type-caption">{t(`${id}.game.points`)}</div>
      <div className="type-score">{points}</div>
    </div>
  );
};
