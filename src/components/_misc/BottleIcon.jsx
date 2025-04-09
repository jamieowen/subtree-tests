import gsap from 'gsap';
import './BottleIcon.sass';

export const BottleIcon = () => {
  const refRoot = useRef(null);
  const refFill = useRef(null);
  const refFillY = useRef(null);

  useGSAP(() => {
    let tl = gsap.timeline({ repeat: -1 });
    tl.add('start');

    tl.set(refFillY.current, { opacity: 1 });
    tl.fromTo(
      refFillY.current,
      { y: 140 },
      {
        y: 140 - 140 * 0.8,
        duration: 1,
        ease: 'power2.inOut',
      }
    );

    tl.to(refFillY.current, { opacity: 0, duration: 0.4, ease: 'power2.out' });
  });

  return (
    <svg
      ref={refRoot}
      className="bottle-icon"
      viewBox="0 0 42 140"
      preserveAspectRatio="xMinYMin slice"
    >
      <path
        className="stroke"
        d="M41.5,129.35c0,4.59-1.47,7.06-2.21,8.61-2.13.51-5.69,1.54-18.19,1.55h-.2c-12.49-.01-16.05-1.03-18.18-1.55-.74-1.55-2.21-4.01-2.21-8.61,0-3.97,3.55-15.22,3.55-19.64s-2.88-21.39-2.88-34.64,2.88-28.46,4.65-34.64c1.77-6.18,7.31-15.67,7.31-26.7v-3.52c-.44,0-1.28-.31-1.11-1.55.23-1.55,1.99-3.75,1.77-4.64-.23-.88-1.11-.67-1.11-1.55s.88-1.99,1.55-1.99h13.54c.67,0,1.55,1.1,1.55,1.99s-.88.66-1.11,1.55c-.23.88,1.55,3.09,1.77,4.64.18,1.23-.67,1.55-1.11,1.55v3.52c0,11.03,5.54,20.51,7.31,26.7,1.77,6.18,4.65,21.4,4.65,34.64s-2.88,30.22-2.88,34.64,3.55,15.67,3.55,19.64h.01Z"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
      />

      <g mask="url(#bottleMask)">
        <g
          ref={refFillY}
          className="fill-transform"
        >
          {/* <rect
            className="fill slide-right"
            ref={refFill}
            x="0"
            y="0"
            width="42"
            height="140"
            fill="white"
          /> */}
          <path
            className="fill slide-right"
            d="M.7,140.02h-41.12V9.65C-30.14,9.65-30.14.47-19.86.51-9.58.56-9.58,9.69.7,9.69l-.24-.05c10.28.05,10.28-9.13,20.56-9.13s10.28,9.18,20.56,9.18v130.33H.46"
            fill="white"
          />
        </g>
      </g>

      <mask id="bottleMask">
        <path
          className="bottleMask"
          d="M41.5,129.35c0,4.59-1.47,7.06-2.21,8.61-2.13.51-5.69,1.54-18.19,1.55h-.2c-12.49-.01-16.05-1.03-18.18-1.55-.74-1.55-2.21-4.01-2.21-8.61,0-3.97,3.55-15.22,3.55-19.64s-2.88-21.39-2.88-34.64,2.88-28.46,4.65-34.64c1.77-6.18,7.31-15.67,7.31-26.7v-3.52c-.44,0-1.28-.31-1.11-1.55.23-1.55,1.99-3.75,1.77-4.64-.23-.88-1.11-.67-1.11-1.55s.88-1.99,1.55-1.99h13.54c.67,0,1.55,1.1,1.55,1.99s-.88.66-1.11,1.55c-.23.88,1.55,3.09,1.77,4.64.18,1.23-.67,1.55-1.11,1.55v3.52c0,11.03,5.54,20.51,7.31,26.7,1.77,6.18,4.65,21.4,4.65,34.64s-2.88,30.22-2.88,34.64,3.55,15.67,3.55,19.64h.01Z"
          fill="white"
        />
      </mask>
    </svg>
  );
};
