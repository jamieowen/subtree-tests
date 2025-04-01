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
    <div className={classnames('countdown', { show })}>
      <div className="preheading type-body1">{t(`${id}.game.ready`)}</div>

      <div className="countdown-number type-countdown">{time}</div>
    </div>
  );
};
