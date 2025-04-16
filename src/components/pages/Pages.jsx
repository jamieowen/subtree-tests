import { useAppStore } from '@/stores/app';
import './Pages.sass';
import { urls } from '@/config/assets';

export const Pages = () => {
  const page = useAppStore((state) => state.page);
  const setPage = useAppStore((state) => state.setPage);
  const nextPage = useAppStore((state) => state.nextPage);

  // CLEANING INTRO VIDEO
  const refVideo = useRef(null);
  useEffect(() => {
    if (page == 'intro') {
      refVideo.current.play();
    }
    return () => {
      if (!refVideo.current) return;
      refVideo.current.pause();
    };
  }, [page]);
  const showCleaningIntroVideo = page == '' || page == 'intro';

  // const completed = useAssetProgress();
  const ready = useAppStore((state) => state.ready);

  return (
    <div className="pages">
      <AnimatePresence>
        {showCleaningIntroVideo && (
          <VideoPlayer
            ref={refVideo}
            key="video-intro"
            src={urls.v_intro}
            poster={urls.i_intro}
            onEnd={nextPage}
            autoPlay={false}
            muted={false}
            exit={{ opacity: 0 }}
          />
        )}

        {page == '' && (
          <motion.video
            key={'video-landing'}
            src={urls.v_landing}
            poster={urls.i_landing}
            autoPlay={true}
            loop={true}
            muted={true}
            className="full object-cover pointer-events-none"
            playsInline={true}
            exit={{ opacity: 0 }}
            transition={{ duration: 41 / 30, ease: 'linear' }}
          />
        )}
      </AnimatePresence>
      {page == '' && ready && <Landing show={true} />}
      {page == 'cleaning' && <Cleaning show={true} />}
      {page == 'filling' && <Filling show={true} />}
      {page == 'grouping' && <Grouping show={true} />}
      {page == 'ending' && <Ending show={true} />}
    </div>
  );
};
