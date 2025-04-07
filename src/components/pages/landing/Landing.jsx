import './Landing.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';

export const Landing = ({ show, ...props }) => {
  const { t } = useTranslation();
  const nextPage = useAppStore((state) => state.nextPage);

  return (
    <div
      className={classnames(['page', 'Landing', { show }])}
      onClick={nextPage}
    >
      <div className="wrap">
        <Heading1>{t('landing.heading')}</Heading1>

        <div className="bottom">
          <Paragraph1>{t('landing.desc')}</Paragraph1>
          <ButtonPrimary>{t('landing.cta')}</ButtonPrimary>
        </div>
      </div>
    </div>
  );
};
