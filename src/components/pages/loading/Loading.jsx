import './Loading.sass';
import classNames from 'classnames';
import { useAppStore } from '@/stores/app';
import requestIdleCallback from '@/helpers/RequestIdleCallback';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';

export const Loading = ({ ...props }) => {
  const emitter = useMitt();

  const { completed } = useAssetProgress();
  const ready = useAppStore((state) => state.ready);
  const setReady = useAppStore((state) => state.setReady);

  useEffect(() => {
    (async () => {
      if (completed) {
        await PromiseTimeout(100);
        requestIdleCallback(() => {
          setReady(true);
        });
      }
    })();
  }, [completed]);

  return (
    <div className={classNames(['Loading', { hide: ready }])}>
      <div className="content">
        <div className={'bottom'}>
          <LoadingPercent show={true} />
        </div>
      </div>
    </div>
  );
};
