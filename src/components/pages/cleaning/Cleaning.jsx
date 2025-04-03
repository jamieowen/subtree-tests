import './Cleaning.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useCleaningStore } from '@/stores/cleaning';
import { Results } from '../../_misc/Results';

export const Cleaning = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const duration = useCleaningStore((state) => state.config.duration);
  const count = useCleaningStore((state) => state.count);
  const setCount = useCleaningStore((state) => state.setCount);
  const resetCount = useCleaningStore((state) => state.resetCount);

  const section = useCleaningStore((state) => state.section);
  const setSection = useCleaningStore((state) => state.setSection);
  const nextSection = useCleaningStore((state) => state.nextSection);

  const replay = useCleaningStore((state) => state.replay);

  const { completed } = useAssetProgress();

  const showVideo = show && section == 'video';

  const blurBg = !showVideo && section != 'intro';

  const refGame = useRef(null);
  const onReplay = () => {
    setCount(0);
    setSection('intro');
    refGame.current.reset();
  };

  return (
    <div className={classnames(['page', 'game', 'cleaning', { show }])}>
      <img
        src={`/assets/images-next/cleaning-intro.webp`}
        className={classnames(['game-bg', { blurBg }])}
      />

      <AnimatePresence>
        {showVideo && (
          <VideoPlayer
            key="cleaning-video"
            src="/assets/videos/cleaning.mp4"
            onEnd={() => {
              nextSection();
            }}
            exit={{ opacity: 0 }}
            showSkip={section == 'video'}
          />
        )}
      </AnimatePresence>

      <Intro
        id="cleaning"
        show={section == 'intro'}
        onClick={nextSection}
      />

      <Tutorial
        id="cleaning"
        show={section == 'tutorial'}
        onClick={nextSection}
      />

      {completed && show && (
        <CleaningGame
          ref={refGame}
          show={section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="cleaning"
        show={section == 'results'}
        onReplay={onReplay}
        count={count}
        points={count * 10}
        onNext={() => setPage('filling')}
      />
    </div>
  );
};
