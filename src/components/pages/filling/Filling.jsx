import './Filling.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useFillingStore } from '@/stores/filling';
import { urls } from '@/config/assets';

export const Filling = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state.setPage);

  const count = useFillingStore((state) => state.count);
  const setCount = useFillingStore((state) => state.setCount);
  const resetCount = useFillingStore((state) => state.resetCount);

  const section = useFillingStore((state) => state.section);
  const setSection = useFillingStore((state) => state.setSection);
  const nextSection = useFillingStore((state) => state.nextSection);

  const replay = useFillingStore((state) => state.replay);

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
    <div
      className={classnames([
        'page',
        'game',
        'filling',
        { show },
        `section-${section}`,
      ])}
    >
      {/* TODO: Video */}
      <img
        src={urls.i_filling_loop}
        className={classnames(['game-bg', { blurBg }])}
      />

      <img
        src={'/assets/images/filling-game-artboard.png'}
        className={classnames(['artboard'])}
      />

      <AnimatePresence>
        {showVideo && (
          <VideoPlayer
            key="filling-video"
            src="/assets/videos/filling-intro.mp4"
            poster={urls.i_filling_intro}
            onEnd={() => {
              nextSection();
            }}
            exit={{ opacity: 0 }}
            showSkip={section == 'video'}
          />
        )}
      </AnimatePresence>

      <Intro
        id="filling"
        show={show && section == 'intro'}
        onClick={nextSection}
      />

      <Tutorial
        id="filling"
        show={show && section == 'tutorial'}
        onClick={nextSection}
      />

      {completed && show && (
        <FillingGame
          ref={refGame}
          show={show && section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="filling"
        show={show && section == 'results'}
        onReplay={onReplay}
        count={count}
        points={count}
        onNext={() => setPage('grouping')}
      />
    </div>
  );
};
