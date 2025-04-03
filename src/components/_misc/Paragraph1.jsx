import './Paragraph1.sass';
import classnames from 'classnames';

export const Paragraph1 = ({ className, children }) => {
  return <p className={classnames(['paragraph1', className])}>{children}</p>;
};
