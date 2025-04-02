import './ButtonPrimary.sass';
import IconButtonRed from '@/assets/btn-red.svg?react';

export const ButtonPrimary = ({
  children,
  color = 'red',
  auto = 0,
  ...props
}) => {
  const { t } = useTranslation();
  const refProgress = useRef(null);

  useEffect(() => {
    if (auto > 0) {
      let tween = gsap.fromTo(
        refProgress.current,
        { scaleX: 0 },
        {
          duration: auto,
          ease: 'none',
          scaleX: 1,
          onComplete: () => {
            props.onClick?.();
          },
        }
      );

      return () => {
        tween.kill();
      };
    }
  }, [auto]);

  return (
    <motion.button
      className={`button-primary ${color}`}
      {...props}
      whileTap={{ scale: 0.95 }}
      data-auto={auto}
    >
      <div
        className="progress"
        ref={refProgress}
      />
      <span className="label">{children}</span>
    </motion.button>
  );
};
