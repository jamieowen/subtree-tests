import { urls } from '@/config/assets';
import gsap from 'gsap';
import { randomInRange } from '@/helpers/MathUtils';

export const ResultCleaning = ({ show }) => {
  // const count = useCleaningStore((state) => state.count);
  const count = 10;

  const refRoot = useRef(null);
  const tween = useRef(null);

  const animateIn = () => {
    if (!show) return;

    const imgs = [...refRoot.current.querySelectorAll('.result-cleaning-item')];
    if (!imgs.length) return;

    const box = imgs[0].getBoundingClientRect();
    const width = box.width;
    const height = box.height;
    // console.log('ResultCleaning.animateIn', imgs, width, height);

    if (tween.current) tween.current.kill();

    const yOffset = 1;

    gsap.set(imgs, {
      x: `random(${width * 1}, ${window.innerWidth - width * 1}, 1)`,
      y: () => height * -yOffset,
      rotation: `random(-90, 90, 1)`,
    });

    tween.current = gsap.to(imgs, {
      y: () => window.innerHeight - height * (1 - yOffset),
      rotation: `random(-90, 90, 1)`,
      duration: 2,
      stagger: 0.6,
      ease: 'none',
    });
  };

  useEffect(() => {
    if (show) {
      animateIn();
    }
  }, [show, count]);

  const aspect = 1 / 4;

  return (
    <div
      className="result-cleaning full"
      ref={refRoot}
    >
      {Array.from({ length: count }).map((_, i) => (
        <img
          src={urls.i_cleaning_result}
          key={i}
          className="result-cleaning-item absolute top-0 left-0 w-[8rem] origin-center"
          style={{
            aspectRatio: aspect,
          }}
        />
      ))}
    </div>
  );
};
