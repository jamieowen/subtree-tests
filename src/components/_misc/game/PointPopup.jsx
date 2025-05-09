import './PointPopup.sass';
import { randomSign } from '@/helpers/MathUtils';
import { gsap } from 'gsap';
import AssetService from '@/services/AssetService';

export const PointPopup = ({ count, point = 10 }) => {
  const refRoot = useRef(null);

  useEffect(() => {
    if (count == 0) return;

    let tl = gsap.timeline();
    tl.add('start');

    AssetService.getAsset('sfx_pointget').play();

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

    return () => {
      if (tl) tl.kill();
    };
  }, [count]);

  return (
    <div className="point-popup">
      <div
        className="wrap"
        ref={refRoot}
      >
        <span>+1</span>
      </div>
    </div>
  );
};
