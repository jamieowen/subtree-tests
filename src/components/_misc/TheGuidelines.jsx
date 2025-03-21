import styles from './TheGuidelines.module.sass';
import classnames from 'classnames';
import { getUrlBoolean } from '@/helpers/UrlParam';

const guidelines = getUrlBoolean('guidelines', false);

export const TheGuidelines = function () {
  return (
    <>
      {guidelines && (
        <div className={styles.guidelines}>
          <div className={classnames(styles.guideline, styles.guidelineV)} />
          <div className={classnames(styles.guideline, styles.guidelineH)} />
        </div>
      )}
    </>
  );
};
