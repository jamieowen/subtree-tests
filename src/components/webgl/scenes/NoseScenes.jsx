import { ScrollProvider } from '@/contexts/scroll';
import {
  OrthographicCamera,
  RenderTexture as RenderTextureDrei,
  Hud,
  Trail,
  PerspectiveCamera,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { scenes, totalLength } from '@/components/webgl/scenes/config';

import { getUrlFloat, getUrlBoolean } from '@/helpers/UrlParam';
import { ui, three, hud } from '@/tunnels';
import { useEffect } from 'react';

export function NoseScenes({ ...props }) {
  const camera = useThree((s) => s.camera);
  const _scene = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    gl.compile(_scene, camera);
  }, []);

  // useFrame(() => {
  //   console.log('here');
  // });

  return (
    <>
      <three.Out />
    </>
  );
}
