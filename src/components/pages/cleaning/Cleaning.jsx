import './Cleaning.sass';
import classnames from 'classnames';
import { useAppStore } from '@/stores/app';
import { useCleaningStore } from '@/stores/cleaning';
// import { Results } from '../../_misc/Results';
import AssetService from '@/services/AssetService';
import { urls } from '@/config/assets';
// import * as config from '@/config/games/cleaning';

export const Cleaning = ({ show, ...props }) => {
  const { t } = useTranslation();
  const setPage = useAppStore((state) => state?.setPage);

  // const duration = useCleaningStore((state) => state.config.duration);
  const count = useCleaningStore((state) => state?.count);
  const setCount = useCleaningStore((state) => state?.setCount);
  // const resetCount = useCleaningStore((state) => state.resetCount);

  const section = useCleaningStore((state) => state?.section);
  const setSection = useCleaningStore((state) => state?.setSection);
  const nextSection = useCleaningStore((state) => state?.nextSection);

  const replay = useCleaningStore((state) => state?.replay);

  const { completed } = useAssetProgress();

  const showVideo = show && section == 'video';

  const blurBg = !showVideo && section != 'intro';

  const refGame = useRef(null);
  const onReplay = () => {
    setCount(0);
    setSection('game');
    refGame.current.reset();
  };

  useEffect(() => {
    if (!show) return;
    // AssetService.getAsset('sfx_introvideo')?.stop(); // TODO: Remove
    // AssetService.getAsset('mx_introvideo')?.stop();
    let gameloop = AssetService.getAsset('mx_gameloop');
    if (gameloop) {
      gameloop.stop();
      gameloop.currentTime = 0;
      gameloop.loop = true;
      gameloop.play();
    }
  }, [show]);

  // INTRO ANIMATED IN
  const [introAnimatedIn, setIntroAnimatedIn] = useState(false);
  const onIntroAnimatedIn = () => {
    console.log('onIntroAnimatedIn');
    setIntroAnimatedIn(true);
  };

  const showGame =
    completed &&
    show &&
    section != 'video' &&
    (introAnimatedIn || section != 'intro');

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
    <div className={classnames(['page', 'game', 'cleaning', { show }])}>
      {/* TODO: Swap to looping video */}
      <img
        src={urls.i_cleaning_loop}
        className={classnames(['game-bg'])}
      />
      <video
        src={urls.v_cleaning_bg}
        autoPlay
        muted
        loop
        playsInline={true}
        className={classnames(['game-bg', { blurBg: true }])}
      />

      <Intro
        id="cleaning"
        show={show && section == 'intro'}
        onClick={nextSection}
        animatedIn={introAnimatedIn}
        onAnimatedIn={onIntroAnimatedIn}
      />

      <Tutorial
        id="cleaning"
        show={show && section == 'tutorial'}
        onClick={nextSection}
        steps={2}
      />

      {showGame && (
        <CleaningGame
          ref={refGame}
          visible={show && section != 'intro'}
          show={show && section == 'game'}
          onEnded={nextSection}
        />
      )}

      <Results
        id="cleaning"
        show={show && section == 'results'}
        onReplay={onReplay}
        count={count}
        onNext={() => setPage('filling')}
      />
    </div>
  );
};
