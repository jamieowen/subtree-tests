import './Loading.sass';
import classNames from 'classnames';
import { useAppStore } from '@/stores/app';
import requestIdleCallback from '@/helpers/RequestIdleCallback';
import { PromiseTimeout } from '@/helpers/PromiseTimeout';
import ReactAnimatedEllipsis from 'react-animated-ellipsis';

export const Loading = ({ ...props }) => {
  const emitter = useMitt();

  const { t } = useTranslation();

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
      <LoadingBg />
      <div className="content">
        <LoadingPercent show={true} />
        <div className="desc relative">
          {t('general.loading')}
          <ReactAnimatedEllipsis className="ellipsis absolute left-full" />
        </div>
      </div>
    </div>
  );
};
