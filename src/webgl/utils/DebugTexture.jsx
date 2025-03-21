import { three, hud } from '@/tunnels';

export const DebugTexture = forwardRef(
  ({ texture, size = 256, children, ...props }, ref) => {
    const _size = useThree((s) => s.size);
    const viewport = useThree((s) => s.viewport);

    const tWidth = useMemo(() => {
      return size;
      return size / _size.width;
    }, [size, _size]);

    const tHeight = useMemo(() => {
      return size;
      return size / _size.height;
    }, [size, _size]);

    return (
      <hud.In>
        <mesh
          // position={[1 - tWidth * 0.5, -1 + tHeight * 0.5, 0]}
          position={[
            viewport.width / 2 - tWidth / 2,
            -viewport.height / 2 + tHeight / 2,
            0,
          ]}
          {...props}
        >
          <planeGeometry args={[tWidth, tHeight]} />
          <meshBasicMaterial
            ref={ref}
            map={texture}
            depthTest={false}
            depthWrite={false}
          >
            {/* {texture && (
              <primitive
                object={texture}
                attach="map"
              />
            )} */}
            {children}
          </meshBasicMaterial>
        </mesh>
      </hud.In>
    );
  }
);
