import { createContext } from 'react';
import { urls } from '@/config/assets';
import './FillingGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useFillingStore } from '@/stores/filling';
import { Box } from '@react-three/drei';
import { FillingECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

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

export const FillingGame = ({ show, onEnded }) => {
  const t_filling_nozzle = useAsset(urls.t_filling_nozzle);

  const textures = useAsset([
    urls.t_filling_bottle25,
    urls.t_filling_bottle50,
    urls.t_filling_bottle75,
    urls.t_filling_bottle100,
  ]);

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

        <FillingSystemControls textureConfigs={textureConfigs} />
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
