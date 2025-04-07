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
    if (page == 'cleaning-intro') {
      refVideo.current.play();
    }
    return () => {
      if (!refVideo.current) return;
      refVideo.current.pause();
    };
  }, [page]);
  const showCleaningIntroVideo = page == '' || page == 'cleaning-intro';

  // const completed = useAssetProgress();
  const ready = useAppStore((state) => state.ready);

  return (
    <div className="pages">
      <AnimatePresence>
        {showCleaningIntroVideo && (
          <VideoPlayer
            ref={refVideo}
            key="cleaning-video"
            src="/assets/videos/cleaning-intro.mp4"
            poster={urls.i_cleaning_intro}
            onEnd={nextPage}
            autoPlay={false}
            exit={{ opacity: 0 }}
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
