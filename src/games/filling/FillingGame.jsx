import './fillingGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { usefillingStore } from '@/stores/filling';
import { Box } from '@react-three/drei';
import { FillingECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const fillingGame = ({ show }) => {
  // const count = usefillingStore((state) => state.count);
  // const setCount = usefillingStore((state) => state.setCount);
  // const setSection = usefillingStore((state) => state.setSection);
  // const numBottles = usefillingStore((state) => state.numBottles);
  // const addBottle = usefillingStore((state) => state.addBottle);

  return (
    <section className={classnames(['page', 'game', 'game-filling', { show }])}>
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

        <FillingConveyorBelt>
          <FillingBottles />
        </FillingConveyorBelt>

        <mesh position-y={-1}>
          <coneGeometry args={[0.3, 1, 32]} />
          <meshBasicMaterial color="green" />
        </mesh>

        <FillingSystemControls />
        <FillingSystemBottles />
        <FillingSystemGraphics />
      </three.In>
      {/* <div className="game-filling-ui">
        <TimeLeft />
        <Counter />
      </div> */}
    </section>
  );
};
