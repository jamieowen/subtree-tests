import './CleaningGame.sass';
import classnames from 'classnames';
import { urls } from '@/config/assets';
import { three } from '@/tunnels';
import { useCleaningStore } from '@/stores/cleaning';
import { Box } from '@react-three/drei';
import { CleaningECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const CleaningGame = forwardRef(({ visible, show, onEnded }, ref) => {
  const { t } = useTranslation();
  const count = useCleaningStore((state) => state.count);
  const points = useMemo(() => count, [count]);
  const duration = useCleaningStore((state) => state.config.duration);

  const [started, setStarted] = useState(false);

  const onCountdownEnded = () => {
    // if (!show || !visible) return;
    setStarted(true);
  };

  const onTimeLeftEnded = () => {
    if (!show || !visible) return;
    onEnded?.();
  };

  const playing = show && started;

  // console.log(show, started, playing);

  const refBottles = useRef(null);
  const refControls = useRef(null);

  const reset = () => {
    setStarted(false);
    refBottles.current.resetBottles();
    refControls.current.reset();
  };
  useImperativeHandle(ref, () => ({
    reset,
  }));
  useEffect(() => {
    if (show) {
      reset();
    }
  }, [show]);

  const [t_hanger_back, t_hanger_front] = useAsset([
    urls.t_hanger_back,
    urls.t_hanger_front,
  ]);

  return (
    <section
      className={classnames(['page', 'game', 'game-cleaning', { show }])}
    >
      <three.In>
        <group visible={visible}>
          {/* <BackgroundColor color={0x84b792} /> */}

          <PerspectiveCamera
            position={[0, 1.82, 5.2]}
            makeDefault
          />

          {/* <Grid
          cellSize={1}
          sectionSize={5}
          args={[100, 100]}
          fadeDistance={20}
          side={DoubleSide}
          cellThickness={0.75}
          sectionThickness={1}
        /> */}

          <ambientLight intensity={1.5} />

          <directionalLight
            intensity={2}
            position={[3, 3, 3]}
          />

          <CleaningConveyorBelt>
            <CleaningBottles />
          </CleaningConveyorBelt>

          <CleaningNozzle />
          <CleaningHanger />

          <CleaningSystemControls
            ref={refControls}
            playing={playing}
          />
          <CleaningSystemBottles
            ref={refBottles}
            playing={playing}
          />
          <CleaningSystemGraphics />
        </group>

        <PreCompile />
      </three.In>

      <div className="contents">
        <TimeLeft
          id="cleaning"
          duration={duration}
          onEnded={onTimeLeftEnded}
          show={started}
        />
        <Points
          id="cleaning"
          points={points}
          show={started}
        />
        <Countdown
          id="cleaning"
          onEnded={onCountdownEnded}
          show={show && !started}
        />
        <PointPopup
          point={10}
          count={count}
        />
        <CleanPopup />

        <ButtonPrimary
          className="btn-cta"
          show={show && started}
        >
          {t('cleaning.game.cta')}
        </ButtonPrimary>
      </div>

      {show && started && (
        <button
          className="btn-skip-game"
          onClick={onEnded}
        >
          {t('general.skip')}
        </button>
      )}
    </section>
  );
});
