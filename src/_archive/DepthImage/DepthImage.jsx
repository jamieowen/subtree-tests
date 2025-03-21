import { Plane } from '@react-three/drei';
import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
import depthFrag from '@/webgl/glsl/utils/depth.frag';

export const DepthImage = ({ color, depth, strength = 0.1, ...props }) => {
  console.log(color, depth);

  const map = useTexture(color);
  const depthMap = useTexture(depth);

  const uniforms = useMemo(() => {
    return {
      uMouse: {
        value: [0, 0],
      },
      tImage: {
        value: map,
      },
      tDepth: {
        value: depthMap,
      },
      uStrength: {
        value: strength,
      },
    };
  }, []);

  const getMouse2 = useMouse2();
  useFrame(() => {
    const { x, y } = getMouse2();
    uniforms.uMouse.value[0] = x - 0.5;
    uniforms.uMouse.value[1] = y - 0.5;
  });

  useEffect(() => {
    uniforms.uStrength.value = strength;
  }, [strength]);

  return (
    <Plane {...props}>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={baseVert}
        fragmentShader={depthFrag}
      />
    </Plane>
  );
};
