import { Canvas } from '@react-three/fiber';
import { getUrlFloat } from '@/helpers/UrlParam';
import Env from '@/helpers/Env';

export const useDpr = create(() => {
  let dpr = Math.min(window.devicePixelRatio, Env.mobile ? 2 : 1.65);
  return getUrlFloat('dpr', dpr);
});

export function Webgl({ ...props }) {
  const dpr = useDpr();

  return (
    <Canvas
      dpr={dpr}
      gl={{
        powerPreference: 'high-performance',
        antialias: true,
        depth: true,
        alpha: true,
        stencil: true,
        // shadows: 'basic',
      }}
      flat={true}
    >
      <Nose />
    </Canvas>
  );
}
