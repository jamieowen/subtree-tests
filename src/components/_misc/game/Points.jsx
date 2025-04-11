import './Points.sass';
import classnames from 'classnames';

export const Points = ({ id, points, show = false }) => {
  const { t } = useTranslation();

  return (
    <div className={classnames('points', { show })}>
      <Heading1
        className="type-score-label"
        show={show}
      >
        {t(`general.bottles`)}
      </Heading1>
      <motion.div
        className="type-score-value"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {points}
      </motion.div>
    </div>
  );
};
