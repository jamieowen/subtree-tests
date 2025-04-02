import { useAppStore } from '@/stores/app';
import './Pages.sass';

export const Pages = () => {
  const page = useAppStore((state) => state.page);
  const setPage = useAppStore((state) => state.setPage);

  return (
    <div className="pages">
      <Landing show={page == ''} />
      <Cleaning show={page == 'cleaning'} />
      <Filling show={page == 'filling'} />
      <Grouping show={page == 'grouping'} />
      <Ending show={page == 'ending'} />
    </div>
  );
};
