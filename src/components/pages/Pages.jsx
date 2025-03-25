import { useAppStore } from '@/stores/app';
import './Pages.sass';

export const Pages = () => {
  const page = useAppStore((state) => state.page);
  const setPage = useAppStore((state) => state.setPage);

  return (
    <div className="pages">
      <Landing show={page == ''} />

      <VideoPlayer
        src="/assets/videos/cleaning.mp4"
        show={page == 'cleaning-video'}
        onEnd={() => setPage('cleaning')}
      />
      <Cleaning show={page == 'cleaning'} />

      <VideoPlayer
        src="/assets/videos/filling.mp4"
        show={page == 'filling-video'}
        onEnd={() => setPage('filling')}
      />
      <Filling show={page == 'filling'} />

      <VideoPlayer
        src="/assets/videos/grouping.mp4"
        show={page == 'grouping-video'}
        onEnd={() => setPage('grouping')}
      />
      <Grouping show={page == 'grouping'} />

      <VideoPlayer
        src="/assets/videos/ending.mp4"
        show={page == 'ending-video'}
        onEnd={() => setPage('ending')}
      />
      <Ending show={page == 'ending'} />
    </div>
  );
};
