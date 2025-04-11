import './VideoPlayer.sass';
import { useAppStore } from '@/stores/app';
import { useVisibilityChange } from '@uidotdev/usehooks';

export const VideoPlayer = forwardRef(
  ({ src, poster, autoPlay = true, onEnd, showSkip = true, ...props }, ref) => {
    const { t } = useTranslation();
    const muted = useAppStore((state) => state.muted);

    const refVideo = useRef(null);

    const [playing, setPlaying] = useState(false);
    const [played, setPlayed] = useState(false);
    const onPlay = () => {
      setPlaying(true);
      setPlayed(true);
    };
    const onPause = () => {
      setPlaying(false);
    };

    useEffect(() => {
      if (autoPlay) {
        play();
      }

      refVideo.current.addEventListener('play', onPlay);
      refVideo.current.addEventListener('pause', onPause);

      return () => {
        if (!refVideo.current) return;
        pause();
        refVideo.current.removeEventListener('play', onPlay);
        refVideo.current.removeEventListener('pause', onPause);
      };
    }, []);

    const onSkip = () => {
      pause();
      onEnd();
    };

    const play = () => {
      refVideo.current.currentTime = 0;
      refVideo.current.play();
    };

    const pause = () => {
      if (!refVideo.current) return;
      refVideo.current.pause();
    };

    useImperativeHandle(ref, () => ({
      play,
      pause,
    }));

    const onClick = () => {
      if (!played) {
        play();
      }
    };

    // REPLAY VIDEO WHEN PAGE IS VISIBLE
    const documentVisible = useVisibilityChange();
    useEffect(() => {
      if (documentVisible && played) {
        play();
      }
    }, [documentVisible]);

    const showPoster = !playing && !played;

    return (
      <div
        className="video-player"
        onClick={onClick}
      >
        <video
          ref={refVideo}
          src={src}
          poster={poster}
          onEnded={onEnd}
          playsInline
          muted={muted}
          preload="auto"
        />
        <AnimatePresence>
          {showPoster && (
            <motion.img
              src={poster}
              initial={{ opacity: 0 }}
              animate={{ opacity: showPoster ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1, ease: 'easeIn' }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showSkip && played && (
            <button
              className="btn-skip"
              onClick={onSkip}
              key="btn-skip"
              exit={{ opacity: 0 }}
            >
              {t('general.skip')}
            </button>
          )}
        </AnimatePresence>
      </div>
    );
  }
);
