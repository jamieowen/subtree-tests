import './ButtonPrimary.sass';
import IconButtonRed from '@/assets/btn-red.svg?react';
import classnames from 'classnames';
import { gsap } from 'gsap';
import AssetService from '@/services/AssetService';

export const ButtonPrimary = ({
  className,
  children,
  color = 'red',
  auto = 0,
  show = false,
  delay = 0,
  disabled = false,
  onClick = () => {},
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
            _onClick?.();
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
    // console.log('ButtonPrimary.animateIn');
    let tl = gsap.timeline();

    tl.add('reset');
    tl.set(refRoot.current, { opacity: 1 }, 'reset');
    tl.set('.border', { opacity: 0 }), 'reset';
    tl.set('.button-primary-wrap', { opacity: 0, scale: 0.5 }), 'reset';
    tl.set('.label', { opacity: 0, y: 50 }), 'reset';

    tl.add('start', `reset+=${delay}`);
    tl.to(
      '.border',
      // { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.in',
      },
      'start'
    );
    tl.to(
      '.button-primary-wrap',
      // { opacity: 0, scale: 0.7 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.7,
        ease: 'back.out(2)',
      },
      'start'
    );

    tl.to(
      '.label',
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'back.out(2)',
      },
      'start+=0.2'
    );
  });

  const animateOut = contextSafe(() => {
    // console.log('ButtonPrimary.animateOut');
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

  const _onClick = () => {
    const sfx_buttonclick = AssetService.getAsset('sfx_buttonclick');
    sfx_buttonclick.play();
    onClick?.();
  };

  const [holding, setHolding] = useState(false);
  const onPointerDown = () => {
    setHolding(true);
  };
  const onPointerUp = () => {
    setHolding(false);
  };

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
        onClick={_onClick}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          className="progress"
          ref={refProgress}
        />
        <div className={classnames('holding-circle', { holding })} />
        <span className="label">{children}</span>
      </motion.button>
    </div>
  );
};
