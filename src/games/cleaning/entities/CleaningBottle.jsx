import { ECS } from '../state';
import { three } from '@/tunnels';
import { Billboard } from '@react-three/drei';

export const CleaningBottle = ({ idx }) => {
  const refSprite = useRef(null);

  return (
    <ECS.Entity>
      <ECS.Component
        name="idx"
        data={idx}
      />
      <ECS.Component
        name="isBottle"
        data={true}
      />
      <ECS.Component
        name="position"
        data={{ x: 0, y: 0 }}
      />

      <ECS.Component
        name="progress"
        data={0}
      />
      <ECS.Component
        name="cleaning"
        data={false}
      />
      <ECS.Component
        name="cleaned"
        data={false}
      />
      <ECS.Component name="three">
        <group
          name="bottle"
          position-y={0.5}
        >
          <Billboard
            lockX={true}
            lockZ={true}
          >
            {/* <mesh position={[0, 0, 0]}>
              <planeGeometry args={[0.5, 2]} />
              <meshBasicMaterial color="red" />
            </mesh> */}

            <Sprite
              ref={refSprite}
              id="bottle"
              _key={`bottle_${idx}`}
              name="sprite"
              scale={2}
            />
          </Billboard>
        </group>
      </ECS.Component>

      <ECS.Component
        name="sprite"
        data={refSprite}
      />
    </ECS.Entity>
  );
};
