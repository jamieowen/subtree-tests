import { getUrlBoolean } from '@/helpers/UrlParam';
import { Stats, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing';
import { ui } from '@/tunnels';
import { useThree } from '@react-three/fiber';
import usePerformance from './hooks/usePerformance';
import { useAppStore } from '@/stores/app';

import { three, hud } from '@/tunnels';
import { NoseEffects } from './NoseEffects';

const stats = getUrlBoolean('stats', false);
const perf = getUrlBoolean('perf', false);

export const Nose = () => {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const viewport = useThree((state) => state.viewport);

  // COLOR SPACE
  useEffect(() => {
    gl.outputColorSpace = LinearSRGBColorSpace;
  }, [gl]);

  // PERFORMANCE
  const { update } = usePerformance(gl, perf);
  useFrame(update);

  const { completed } = useAssetProgress();

  return (
    <>
      <MouseTracker />
      <Suspense>
        <PreloadAssets />
      </Suspense>

      {/* <FsTriangleCamera />

      {completed && (
        <Suspense>
          <>
            <NoseScenes />
          </>
        </Suspense>
      )}
      <Render /> */}

      {/* <NoseEffects /> */}

      {/* <PerspectiveCamera />

      <mesh position={[0, 0, -10]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color="red" />
      </mesh> */}
      <NoseScenes />

      {stats && <Stats />}
      <GsapSync />
    </>
  );
};
