import './ButtonPrimary.sass';
import IconButtonRed from '@/assets/btn-red.svg?react';
import classnames from 'classnames';
import { gsap } from 'gsap';

export const ButtonPrimary = ({
  className,
  children,
  color = 'red',
  auto = 0,
  show = true,
  disabled = false,
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
      className={classnames([
        'button-primary',
        `color-${color}`,
        className,
        { show, disabled },
      ])}
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
