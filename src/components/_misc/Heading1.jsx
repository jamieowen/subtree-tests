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
      type: 'words',
      noBalance: true,
    });
    s.words.forEach((word) => {
      word.style.opacity = 0;
    });
    setSplit(s);
    return () => {
      s.revert();
    };
  }, []);

  const animateIn = contextSafe(() => {
    console.log('Heading1.animateIn', split);
    gsap.set(refRoot.current, {
      opacity: 1,
      blur: '0px',
    });
    gsap.fromTo(
      split.words,
      {
        opacity: 0,
        scale: 2,
        blur: '5px',
      },
      {
        opacity: 1,
        scale: 1,
        blur: '0px',
        duration: 1,
        stagger: 0.2,
        ease: 'power2.inOut',
        delay,
      }
    );
  });

  const animateOut = contextSafe(() => {
    console.log('Heading1.animateOut', split);
    gsap.to(refRoot.current, {
      opacity: 0,
      blur: '5px',
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  useEffect(() => {
    console.log('Heading1.show', show);
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
