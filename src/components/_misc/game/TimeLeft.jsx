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
      <Heading1
        className="type-score-label"
        show={show}
      >
        {t(`${id}.game.time`)}
      </Heading1>
      <motion.div
        className="type-score-value"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
      >
        00:{time.toString().padStart(2, '0')}
      </motion.div>
    </div>
  );
};
