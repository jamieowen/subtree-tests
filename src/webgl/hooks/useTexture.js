import { useTexture as useTextureDrei } from '@react-three/drei';
// import AssetService from '@/services/AssetService';
// import { ids } from '@/config/assets';

export const useTexture = (_input, opts = {}) => {
  const input = Array.isArray(_input) ? _input : [_input];

  const inputOther = input.filter((i) => {
    if (!i) {
      console.warn('useTexture is null', i);
      return false;
    }
    return !i.endsWith('.ktx2');
  });
  const inputKtx = input.filter((i) => {
    if (!i) {
      console.warn('useTexture is null', i);
      return false;
    }
    return i.endsWith('.ktx2');
  });

  // const inputKtxId = inputKtx.map((i) => ids[i]);
  // const texturesKtx = AssetService.getAssets(inputKtxId);
  // console.log(100, inputKtxId, texturesKtx);

  const texturesOther = inputOther.length ? useTextureDrei(inputOther) : [];
  const texturesKtx = inputKtx.length ? useKTX2(inputKtx) : [];
  texturesKtx.forEach((t, idx) => {
    t.name = inputKtx[idx];
  });

  // Sort to match input
  const textures = [...texturesOther, ...texturesKtx];
  const sorted = input.map((i) => {
    return textures.find((t) => {
      if (t.name == i) return true;
      if (t?.source?.data?.currentSrc?.includes(i)) return true;
      return false;
    });
  });

  // OPTIONS
  // useEffect(() => {
  //   if (Object.values(opts).length == 0) return;
  //   sorted.forEach((t) => {
  //     for (const key in opts) {
  //       t[key] = opts[key];
  //     }
  //     t.needsUpdate = true;
  //   });
  // }, [sorted, opts]);

  // ANISO
  // const gl = useThree((state) => state.gl);
  // const anisotropy = useMemo(() => {
  //   return gl.capabilities.getMaxAnisotropy();
  // }, [gl]);
  // console.log('anisotropy', anisotropy);

  // useEffect(() => {
  //   sorted.forEach((t) => {
  //     // t.anisotropy = anisotropy;
  //     t.colorSpace = LinearSRGBColorSpace;
  //     // t.needsUpdate = true;
  //   });
  // }, [sorted]);

  if (Array.isArray(_input)) {
    return sorted;
  } else {
    return sorted[0];
  }
};

useTexture.preload = (_input) => {
  const input = useMemo(() => {
    if (Array.isArray(_input)) {
      return _input;
    } else {
      return [_input];
    }
  }, [_input]);

  const inputOther = useMemo(() => {
    return input.filter((i) => !i.endsWith('.ktx2'));
  }, [input]);
  const inputKtx = useMemo(() => {
    return input.filter((i) => i.endsWith('.ktx2'));
  }, [input]);

  useTextureDrei.preload(inputOther);
  useKTX2.preload(inputKtx);
};
