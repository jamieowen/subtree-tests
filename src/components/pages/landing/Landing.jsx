import './Landing.sass';
import { useAppStore } from '@/stores/app';
import classnames from 'classnames';
import AssetService from '@/services/AssetService';

export const Landing = ({ show, ...props }) => {
  const { t } = useTranslation();
  const nextPage = useAppStore((state) => state.nextPage);

  const onClick = () => {
    nextPage();
    AssetService.getAsset('sfx_introvideo').play(); // TODO: Remove
    AssetService.getAsset('mx_introvideo').play();
  };

  return (
    <div className={classnames(['page', 'Landing', { show }])}>
      <div className="wrap">
        <Heading1
          show={show}
          delay={1}
        >
          {t('landing.heading')}
        </Heading1>

        <div className="bottom">
          <Paragraph1
            show={show}
            delay={1.2}
          >
            {t('landing.desc')}
          </Paragraph1>
          <ButtonPrimary
            show={show}
            delay={1.4}
            onClick={onClick}
          >
            {t('landing.cta')}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};
