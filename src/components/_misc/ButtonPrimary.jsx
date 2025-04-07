import './ButtonPrimary.sass';
import IconButtonRed from '@/assets/btn-red.svg?react';
import classnames from 'classnames';
import { gsap } from 'gsap';

export const ButtonPrimary = ({
  className,
  children,
  color = 'red',
  auto = 0,
  show = false,
  delay = 0,
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

  const refRoot = useRef(null);
  const { contextSafe } = useGSAP({ scope: refRoot });

  const animateIn = contextSafe(() => {
    console.log('ButtonPrimary.animateIn');
    let tl = gsap.timeline({ delay });
    tl.add('start');
    tl.set(refRoot.current, {
      opacity: 1,
    });
    tl.fromTo(
      '.border',
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.in',
      },
      'start'
    );
    tl.fromTo(
      '.button-primary-wrap',
      { opacity: 0, scale: 0.7 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'back.out',
      },
      'start'
    );
  });

  const animateOut = contextSafe(() => {
    console.log('ButtonPrimary.animateOut');
    let tl = gsap.timeline();
    tl.to(refRoot.current, {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.out',
    });
  });

  useEffect(() => {
    if (show) {
      animateIn();
    } else {
      animateOut();
    }
  }, [show]);

  return (
    <div
      ref={refRoot}
      className={classnames([
        'button-primary',
        `color-${color}`,
        className,
        { show, disabled },
      ])}
      {...props}
      data-auto={auto}
    >
      <div className="border" />
      <motion.button
        className="wrap button-primary-wrap"
        whileTap={{ scale: 0.95 }}
      >
        <div
          className="progress"
          ref={refProgress}
        />
        <span className="label">{children}</span>
      </motion.button>
    </div>
  );
};
