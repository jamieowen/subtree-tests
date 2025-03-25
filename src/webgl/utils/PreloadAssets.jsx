import { fonts, models, textures } from '@/config/assets';
import { preloadFont } from 'troika-three-text';
import { getUrlString, getUrlBoolean } from '@/helpers/UrlParam';
// import { PromiseTimeout } from '@/helpers/PromiseTimeout';

// const characters = 'abcdefghijklmnopqrstuvwxyz0123456789,.?! @#$%^&*()_+-=';

import { useLoadingStore } from '@/stores/loading';
import { useAppStore } from '@/stores/app';

export const PreloadAssets = () => {
  let loadGroups = [
    //
    'critical',
    'cleaning',
    'filling',
    'grouping',
  ];

  const addLoadGroup = useLoadingStore((s) => s.addLoadGroup);
  loadGroups.forEach(addLoadGroup);

  let items = [];
  for (let loadGroup of loadGroups) {
    let manifest = useAssetManifest(loadGroup);
    items.push(...manifest);
  }

  const gl = useThree((state) => state.gl);
  const anisotropy = useMemo(() => {
    gl.capabilities.getMaxAnisotropy();
  }, [gl]);

  for (let item of items) {
    if (item.type == 'TEXTURE_KTX2') {
      item.asset.colorSpace = LinearSRGBColorSpace;
      item.asset.anisotropy = anisotropy;
      item.asset.wrapS = item.asset.wrapT = RepeatWrapping;
      // item.asset.needsUpdate = true;
      gl.initTexture(item.asset);
    }
  }

  return <></>;
};
