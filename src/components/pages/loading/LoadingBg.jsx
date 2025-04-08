import gsap from 'gsap';
import './LoadingBg.sass';

export const LoadingBg = () => {
  const { progress, completed } = useAssetProgress();

  const refRoot = useRef(null);
  const refFill = useRef(null);
  const [enableMask, setEnableMask] = useState(false);

  useEffect(() => {
    if (!completed) return;
    setEnableMask(true);
    let tl = gsap.timeline({
      onComplete: () => {
        refRoot.current.style.display = 'none';
      },
    });
    tl.add('start');
    tl.to(
      [
        refRoot.current.querySelector('.fill'),
        refRoot.current.querySelector('.stroke'),
      ],
      {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
      },
      'start'
    );

    let mask = refRoot.current.querySelector('.bottleMaskInvert');
    tl.to(
      mask,
      {
        scale: 20,
        rotation: '30deg',
        transformOrigin: 'center',
        ease: 'back.in(0.3)',
        duration: 1.2,
      },
      'start+=0.1'
    );
  }, [completed]);

  const refFillY = useRef(null);
  const tween = useRef(null);
  useEffect(() => {
    if (tween.current) tween.current.kill();
    tween.current = gsap.to(refFillY.current, {
      y: `${139 * (1 - progress)}px)`,
      duration: 0.3,
      ease: 'none',
    });
  }, [progress]);

  return (
    <svg
      ref={refRoot}
      className="loading-bg"
      viewBox="0 0 390 844"
      preserveAspectRatio="xMinYMin slice"
    >
      <rect
        className="color"
        x="0"
        y="0"
        width="390"
        height="844"
        fill="#97D1A7"
        mask={enableMask ? 'url(#bottleMaskInvert)' : null}
      />

      <path
        className="stroke"
        d="m216 480.848c0 4.592-1.474 7.061-2.21 8.606-2.131.512-5.691 1.535-18.194 1.546 0 0-.068 0-.102 0s-.068 0-.102 0c-12.491-.011-16.051-1.034-18.182-1.546-.736-1.545-2.21-4.014-2.21-8.606 0-3.969 3.548-15.222 3.548-19.636s-2.879-21.393-2.879-34.636 2.879-28.465 4.647-34.636c1.769-6.182 7.312-15.667 7.312-26.697v-3.525c-.442 0-1.281-.311-1.111-1.545.226-1.546 1.995-3.748 1.768-4.637-.227-.879-1.111-.667-1.111-1.546 0-.878.884-1.99 1.553-1.99h13.535c.668 0 1.552 1.101 1.552 1.99 0 .89-.884.656-1.11 1.546-.227.878 1.553 3.091 1.768 4.637.181 1.234-.669 1.545-1.111 1.545v3.525c0 11.03 5.543 20.515 7.311 26.697 1.769 6.182 4.648 21.404 4.648 34.636s-2.879 30.222-2.879 34.636 3.548 15.667 3.548 19.636z"
        stroke="#fff"
        fill="none"
      />

      <g mask="url(#bottleMask)">
        <g
          ref={refFillY}
          style={{ transform: `translateY(${139 * (1 - 0)}px)` }}
          className="fill-transform"
        >
          <path
            className="fill slide-right"
            ref={refFill}
            d="M175.12,494.4h-41.12v-144.75c10.28,0,10.28-10.19,20.56-10.14,10.28.05,10.28,10.19,20.56,10.19l-.24-.05c10.28.05,10.28-10.14,20.56-10.14s10.28,10.19,20.56,10.19v144.7h-41.12"
            fill="white"
          />
        </g>
      </g>

      <mask id="bottleMask">
        <path
          className="bottleMask"
          d="m216 480.848c0 4.592-1.474 7.061-2.21 8.606-2.131.512-5.691 1.535-18.194 1.546 0 0-.068 0-.102 0s-.068 0-.102 0c-12.491-.011-16.051-1.034-18.182-1.546-.736-1.545-2.21-4.014-2.21-8.606 0-3.969 3.548-15.222 3.548-19.636s-2.879-21.393-2.879-34.636 2.879-28.465 4.647-34.636c1.769-6.182 7.312-15.667 7.312-26.697v-3.525c-.442 0-1.281-.311-1.111-1.545.226-1.546 1.995-3.748 1.768-4.637-.227-.879-1.111-.667-1.111-1.546 0-.878.884-1.99 1.553-1.99h13.535c.668 0 1.552 1.101 1.552 1.99 0 .89-.884.656-1.11 1.546-.227.878 1.553 3.091 1.768 4.637.181 1.234-.669 1.545-1.111 1.545v3.525c0 11.03 5.543 20.515 7.311 26.697 1.769 6.182 4.648 21.404 4.648 34.636s-2.879 30.222-2.879 34.636 3.548 15.667 3.548 19.636z"
          fill="white"
        />
      </mask>

      <mask id="bottleMaskInvert">
        <rect
          x="0"
          y="0"
          width="390"
          height="844"
          fill="white"
        />
        <path
          className="bottleMaskInvert"
          d="m216 480.848c0 4.592-1.474 7.061-2.21 8.606-2.131.512-5.691 1.535-18.194 1.546 0 0-.068 0-.102 0s-.068 0-.102 0c-12.491-.011-16.051-1.034-18.182-1.546-.736-1.545-2.21-4.014-2.21-8.606 0-3.969 3.548-15.222 3.548-19.636s-2.879-21.393-2.879-34.636 2.879-28.465 4.647-34.636c1.769-6.182 7.312-15.667 7.312-26.697v-3.525c-.442 0-1.281-.311-1.111-1.545.226-1.546 1.995-3.748 1.768-4.637-.227-.879-1.111-.667-1.111-1.546 0-.878.884-1.99 1.553-1.99h13.535c.668 0 1.552 1.101 1.552 1.99 0 .89-.884.656-1.11 1.546-.227.878 1.553 3.091 1.768 4.637.181 1.234-.669 1.545-1.111 1.545v3.525c0 11.03 5.543 20.515 7.311 26.697 1.769 6.182 4.648 21.404 4.648 34.636s-2.879 30.222-2.879 34.636 3.548 15.667 3.548 19.636z"
          fill="black"
        />
      </mask>
    </svg>
  );
};
