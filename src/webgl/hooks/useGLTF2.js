import { useKTX2 } from '@react-three/drei';
import { DRACOLoader, GLTFLoader, MeshoptDecoder } from 'three-stdlib';
import { KTX2Loader } from '@/libs/three/KTX2Loader';
import { Texture } from 'three';

let dracoLoader = null;

// let decoderPath = 'https://www.gstatic.com/draco/versioned/decoders/1.5.5/';
let decoderPath = '/libs/draco/';

function extensions(useDraco, useMeshopt, useKTX2, extendLoader) {
  return (loader) => {
    if (extendLoader) {
      extendLoader(loader);
    }

    if (useDraco) {
      if (!dracoLoader) {
        dracoLoader = new DRACOLoader();
      }
      dracoLoader.setDecoderPath(
        typeof useDraco === 'string' ? useDraco : decoderPath
      );
      loader.setDRACOLoader(dracoLoader);
    }

    if (useMeshopt) {
      loader.setMeshoptDecoder(
        typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder
      );
    }

    if (useKTX2) {
      loader.setKTX2Loader(KTX2Loader);
    }
  };
}

export function useGLTF2(
  path,
  useDraco = true,
  useMeshOpt = true,
  useKTX2 = true,
  extendLoader
) {
  return useLoader(
    GLTFLoader,
    path,
    extensions(useDraco, useMeshOpt, useKTX2, extendLoader)
  );
}

useGLTF2.preload = (
  path,
  useDraco = true,
  useMeshOpt = true,
  useKTX2 = true,
  extendLoader
) => {
  useLoader.preload(
    GLTFLoader,
    path,
    extensions(useDraco, useMeshOpt, useKTX2, extendLoader)
  );
};

useGLTF2.clear = (input) => {
  useLoader.clear(GLTFLoader, input);
};

useGLTF2.setDecoderPath = (path) => {
  decoderPath = path;
};
