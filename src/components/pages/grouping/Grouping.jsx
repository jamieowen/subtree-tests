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
  const setSection = useGroupingStore((state) => state.setSection);
  const nextSection = useGroupingStore((state) => state.nextSection);

  const replay = useGroupingStore((state) => state.replay);

  const { completed } = useAssetProgress();

  const showVideo = show && (section == 'video' || section == 'intro');

  const refGame = useRef(null);
  const onReplay = () => {
    setCount(0);
    setSection('intro');
    refGame.current.reset();
  };

  return (
    <div className={classnames(['page', 'game', 'Grouping', { show }])}>
      <AnimatePresence>
        {showVideo && (
          <VideoPlayer
            key="grouping-video"
            src="/assets/videos/grouping.mp4"
            onEnd={() => {
              nextSection();
            }}
            exit={{ opacity: 0 }}
            showSkip={section == 'video'}
          />
        )}
      </AnimatePresence>

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
          ref={refGame}
          show={section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="grouping"
        show={section == 'results'}
        onReplay={onReplay}
        count={count}
        points={count * 10}
        onNext={() => setPage('ending')}
      />
    </div>
  );
};
