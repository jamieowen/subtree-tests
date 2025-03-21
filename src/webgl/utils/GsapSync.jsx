import { create } from 'zustand';
import { gsap } from 'gsap';

export const delta = create(() => ({ d: 0 }));

export const GsapSync = function (callback) {
  const pg = useRef(0);

  useFrame(({ clock }, _d) => {
    pg.current += _d;
    delta.setState({ d: _d });

    gsap.updateRoot(pg.current);
  });

  useEffect(() => {
    gsap.ticker.remove(gsap.updateRoot);

    return () => {
      gsap.ticker.add(gsap.updateRoot);
    };
  }, []);
};

export default GsapSync;
