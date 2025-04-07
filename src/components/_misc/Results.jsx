import './Results.sass';
import classnames from 'classnames';
import AssetService from '@/services/AssetService';

export const Results = ({
  id,
  show,
  count = 0,
  points = 0,
  onReplay,
  onNext,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!show) return;
    AssetService.getAsset('sfx_showresult').play();
  }, [show]);

  return (
    <section className={classnames(['page', 'results', { show }])}>
      <div className="wrap">
        <Heading1 show={show}>{t(`${id}.results.heading`)}</Heading1>

        <motion.ul
          className="scores"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
          transition={{ duration: show ? 0.6 : 0.2, delay: show ? 0.5 : 0 }}
        >
          <li>
            <div className="value">{count}</div>
            <div className="label">{t(`${id}.results.desc`)}</div>
          </li>
        </motion.ul>

        <motion.button
          className="btn-secondary"
          onClick={onReplay}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.8 }}
          transition={{ duration: show ? 0.6 : 0.2, delay: show ? 0.7 : 0 }}
        >
          {t(`${id}.results.replay`)}
        </motion.button>
      </div>
      <ButtonPrimary
        onClick={onNext}
        show={show}
        delay={show ? 1 : 0}
        // auto={show ? 10 : 0}
      >
        {t(`${id}.results.next`)}
      </ButtonPrimary>
    </section>
  );
};
