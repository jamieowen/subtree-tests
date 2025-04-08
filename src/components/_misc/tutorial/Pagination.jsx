import './Pagination.sass';
import gsap from 'gsap';

export const Pagination = ({ show, steps, step, setStep, stepTime = 4 }) => {
  const refRoot = useRef(null);
  const { contextSafe } = useGSAP({ scope: refRoot });

  useEffect(() => {
    if (!show) return;
    let tween = gsap.fromTo(
      '.active .pagination__fill',
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: stepTime,
        ease: 'none',
        onComplete: () => {
          if (step < steps - 1) {
            setStep(step + 1);
          }
        },
      }
    );

    return () => {
      tween.kill();
    };
  }, [show, step]);

  return (
    <div
      className="pagination"
      ref={refRoot}
    >
      {Array.from({ length: steps }).map((_, idx) => (
        <div
          key={idx}
          className={`pagination__step ${step == idx ? 'active' : ''} ${step > idx ? 'filled' : ''}`}
          onClick={() => setStep(idx)}
        >
          <div className="pagination__fill" />
        </div>
      ))}
    </div>
  );
};
