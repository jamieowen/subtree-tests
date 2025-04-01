import './Grouping.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useGroupingStore } from '@/stores/grouping';

export const Grouping = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const duration = useGroupingStore((state) => state.config.duration);
  const count = useGroupingStore((state) => state.count);
  const setCount = useGroupingStore((state) => state.setCount);
  const resetCount = useGroupingStore((state) => state.resetCount);

  const section = useGroupingStore((state) => state.section);
  const nextSection = useGroupingStore((state) => state.nextSection);

  const replay = useGroupingStore((state) => state.replay);

  const { completed } = useAssetProgress();

  return (
    <div className={classnames(['page', 'game', 'Grouping', { show }])}>
      <Intro
        id="grouping"
        show={section == 'intro'}
        onClick={nextSection}
      />
      <Tutorial
        id="grouping"
        show={section == 'tutorial'}
        onClick={nextSection}
      />

      {completed && show && (
        <GroupingGame
          show={section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="grouping"
        show={section == 'results'}
        onReplay={replay}
        count={count}
        onNext={() => setPage('ending-video')}
      />
    </div>
  );
};
