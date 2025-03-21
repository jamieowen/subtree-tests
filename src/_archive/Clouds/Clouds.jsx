import { fragmentShader, vertexShader } from './shaders';
import { urls } from '@/config/assets';

export default function Clouds({ position = new Vector3() }) {
  const cloudSize = 6;
  const mesh = useRef();

  const [tMask, tNormal, tNoise] = useTexture([
    urls.t_cloud_alpha,
    urls.t_cloud_normal,
    urls.t_noise,
  ]);

  const size = useThree((s) => s.size);
  tMask.wrapS = tMask.wrapT = RepeatWrapping;
  tNormal.wrapS = tNormal.wrapT = RepeatWrapping;
  tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      tMask: {
        value: tMask,
      },
      tNormal: {
        value: tNormal,
      },
      tNoise: {
        value: tNoise,
      },
      uResolution: {
        value: new Vector2(size.width, size.height),
      },

      // Control
      uLightPosition: {
        value: new Vector3(1, 3, 3),
      },
      uAmbientColor: {
        value: new Color('#ffffff'),
      },
      uLightColor: {
        value: new Color('#ffffff'),
      },
      uAttenuation: {
        value: new Vector3(1, 1, 1),
      },
    }),
    []
  );

  const lightPos = new Vector3(1, 3, 3);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    uniforms['uTime'].value = t;

    // lightPos.z = Math.sin(t * 0.5) * 3 + 10;
    uniforms.uLightPosition.value.set(lightPos.x, lightPos.y, lightPos.z);
  });

  return (
    <mesh
      ref={mesh}
      frustumCulled={false}
      position={position}
    >
      <planeGeometry args={[cloudSize, cloudSize]} />
      <shaderMaterial
        transparent
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}
