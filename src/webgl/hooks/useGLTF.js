// import { useGLTF as useGLTFDrei } from '@react-three/drei';
import { BufferAttribute } from 'three';

import { Texture } from 'three';

// import { surfaceFinder } from '@/webgl/utils/surfaceFinder';

export const useGLTF = (...props) => {
  const gltf = useGLTF2(...props);

  useEffect(() => {
    // FIND SURFACE ID
    // gltf.scene.traverse((node) => {
    //   if (node.type == 'Mesh') {
    //     const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
    //     node.geometry.setAttribute(
    //       'aSurface',
    //       new BufferAttribute(colorsTypedArray, 4)
    //     );
    //   }
    // });

    // DELETE MATERIALS
    if (!gltf.materials) return;
    for (let material of Object.values(gltf.materials)) {
      for (let key of Object.keys(material)) {
        if (material[key]?.isTexture || material[key] instanceof Texture) {
          // console.log(key, 'isTexture', material[key]);
          material[key].dispose();
          delete material[key];
        }
      }
      material.dispose();
    }
  }, [gltf]);

  return gltf;
};

useGLTF.preload = useGLTF2.preload;
useGLTF.clear = useGLTF2.clear;
useGLTF.setDecoderPath = useGLTF2.setDecoderPath;
