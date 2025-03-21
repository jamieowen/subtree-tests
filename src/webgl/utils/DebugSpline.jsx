import { CatmullRomCurve3, BufferGeometry, BufferAttribute } from 'three';

export const DebugSpline = ({ spline, closed = false, color = 'white' }) => {
  const key = useMemo(() => {
    return JSON.stringify({
      spline,
      closed,
    });
  });

  const geometry = suspend(async () => {
    const curve = new CatmullRomCurve3(
      spline.map(({ x, y, z }) => new Vector3(x, y, z)),
      closed
    );
    const arcSegments = 200;
    const point = new Vector3();

    const geo = new BufferGeometry();
    geo.setAttribute(
      'position',
      new BufferAttribute(new Float32Array(arcSegments * 3), 3)
    );

    for (let i = 0; i < arcSegments; i++) {
      const t = i / (arcSegments - 1);
      curve.getPoint(t, point);
      geo.attributes.position.setXYZ(i, point.x, point.y, point.z);
    }

    return geo;
  }, ['DebugSpline', key]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      clear(['DebugSpline', key]);
    };
  }, [geometry]);

  return (
    <group>
      <line>
        <primitive
          object={geometry}
          attach="geometry"
        />
        <lineBasicMaterial
          color={color}
          fog={false}
          transparent={true}
          opacity={0.3}
        />
      </line>

      {spline.map(({ x, y, z, w }, i) => (
        <mesh
          position={[x, y, z]}
          key={i}
          renderOrder={99}
        >
          <sphereGeometry args={[w, 4, 4]} />
          <meshBasicMaterial
            color={color}
            wireframe={true}
            fog={false}
            depthTest={false}
            depthWrite={false}
            transparent={true}
            opacity={0.3}
          />
        </mesh>
      ))}
    </group>
  );
};
