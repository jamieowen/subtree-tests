import './Loading.sass';
import classNames from 'classnames';

export const LoadingPercent = ({ show }) => {
  const { progress } = useAssetProgress();

  const label = useMemo(() => {
    return Math.floor(progress * 100)
      .toString()
      .padStart(3, '0');
  }, [progress]);

  return <div className={classNames(['percent', { show }])}>{label}</div>;
};
