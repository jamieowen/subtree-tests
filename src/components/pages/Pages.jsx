import { useAppStore } from '@/stores/app';
import './Pages.sass';

export const Pages = () => {
  const page = useAppStore((state) => state.page);
  const setPage = useAppStore((state) => state.setPage);
  const nextPage = useAppStore((state) => state.nextPage);

  // CLEANING INTRO VIDEO
  const refVideo = useRef(null);
  useEffect(() => {
    if (page == 'cleaning-intro') {
      refVideo.current.play();
    }
    return () => {
      if (!refVideo.current) return;
      refVideo.current.pause();
    };
  }, [page]);
  const showCleaningIntroVideo = page == '' || page == 'cleaning-intro';

  const completed = useAssetProgress();

  return (
    <div className="pages">
      <AnimatePresence>
        {showCleaningIntroVideo && (
          <VideoPlayer
            ref={refVideo}
            key="cleaning-video"
            src="/assets/videos/cleaning.mp4"
            onEnd={nextPage}
            autoPlay={false}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <Landing show={page == '' && completed} />
      <Cleaning show={page == 'cleaning'} />
      <Filling show={page == 'filling'} />
      <Grouping show={page == 'grouping'} />
      <Ending show={page == 'ending'} />
    </div>
  );
};
