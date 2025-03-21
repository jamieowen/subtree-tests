import AssetService from '@/services/AssetService';
import { ids } from '@/config/assets';
import { BufferAttribute } from 'three';

export const buildGraph = (object) => {
  const data = { nodes: {}, materials: {} };
  if (object) {
    object.traverse((obj) => {
      // NAME
      if (obj.name) data.nodes[obj.name] = obj;

      // MATERIAL
      if (obj.material && !data.materials[obj.material.name])
        data.materials[obj.material.name] = obj.material;

      // SURFACE ID
      // if (obj.type == 'Mesh') {
      //   const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(obj);
      //   obj.geometry.setAttribute(
      //     'aSurface',
      //     new BufferAttribute(colorsTypedArray, 4)
      //   );
      // }
    });
  }
  return data;
};

export const useAsset = (_input) => {
  const input = useMemo(
    () => (Array.isArray(_input) ? _input : [_input]),
    [_input]
  );

  return suspend(async () => {
    const inputIds = input.map((i) => ids[i]);
    let assets = AssetService.getAssets(inputIds);

    if (!assets[0]) {
      console.error('Asset not found', input);
    }

    if (input.length == 1 && assets[0].scene) {
      Object.assign(assets[0], buildGraph(assets[0].scene));
      return assets[0];
    }

    if (Array.isArray(_input)) {
      return assets;
    } else {
      return assets[0];
    }
  }, input);
};
