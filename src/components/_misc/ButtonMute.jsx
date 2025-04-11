import IconSoundOn from '@/assets/sound-on.svg?react';
import IconSoundOff from '@/assets/sound-off.svg?react';
import { useAppStore } from '@/stores/app';

export const ButtonMute = () => {
  const muted = useAppStore((state) => state.muted);
  const toggleMuted = useAppStore((state) => state.toggleMuted);

  const refLine = useRef(null);
  useEffect(() => {
    const line = refLine.current;
    var length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;
  }, []);

  useEffect(() => {
    const line = refLine.current;
    const length = line.getTotalLength();
    line.style.strokeDashoffset = muted ? 0 : length;
  }, [muted]);

  return (
    <button
      className="btn-audio"
      onClick={() => toggleMuted()}
    >
      {/* {!muted && <IconSoundOn />}
      {muted && <IconSoundOff />} */}
      <svg
        viewBox="0 0 40 40"
        fill="none"
      >
        <path
          d="M17.83 26.5H14.94C14.54 26.5 14.2 26.36 13.92 26.08C13.64 25.8 13.5 25.46 13.5 25.06V20C13.5 19.1 13.67 18.25 14.01 17.46C14.35 16.67 14.82 15.99 15.4 15.4C15.98 14.81 16.67 14.36 17.46 14.01C18.25 13.67 19.09 13.5 20 13.5C20.91 13.5 21.75 13.67 22.54 14.01C23.33 14.35 24.01 14.82 24.6 15.4C25.18 15.98 25.65 16.67 25.99 17.46C26.33 18.25 26.5 19.09 26.5 20V25.06C26.5 25.46 26.36 25.8 26.08 26.08C25.8 26.36 25.46 26.5 25.06 26.5H22.17V20.72H25.06V20C25.06 18.59 24.57 17.4 23.59 16.42C22.61 15.44 21.41 14.95 20.01 14.95C18.61 14.95 17.41 15.44 16.43 16.42C15.45 17.4 14.96 18.6 14.96 20V20.72H17.85V26.5H17.83ZM16.39 22.17H14.95V25.06H16.39V22.17ZM23.61 22.17V25.06H25.05V22.17H23.61Z"
          fill="white"
        />
        <line
          ref={refLine}
          x1="13.7143"
          y1="13.8391"
          x2="26.7828"
          y2="26.9076"
          stroke="white"
          strokeWidth="2"
          style={{ transition: 'all 0.3s ease 0s' }}
        />
      </svg>
    </button>
  );
};
