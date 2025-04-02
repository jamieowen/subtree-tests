import './VideoPlayer.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';
export const VideoPlayer = ({ src, onEnd, showSkip = true, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const refVideo = useRef(null);

  useEffect(() => {
    refVideo.current.currentTime = 0;
    refVideo.current.play();

    return () => {
      if (!refVideo.current) return;
      refVideo.current.pause();
    };
  }, []);

  const onSkip = () => {
    refVideo.current.pause();
    onEnd();
  };

  return (
    <div className="video-player">
      <video
        ref={refVideo}
        src={src}
        onEnded={onEnd}
        playsInline
      />
      <AnimatePresence>
        {showSkip && (
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
};
