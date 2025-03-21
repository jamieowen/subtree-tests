import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import { create } from 'zustand';

const sceneTextureStore = create(() => ({
  current: null,
  previous: null,
  //TEMP:
  enabled: true,
}));

export const DISABLE_RENDER_TO_TEXTURE_LAYER = 2;

export default function useRenderSceneToTexture({
  camera: _camera,
  disableLayers = [DISABLE_RENDER_TO_TEXTURE_LAYER],
} = {}) {
  const { gl } = useThree();

  const config = {
    multisample: false,
    stencilBuffer: false,
    depth: false,
  };
  const [rtA, rtB] = [useFBO(config), useFBO(config)];
  const [currentRT, previousRT] = [useRef(), useRef()];

  const pingpong = useRef(false);

  const renderToTexture = useCallback(
    (scene, camera) => {
      currentRT.current = pingpong ? rtA : rtB;
      previousRT.current = pingpong ? rtB : rtA;

      if (disableLayers.length) {
        disableLayers.forEach((l) => camera.layers.disable(l));
      }

      gl.setRenderTarget(currentRT.current);
      gl.render(scene, camera);

      if (disableLayers.length) {
        disableLayers.forEach((l) => camera.layers.enable(l));
      }

      gl.setRenderTarget(null);

      sceneTextureStore.setState({
        current: currentRT.current,
        previous: previousRT.current,
      });

      pingpong.current = !pingpong.current;
    },
    [currentRT, disableLayers, gl, previousRT, rtA, rtB]
  );

  useFrame(({ scene, camera }) => {
    if (!sceneTextureStore.getState().enabled) return;

    renderToTexture(scene, camera);
  });

  return {
    renderToTexture,
    store: sceneTextureStore,
  };
}
