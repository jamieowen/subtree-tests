import './Filling.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useFillingStore } from '@/stores/filling';

export const Filling = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const duration = useFillingStore((state) => state.config.duration);
  const count = useFillingStore((state) => state.count);
  const setCount = useFillingStore((state) => state.setCount);
  const resetCount = useFillingStore((state) => state.resetCount);

  const section = useFillingStore((state) => state.section);
  const nextSection = useFillingStore((state) => state.nextSection);

  const replay = useFillingStore((state) => state.replay);

  const { completed } = useAssetProgress();

  return (
    <div className={classnames(['page', 'game', 'Filling', { show }])}>
      <VideoPlayer
        src="/assets/videos/filling.mp4"
        show={section == 'video' || section == 'intro'}
        onEnd={nextSection}
      />

      <Intro
        id="filling"
        show={section == 'intro'}
        onClick={nextSection}
      />

      <Tutorial
        id="filling"
        show={section == 'tutorial'}
        onClick={nextSection}
      />

      {completed && show && (
        <FillingGame
          show={section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="filling"
        show={section == 'results'}
        onReplay={replay}
        count={count}
        onNext={() => setPage('grouping')}
      />
    </div>
  );
};
