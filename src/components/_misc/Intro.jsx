import './Intro.sass';
import classnames from 'classnames';

export const Intro = ({ id, show, onClick, onAnimatedIn }) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      let timeout = setTimeout(() => {
        onAnimatedIn?.();
      }, 1100);
      return () => clearTimeout(timeout);
    }
  }, [show]);

  return (
    <section className={classnames(['page', 'intro', { show }])}>
      <Step
        id={id}
        show={show}
      />

      <Heading1
        show={show}
        delay={0}
      >
        {t(`${id}.intro.heading`)}
      </Heading1>
      <Paragraph1
        show={show}
        delay={0.2}
      >
        {t(`${id}.intro.desc`)}
      </Paragraph1>
      <ButtonPrimary
        show={show}
        delay={0.4}
        onClick={onClick}
      >
        {t('cleaning.intro.cta')}
      </ButtonPrimary>
    </section>
  );
};
