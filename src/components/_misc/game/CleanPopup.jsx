import './CleanPopup.sass';
import { randomSign } from '@/helpers/MathUtils';
import { gsap } from 'gsap';
import AssetService from '@/services/AssetService';

export const CleanPopup = ({ count, point = 10 }) => {
  const refRoot = useRef(null);
  const { t } = useTranslation();

  const _tl = useRef(null);

  const animate = () => {
    if (_tl.current) _tl.current.kill();
    let tl = gsap.timeline();
    _tl.current = tl;

    tl.add('start');

    // AssetService.getAsset('sfx_pointget').play();

    const direction = randomSign();

    tl.set(refRoot.current, { opacity: 1 }, 'start');
    tl.fromTo(
      refRoot.current,
      { y: 0, x: 0, rotation: 0 },
      {
        y: -100,
        x: direction * 50,
        rotation: `${direction * 15}deg`,
        duration: 1,
        ease: 'power2.out',
      },
      'start'
    );
    tl.fromTo(
      refRoot.current,
      { opacity: 1 },
      { opacity: 0, duration: 0.2, ease: 'power2.out' },
      'start+=0.8'
    );
    tl.timeScale(1.5);
  };

  const emitter = useMitt();
  useEffect(() => {
    emitter.on('cleaning-cleaned', animate);
  }, []);

  return (
    <div className="clean-popup">
      <div
        className="wrap"
        ref={refRoot}
      >
        <span>{t('cleaning.game.cleaned')}</span>
      </div>
    </div>
  );
};
