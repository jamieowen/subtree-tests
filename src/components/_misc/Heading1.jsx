import './Heading1.sass';
import classnames from 'classnames';
import { gsap } from 'gsap';
import SplitText from '@activetheory/split-text';

export const Heading1 = ({ className, children }) => {
  const refRoot = useRef(null);

  const { contextSafe } = useGSAP({ scope: refRoot });

  // useEffect(() => {
  //   let split = new SplitText(refRoot.current, {
  //     type: 'lines',
  //     lineThreshold: 1,
  //   });
  //   return () => {
  //     split.revert();
  //   };
  // }, []);

  return (
    <h1
      ref={refRoot}
      className={classnames(['heading1', className])}
    >
      {children}
    </h1>
  );
};
