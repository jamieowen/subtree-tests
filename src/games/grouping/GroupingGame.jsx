import { urls } from '@/config/assets';
import './GroupingGame.sass';
import classnames from 'classnames';
import { three } from '@/tunnels';
import { useGroupingStore } from '@/stores/grouping';
import { Box } from '@react-three/drei';
import { GroupingECS } from './state';
import { PerspectiveCamera, Grid } from '@react-three/drei';

export const GroupingGame = ({ show, onEnded }) => {
  return (
    <section
      className={classnames(['page', 'game', 'game-grouping', { show }])}
    >
      <three.In>
        <BackgroundColor color={0xff0000} />

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

        <GroupingSystemBottles />
        <GroupingSystemGraphics />
        <GroupingSystemControls />
      </three.In>

      <button
        className="btn-skip"
        onClick={onEnded}
      >
        Skip
      </button>
    </section>
  );
};
