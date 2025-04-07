import './Heading1.sass';
import classnames from 'classnames';
import { gsap } from 'gsap';
import SplitText from '@activetheory/split-text';

export const Heading1 = ({ show = false, delay = 0, className, children }) => {
  const refRoot = useRef(null);

  const { contextSafe } = useGSAP({ scope: refRoot });

  const [split, setSplit] = useState(null);
  useEffect(() => {
    let s = new SplitText(refRoot.current, {
      type: 'lines,words,chars',
      noBalance: true,
    });
    s.chars.forEach((item) => {
      item.style.opacity = 0;
    });
    setSplit(s);
    return () => {
      s.revert();
    };
  }, []);

  const animateIn = contextSafe(() => {
    // console.log('Heading1.animateIn', split.chars);
    let tl = gsap.timeline();

    tl.add('reset');
    tl.set(
      refRoot.current,
      {
        opacity: 1,
        blur: '0px',
      },
      'reset'
    );
    tl.set(
      split.chars,
      {
        opacity: 0,
        y: 20,
      },
      'reset'
    );

    tl.add('start', `reset+=${delay}`);
    tl.to(
      split.chars,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        stagger: 0.05,
        ease: 'back.out(3)',
      },
      'start'
    );
  });

  const animateOut = contextSafe(() => {
    // console.log('Heading1.animateOut', split);
    gsap.to(refRoot.current, {
      opacity: 0,
      blur: '5px',
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  useEffect(() => {
    // console.log('Heading1.show', show);
    if (!split) return;
    if (show) {
      animateIn();
    } else {
      animateOut();
    }
  }, [split, show]);

  return (
    <h1
      ref={refRoot}
      className={classnames(['heading1', className])}
    >
      {children}
    </h1>
  );
};
