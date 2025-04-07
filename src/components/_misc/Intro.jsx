import './Intro.sass';
import classnames from 'classnames';

export const Intro = ({ id, show, onClick }) => {
  const { t } = useTranslation();

  return (
    <section className={classnames(['page', 'intro', { show }])}>
      <motion.div
        className="step"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
        transition={{ duration: 0.6 }}
      >
        <span>{t(`${id}.step`)}</span>
      </motion.div>

      <Heading1
        show={show}
        delay={0.2}
      >
        {t(`${id}.intro.heading`)}
      </Heading1>
      <Paragraph1
        show={show}
        delay={0.4}
      >
        {t(`${id}.intro.desc`)}
      </Paragraph1>
      <ButtonPrimary
        show={show}
        delay={0.6}
        onClick={onClick}
      >
        {t('cleaning.intro.cta')}
      </ButtonPrimary>
    </section>
  );
};
