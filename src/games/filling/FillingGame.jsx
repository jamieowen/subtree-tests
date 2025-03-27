import { urls } from '@/config/assets';
import './FillingGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';
import { Box } from '@react-three/drei';
import { FillingECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const FillingGame = ({ show, onEnded }) => {
  // const count = useFillingStore((state) => state.count);
  // const setCount = useFillingStore((state) => state.setCount);
  // const setSection = useFillingStore((state) => state.setSection);
  // const numBottles = useFillingStore((state) => state.numBottles);
  // const addBottle = useFillingStore((state) => state.addBottle);

  const t_filling_nozzle = useAsset(urls.t_filling_nozzle);

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

        <mesh
          position-y={2.73}
          position-z={0.0}
          scale={[2, -2, 2]}
        >
          <planeGeometry args={[0.5, 1, 32]} />
          <meshBasicMaterial
            map={t_filling_nozzle}
            transparent
            alphaTest={0.5}
          />
        </mesh>

        <FillingSystemControls />
        <FillingSystemBottles />
        <FillingSystemGraphics />
      </three.In>
      {/* <div className="game-filling-ui">
        <TimeLeft />
        <Counter />
      </div> */}

      <button
        className="btn-skip"
        onClick={onEnded}
      >
        Skip
      </button>
    </section>
  );
};
