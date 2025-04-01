import './ButtonPrimary.sass';
import IconButtonRed from '@/assets/btn-red.svg?react';

export const ButtonPrimary = ({ children, color = 'red', ...props }) => {
  const { t } = useTranslation();

  return (
    <button
      className={`button-primary ${color}`}
      {...props}
    >
      {/* <IconButtonRed className="bg" /> */}
      <span className="label">{children}</span>
    </button>
  );
};
