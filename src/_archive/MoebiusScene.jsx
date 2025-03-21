import {
  //
  Box,
  Sphere,
  Ring,
  PresentationControls,
  Select,
  Grid,
  OrthographicCamera,
  RenderTexture as RenderTextureDrei,
} from '@react-three/drei';

import { HoverControls } from '@/webgl/controls/HoverControls';
import { urls } from '@/config/assets';
import { grey } from '@/webgl/materials';
import { map } from '@/helpers/MathUtils';
import { folder, useControls } from 'leva';
import { fullscreenTriangle } from '@/webgl/utils/misc';

export const MoebiusScene = ({ children, ...props }) => {
  const fsTriangle = useMemo(() => {
    return fullscreenTriangle();
  }, []);

  return (
    <>
      <FsTriangleCamera />
      <mesh>
        {/* <primitive geometry={fsTriangle} attach="geometry" /> */}
        <planeGeometry
          attach="geometry"
          args={[2, 2]}
        />
        <meshBasicMaterial color={'red'}>
          {/* <RenderTextureDrei>{children}</RenderTextureDrei> */}
        </meshBasicMaterial>
      </mesh>

      {/* {children} */}
    </>
  );
};
