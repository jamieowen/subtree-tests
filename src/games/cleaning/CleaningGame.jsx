import './CleaningGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useCleaningStore } from '@/stores/cleaning';
import { Box } from '@react-three/drei';
import { CleaningECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const CleaningGame = ({ show, onEnded }) => {
  const count = useCleaningStore((state) => state.count);
  const points = useMemo(() => count * 10);
  const duration = 20;

  const [started, setStarted] = useState(false);

  const onCountdownEnded = () => {
    setStarted(true);
  };

  const onTimeLeftEnded = () => {
    onEnded();
  };

  return (
    <section
      className={classnames(['page', 'game', 'game-cleaning', { show }])}
    >
      <three.In>
        <BackgroundColor color={0xff0000} />

        <PerspectiveCamera
          position={[0, 1, 6]}
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

        <mesh position-y={-1}>
          <coneGeometry args={[0.3, 1, 32]} />
          <meshBasicMaterial color="green" />
        </mesh>

        <CleaningSystemControls />
        <CleaningSystemBottles />
        <CleaningSystemGraphics />
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
      </div>

      {/* <button
        className="btn-skip"
        onClick={onEnded}
      >
        Skip
      </button> */}
    </section>
  );
};
