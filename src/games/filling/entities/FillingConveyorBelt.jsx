import { ECS } from '../state';
import { three } from '@/tunnels';
import { usefillingStore } from '@/stores/filling';

export const fillingConveyorBelt = ({ children }) => {
  return (
    <ECS.Entity>
      <ECS.Component
        name="isBelt"
        data={true}
      />
      <ECS.Component
        name="belt"
        data={0}
      />
      <ECS.Component
        name="locked"
        data={false}
      />
      <ECS.Component name="three">
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
      </ECS.Component>
    </ECS.Entity>
  );
};
