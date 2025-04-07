import './Paragraph1.sass';
import classnames from 'classnames';
import { gsap } from 'gsap';
import SplitText from '@activetheory/split-text';

export const Paragraph1 = ({
  show = false,
  delay = 0,
  className,
  children,
}) => {
  const refRoot = useRef(null);

  const { contextSafe } = useGSAP({ scope: refRoot });

  const [split, setSplit] = useState(null);
  useEffect(() => {
    let s = new SplitText(refRoot.current, {
      type: 'lines',
      noBalance: true,
    });
    s.lines.forEach((item) => {
      item.style.opacity = 0;
    });
    setSplit(s);
    return () => {
      s.revert();
    };
  }, []);

  const animateIn = contextSafe(() => {
    // console.log('Paragraph1.animateIn', split);
    let tl = gsap.timeline();
    tl.add('reset');
    tl.set(
      refRoot.current,
      {
        opacity: 1,
      },
      'reset'
    );
    tl.set(
      split.lines,
      {
        opacity: 0,
        y: 20,
      },
      'reset'
    );
    tl.add('start', `reset+=${delay}`);
    tl.to(
      split.lines,
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
        ease: 'back.out(3)',
      },
      'start'
    );
  });

  const animateOut = contextSafe(() => {
    // console.log('Paragraph1.animateOut', split);
    gsap.to(refRoot.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  useEffect(() => {
    // console.log('Paragraph1.show', show);
    if (!split) return;
    if (show) {
      animateIn();
    } else {
      animateOut();
    }
  }, [split, show]);

  return (
    <p
      ref={refRoot}
      className={classnames(['paragraph1', className])}
    >
      {children}
    </p>
  );
};
