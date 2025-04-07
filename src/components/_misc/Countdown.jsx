import './Countdown.sass';
import classnames from 'classnames';

export const Countdown = ({
  id,
  duration = 3,
  show = false,
  onEnded = () => {},
}) => {
  const { t } = useTranslation();

  const [time, setTime] = useState(duration);

  useEffect(() => {
    if (!show) return;
    setTime(duration);
    let interval = setInterval(() => {
      setTime((time) => {
        if (time === 1) {
          clearInterval(interval);
          onEnded();
          return 1;
        } else return time - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [show]);

  return (
    <div className={classnames('page', 'page-opacity', 'countdown', { show })}>
      <div className="page__top">
        <div className="preheading type-body1">{t(`${id}.game.ready`)}</div>
      </div>

      <div className="page__center">
        <div className="countdown__number type-countdown">{time}</div>
      </div>

      <div className="page__bottom" />
    </div>
  );
};
