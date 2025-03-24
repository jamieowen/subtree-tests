import './GameCleaning.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useCleaningStore } from '@/stores/cleaning';
import { Box } from '@react-three/drei';
import { ECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const GameCleaning = ({ show }) => {
  // const count = useCleaningStore((state) => state.count);
  // const setCount = useCleaningStore((state) => state.setCount);
  // const setSection = useCleaningStore((state) => state.setSection);
  // const numBottles = useCleaningStore((state) => state.numBottles);
  // const addBottle = useCleaningStore((state) => state.addBottle);

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

        <Grid
          cellSize={1}
          sectionSize={5}
          args={[100, 100]}
          fadeDistance={20}
          side={DoubleSide}
          cellThickness={0.75}
          sectionThickness={1}
        />

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

        <SystemControls />
        <SystemBottles />
        <SystemGraphics />
      </three.In>
      {/* <div className="game-cleaning-ui">
        <TimeLeft />
        <Counter />
      </div> */}
    </section>
  );
};
