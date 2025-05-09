import './Countdown.sass';
import classnames from 'classnames';
import AssetService from '@/services/AssetService';
import { gsap } from 'gsap';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';
export const Countdown = ({
  id,
  duration = 3,
  show = false,
  onEnded = () => {},
}) => {
  const { t } = useTranslation();

  const [time, setTime] = useState(duration);

  const refRoot = useRef(null);
  const refNum = useRef(null);

  useEffect(() => {
    if (!show) return;

    let interval;
    (async () => {
      await PromiseTimeout(600);
      setTime(duration);
      animateNum();
      AssetService.getAsset('sfx_countdown').play();

      interval = setInterval(() => {
        setTime((time) => {
          if (time === 1) {
            AssetService.getAsset('sfx_start').play();
            clearInterval(interval);
            onEnded();
            return 1;
          } else {
            AssetService.getAsset('sfx_countdown').play();
            animateNum();
            return time - 1;
          }
        });
      }, 1000);
    })();

    return () => clearInterval(interval);
  }, [show]);

  const { contextSafe } = useGSAP({ scope: refRoot });

  let tween = useRef(null);
  const animateNum = contextSafe(() => {
    if (tween.current) tween.current.kill();
    let tl = gsap.timeline();
    tween.current = tl;

    tl.add('reset');
    tl.set(refNum.current, { opacity: 1, scale: 1.1 });
    tl.set('.countdown__inner', { scale: 1.2 });

    tl.add('start', 'reset');

    tl.to(refNum.current, { scale: 0.9, ease: 'none', duration: 1 }, 'start');

    tl.add('inner', 'start');
    tl.to(
      '.countdown__inner',
      { scale: 1, ease: 'power3.out', duration: 0.8 },
      'inner'
    );
    tl.to(
      '.countdown__inner',
      {
        scale: 0.8,
        ease: 'power2.out',
        duration: 0.2,
      },
      'inner+=0.8'
    );
    tl.to(refNum.current, { opacity: 0, duration: 0.1 }, 'start+=0.9');
  });

  return (
    <div
      className={classnames('page', 'countdown', { show })}
      ref={refRoot}
    >
      <div className="page__top">
        <motion.div
          className="preheading type-body1"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          transition={{ duration: 0.2, delay: show ? 0.3 : 0 }}
        >
          {t(`${id}.game.ready`)}
        </motion.div>
      </div>

      <div className="page__center" />
      <div className="page__bottom" />

      <div className="page countdown__wrap">
        <div
          className="countdown__number type-countdown"
          ref={refNum}
        >
          <div className="countdown__inner">{time}</div>
        </div>
      </div>
    </div>
  );
};
