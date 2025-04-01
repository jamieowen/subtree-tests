import './VideoPlayer.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';
export const VideoPlayer = ({ src, onEnd, show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const refVideo = useRef(null);

  useEffect(() => {
    if (show) {
      refVideo.current.currentTime = 0;
      refVideo.current.play();
    } else {
      refVideo.current.pause();
    }

    return () => {
      if (!refVideo.current) return;
      refVideo.current.pause();
    };
  }, [show]);

  return (
    <div className={classnames(['page', 'VideoPlayer', { show }])}>
      <video
        ref={refVideo}
        src={src}
        onEnded={onEnd}
        playsInline
      />
      <button
        className="btn-skip"
        onClick={onEnd}
      >
        {t('skip')}
      </button>
    </div>
  );
};
