import { urls } from '@/config/assets';
import { GroupingECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const GroupingBox = () => {
  return (
    <GroupingECS.Entity>
      <GroupingECS.Component
        name="isBox"
        data={true}
      />
      <GroupingECS.Component
        name="position"
        data={[0, -0.5, 0]}
      />
      <GroupingECS.Component name="three">
        <mesh scale={1}>
          <boxGeometry args={[2, 1, 1]} />
          <meshStandardMaterial
            color={0x00ff00}
            transparent
            opacity={0.5}
          />
        </mesh>
      </GroupingECS.Component>
    </GroupingECS.Entity>
  );
};
