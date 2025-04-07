import './Countdown.sass';
import classnames from 'classnames';
import AssetService from '@/services/AssetService';

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
    AssetService.getAsset('sfx_countdown').play();

    let interval = setInterval(() => {
      setTime((time) => {
        if (time === 1) {
          AssetService.getAsset('sfx_start').play();
          clearInterval(interval);
          onEnded();
          return 1;
        } else {
          AssetService.getAsset('sfx_countdown').play();
          return time - 1;
        }
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
