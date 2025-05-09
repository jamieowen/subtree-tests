import { createContext } from 'react';
import { urls } from '@/config/assets';
import './FillingGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';
import { Box } from '@react-three/drei';
import { FillingECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';
import { getUrlBoolean } from '@/helpers/UrlParam';
const debug = getUrlBoolean('debug');
// export const FillingGameContext = createContext();
// export const useFillingGameContext = () => useContext(FillingGameContext);

export const textureConfigs = [
  {
    idx: 0,
    progress: 0.25,
    rows: 2048 / 1024,
    cols: 2048 / 256,
    end: 12,
    frames: 15,
  },
  {
    idx: 1,
    progress: 0.5,
    rows: 2048 / 1024,
    cols: 4096 / 256,
    edn: 18,
    frames: 21,
  },
  {
    idx: 2,
    progress: 0.75,
    rows: 2048 / 1024,
    cols: 4096 / 256,
    end: 24,
    frames: 27,
  },
  {
    idx: 3,
    progress: 1,
    rows: 4096 / 1024,
    cols: 4096 / 256,
    end: 48,
    frames: 48,
  },
];

export const FillingGame = forwardRef(({ visible, show, onEnded }, ref) => {
  const { t } = useTranslation();
  const count = useFillingStore((state) => state.count);
  const points = useMemo(() => count, [count]);
  const duration = useFillingStore((state) => state.config.duration);

  const [started, setStarted] = useState(false);

  const onCountdownEnded = () => {
    setStarted(true);
  };

  const onTimeLeftEnded = () => {
    if (!show) return;
    onEnded();
  };

  const playing = show && started;

  const refControls = useRef(null);

  const reset = () => {
    setStarted(false);
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

  return (
    <section className={classnames(['page', 'game', 'game-filling', { show }])}>
      <three.In>
        <group visible={visible}>
          {/* <BackgroundColor color={0x84b792} /> */}

          <PerspectiveCamera
            position={[0, 1, 6.1]}
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

          <FillingNozzle />
          <FillingConveyorBelt playing={playing}>
            <FillingBottles />
            <FillingLines />
          </FillingConveyorBelt>

          <FillingSystemControls
            ref={refControls}
            textureConfigs={textureConfigs}
            playing={playing}
          />
          <FillingSystemBottles />
          <FillingSystemGraphics />
        </group>

        <PreCompile />
      </three.In>

      <div className="contents">
        <TimeLeft
          id="filling"
          duration={duration}
          onEnded={onTimeLeftEnded}
          show={started}
        />
        <Points
          id="filling"
          points={points}
          show={started}
        />
        <Countdown
          id="filling"
          onEnded={onCountdownEnded}
          show={show && !started}
        />
        <PointPopup
          point={10}
          count={count}
        />

        <ButtonPrimary
          className="btn-cta"
          show={show && started}
        >
          {t('filling.game.cta.press')}
        </ButtonPrimary>

        {/* <motion.div
          className="absolute bottom-4 left-0 right-0 text-sm text-center px-3 opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: show ? 1 : 0 }}
          exit={{ opacity: 0 }}
        >
          {t('filling.game.disclaimer')}
        </motion.div> */}
      </div>

      {show && started && debug && (
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
