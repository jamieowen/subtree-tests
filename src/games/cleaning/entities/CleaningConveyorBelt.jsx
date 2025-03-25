import { CleaningECS } from '../state';
import { three } from '@/tunnels';
import { useCleaningStore } from '@/stores/cleaning';

export const CleaningConveyorBelt = ({ children }) => {
  return (
    <CleaningECS.Entity>
      <CleaningECS.Component
        name="isBelt"
        data={true}
      />
      <CleaningECS.Component
        name="belt"
        data={0}
      />
      <CleaningECS.Component
        name="locked"
        data={false}
      />
      <CleaningECS.Component name="three">
        <group>
          {/* <mesh
            name="belt"
            position={[0, 0, 0]}
            rotation-x={degToRad(-90)}
          >
            <planeGeometry args={[10, 3]} />
            <meshBasicMaterial color="grey" />
          </mesh> */}

          <group
            name="bottles"
            position-y={1}
          >
            {children}
          </group>
        </group>
      </CleaningECS.Component>
    </CleaningECS.Entity>
  );
};
