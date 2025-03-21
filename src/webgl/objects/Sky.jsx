import { urls } from '@/config/assets';
import fragmentShader from '@/webgl/glsl/sky/sky.frag';
import vertexShader from '@/webgl/glsl/utils/base.vert';
import vertexShaderProjected from '@/webgl/glsl/utils/baseProjection.vert';

export const Sky = memo(
  ({
    color1 = new Color('rgb(200,150,100)'),
    color2 = new Color('rgb(120,180,250)'),
    movementSpeed = 0.01,
    skyDepth = 0.4,
    scale = 1,

    isSphere = false,
    sphereRadius = 10,

    materialProps = {},
    ...props
  }) => {
    const _color1 = useColor(color1);
    const _color2 = useColor(color2);

    const tNoise = useAsset(urls.t_noise_rough);

    const shader = useMemo(
      () => ({
        vertexShader: isSphere ? vertexShaderProjected : vertexShader,
        fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColor1: {
            value: _color1,
          },
          uColor2: {
            value: _color2,
          },
          tNoise: {
            value: tNoise,
          },
          uMovementSpeed: {
            value: movementSpeed,
          },
          uSkyDepth: {
            value: skyDepth,
          },
          uMouse: {
            value: new Vector2(),
          },
          uScale: {
            value: isSphere ? scale * 4 : scale,
          },
          uOffset: {
            value: Math.random(),
          },
        },

        depthTest: false,
        depthWrite: false,
      }),
      []
    );

    useEffect(() => {
      shader.uniforms.uColor1.value = _color1;
    }, [_color1]);
    useEffect(() => {
      shader.uniforms.uColor2.value = _color2;
    }, [_color2]);
    useEffect(() => {
      shader.uniforms.uMovementSpeed.value = movementSpeed;
    }, [movementSpeed]);
    useEffect(() => {
      shader.uniforms.uScale.value = isSphere ? scale * 4 : scale;
    }, [scale, isSphere]);
    useEffect(() => {
      shader.uniforms.uSkyDepth.value = skyDepth;
    }, [skyDepth]);
    useEffect(() => {
      shader.uniforms.tNoise.value = tNoise;
    }, [tNoise]);

    const getMouse = useMouse2();

    useFrame(({ clock }, delta) => {
      const { x, y } = getMouse(0.1, delta);

      shader.uniforms.uMouse.value.set(x, y);
      shader.uniforms.uTime.value = clock.getElapsedTime();
    });

    // const fsTriangle = useMemo(() => {
    //   return fullscreenTriangle();
    // }, []);

    if (isSphere)
      return (
        <mesh
          {...props}
          renderOrder={-10}
        >
          <sphereGeometry args={[sphereRadius, 32, 32]} />
          <shaderMaterial
            {...shader}
            side={BackSide}
            {...materialProps}
          />
        </mesh>
      );

    return (
      <mesh
        geometry={fsTriangle}
        {...props}
        scale={1}
        renderOrder={-10}
        frustumCulled={false}
      >
        <shaderMaterial
          {...shader}
          {...materialProps}
        />
      </mesh>
    );
  }
);
