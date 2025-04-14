import { urls } from '@/config/assets';
import gsap from 'gsap';
import { randomInRange } from '@/helpers/MathUtils';

export const ResultFilling = ({ show }) => {
  const count = useFillingStore((state) => state.count);
  // const count = 10;

  const refRoot = useRef(null);
  const tween = useRef(null);

  const animateIn = () => {
    if (!show) return;

    const imgs = [...refRoot.current.querySelectorAll('.result-filling-item')];
    if (!imgs.length) return;

    const box = imgs[0].getBoundingClientRect();
    const width = box.width;
    const height = box.height;
    // console.log('ResultFilling.animateIn', imgs, width, height);

    if (tween.current) tween.current.kill();

    const yOffset = 2;
    const xOffset = 1;

    gsap.set(imgs, {
      x: `random(${width * xOffset}, ${window.innerWidth - width * xOffset}, 1)`,
      z: `random(-300, 300, 1)`,
      y: () => height * -yOffset,
      // rotation: `random(-90, 90, 1)`,
    });

    tween.current = gsap.to(imgs, {
      y: () => window.innerHeight - height * (1 - yOffset),
      // rotation: `random(-90, 90, 1)`,
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

  return (
    <div
      className="result-filling full perspective-1000"
      ref={refRoot}
    >
      {Array.from({ length: count }).map((_, i) => (
        <img
          src={urls[`i_filling_result${i % 5}`]}
          key={i}
          className="result-filling-item absolute top-0 left-0 w-[18rem] aspect-square origin-center"
        />
      ))}
    </div>
  );
};
