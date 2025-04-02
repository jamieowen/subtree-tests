import './TimeLeft.sass';
import classnames from 'classnames';
export const TimeLeft = ({
  id,
  duration = 20,
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
    <div className={classnames('time-left', { show })}>
      <div className="type-caption">{t(`${id}.game.time`)}</div>
      <div className="type-score">00:{time.toString().padStart(2, '0')}</div>
    </div>
  );
};
