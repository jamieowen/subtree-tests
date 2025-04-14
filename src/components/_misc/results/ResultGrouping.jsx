import { urls } from '@/config/assets';
import gsap from 'gsap';
import { randomInRange } from '@/helpers/MathUtils';
import classnames from 'classnames';

export const ResultGrouping = ({ show }) => {
  const count = useGroupingStore((state) => state.count);
  // const count = 10;
  const numBoxes = Math.ceil(count / 20);

  console.log('ResultGrouping.numBoxes', numBoxes);

  const refRoot = useRef(null);
  const tween = useRef(null);

  const animateIn = () => {
    if (!show) return;

    const imgs = [...refRoot.current.querySelectorAll('.result-grouping-item')];
    if (!imgs.length) return;

    if (tween.current) tween.current.kill();

    tween.current = gsap.fromTo(
      imgs,
      { y: '-100lvh' },
      {
        y: '0',
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      }
    );
  };

  useEffect(() => {
    if (show) {
      animateIn();
    }
  }, [show, numBoxes]);

  const aspect = 413 / 260;

  return (
    <div
      className="result-grouping full"
      ref={refRoot}
    >
      {Array.from({ length: numBoxes }).map((_, i) => (
        <img
          src={urls[`i_grouping_result`]}
          key={i}
          className={classnames(
            'result-grouping-item absolute left-0 w-1/3 origin-center',
            '[&:nth-child(3n+1)]:left-0',
            '[&:nth-child(3n+2)]:left-1/3',
            '[&:nth-child(3n+3)]:left-2/3'
          )}
          style={{
            bottom: `calc(${(Math.floor(i / 3) * 33.333333) / aspect}lvw)`,
          }}
        />
      ))}
    </div>
  );
};
