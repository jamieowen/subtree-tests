import { urls } from '@/config/assets';
import './GroupingGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useGroupingStore } from '@/stores/grouping';
import { Box } from '@react-three/drei';
import { GroupingECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const GroupingGame = forwardRef(({ show, onEnded }, ref) => {
  const { t } = useTranslation();
  const count = useGroupingStore((state) => state.count);
  const points = useMemo(() => count * 10);
  const duration = 20;

  const [started, setStarted] = useState(false);

  const onCountdownEnded = () => {
    setStarted(true);
  };

  const onTimeLeftEnded = () => {
    onEnded();
  };

  const playing = show && started;

  console.log('GroupingGame', show, playing);

  const refSystemBottles = useRef(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      setStarted(false);
      refSystemBottles.current.reset();
    },
  }));

  return (
    <section
      className={classnames(['page', 'game', 'game-grouping', { show }])}
    >
      <three.In>
        <BackgroundColor color={0x84b792} />

        <PerspectiveCamera
          position={[0, 3, 10]}
          makeDefault
        />

        <Grid
          cellSize={1}
          sectionSize={5}
          args={[100, 100]}
          fadeDistance={20}
          side={DoubleSide}
          cellThickness={0.75}
          sectionThickness={1}
        />

        <ambientLight intensity={1} />

        <directionalLight
          intensity={2}
          position={[0, 8, 3]}
        />

        <GroupingBox />
        <GroupingBottles />

        <GroupingSystemBottles
          ref={refSystemBottles}
          playing={playing}
        />
        <GroupingSystemGraphics />
        <GroupingSystemControls playing={playing} />
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
      </div>

      <button
        className="btn-skip-game"
        onClick={onEnded}
      >
        {t('general.skip')}
      </button>
    </section>
  );
});
