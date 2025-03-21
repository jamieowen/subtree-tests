import { KTX2Loader } from '@/libs/three/KTX2Loader';
import { IsObject } from '@react-three/drei';
import { useLoader } from '@react-three/fiber';
import { suspend } from 'suspend-react';

// const cdn = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master';
const cdn = '/libs';

export function useKTX2(input, basisPath = `${cdn}/basis/`) {
  const gl = useThree((state) => state.gl);
  const textures = useLoader(
    KTX2Loader,
    IsObject(input) ? Object.values(input) : input,
    (loader) => {
      loader.detectSupport(gl);
      loader.setTranscoderPath(basisPath);
    }
  );

  // https://github.com/mrdoob/three.js/issues/22696
  // Upload the texture to the GPU immediately instead of waiting for the first render
  useEffect(() => {
    const array = Array.isArray(textures) ? textures : [textures];

    array.forEach((texture) => {
      texture.colorSpace = LinearSRGBColorSpace;
      // gl.initTexture(texture);
    });
  }, [gl, textures]);

  if (IsObject(input)) {
    const keys = Object.keys(input);
    const keyed = {};
    keys.forEach((key) =>
      Object.assign(keyed, { [key]: textures[keys.indexOf(key)] })
    );
    return keyed;
  } else {
    return textures;
  }
}

useKTX2.preload = (url, basisPath = `${cdn}/basis/`) => {
  const gl = useThree((state) => state.gl);
  return useLoader.preload(KTX2Loader, url, (loader) => {
    loader.detectSupport(gl);
    loader.setTranscoderPath(basisPath);
  });
};

useKTX2.clear = (input) => useLoader.clear(KTX2Loader, input);
