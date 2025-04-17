import './Grouping.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useGroupingStore } from '@/stores/grouping';
import { urls } from '@/config/assets';

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

  const showVideo = show && section == 'video';
  const showGame = completed && show;
  const blurBg = !showVideo && section != 'intro';

  const refGame = useRef(null);
  const onReplay = () => {
    setCount(0);
    setSection('game');
    refGame.current.reset();
  };

  const emitter = useMitt();
  const onReset = () => {
    setCount(0);
    setSection('intro');
    // refGame.current?.reset();
  };
  useEffect(() => {
    emitter.on('reset', onReset);
  }, []);
  // useEffect(onReplay, [showGame]);

  return (
    <div className={classnames(['page', 'game', 'Grouping', { show }])}>
      {/* TODO: Video */}
      <img
        src={urls.i_grouping_loop}
        className={classnames(['game-bg'])}
      />
      <video
        src={urls.v_grouping_bg}
        autoPlay
        muted
        loop
        playsInline={true}
        className={classnames(['game-bg', { blurBg: true }])}
      />

      <AnimatePresence>
        {showVideo && (
          <VideoPlayer
            key="grouping-video"
            src={urls.v_grouping}
            poster={urls.i_grouping_intro}
            onEnd={() => {
              nextSection();
            }}
            exit={{ opacity: 0 }}
            showSkip={section == 'video'}
            // sup={t('grouping.video.super')}
            // disclaimer={t('grouping.game.disclaimer')}
          />
        )}
      </AnimatePresence>

      <Intro
        id="grouping"
        show={show && section == 'intro'}
        onClick={nextSection}
        animatedIn={true}
      />

      <Tutorial
        id="grouping"
        show={show && section == 'tutorial'}
        onClick={nextSection}
      />

      {showGame && (
        <GroupingGame
          ref={refGame}
          visible={show && section != 'intro'}
          show={show && section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="grouping"
        show={show && section == 'results'}
        onReplay={onReplay}
        count={count}
        points={count}
        onNext={() => setPage('ending')}
      />
    </div>
  );
};
