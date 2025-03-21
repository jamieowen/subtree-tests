import './Loading.sass';
import classNames from 'classnames';
export const LoadingEnterButton = ({
  onClick = () => {},
  show = false,
  ...props
}) => {
  return (
    <button
      className={classNames('cta', { show })}
      onClick={onClick}
    >
      Enter
    </button>
  );
};
