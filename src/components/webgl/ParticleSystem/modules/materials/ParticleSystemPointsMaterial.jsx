// ******************************************************************************************
//
// ParticleSystemPointsMaterial
// - an ParticleSystem instanced mesh material for points
//
// ******************************************************************************************

import CustomShaderMaterial from 'three-custom-shader-material';
import { AdditiveBlending, PointsMaterial } from 'three';
import pointsVert from '@/webgl/glsl/particles/points/points.vert';
import pointsFrag from '@/webgl/glsl/particles/points/points.frag';
import { urls } from '@/config/assets';

export const ParticleSystemPointsMaterial = ({
  size = 10,
  color = 0xffffff,
  rounded = true,
  randomSize = false,
  map = null,
  outline = false,
  ...props
}) => {
  const { simulator, dataSize, refMesh } = useContext(ParticleSystemContext);

  const refMaterial = useRef(null);

  // const tMap = useAsset(urls.t_particle);
  const _color = useColor(color);

  const shader = useMemo(() => {
    const defines = {};
    if (rounded) {
      defines.USE_ROUNDED = 1;
    }
    if (randomSize) {
      defines.RANDOM_SIZE = 1;
    }
    return {
      vertexShader: pointsVert,
      fragmentShader: pointsFrag,
      uniforms: {
        uPointSize: { value: size },
        uPointColor: { value: _color },
        uPointAlpha: { value: 1 },
        uPointOutline: { value: outline ? 1.0 : 0.0 },
        tMap: { value: map },
      },
      defines,
    };
  }, []);

  useEffect(() => {
    shader.uniforms.uPointSize.value = size;
  }, [size]);

  useEffect(() => {
    shader.uniforms.uPointColor.value = _color;
  }, [_color]);

  useEffect(() => {
    shader.uniforms.uPointOutline.value = outline ? 1.0 : 0.0;
  }, [outline]);

  useEffect(() => {
    if (rounded) {
      shader.defines.USE_ROUNDED = 1;
    } else {
      delete shader.defines.USE_ROUNDED;
    }
  }, [rounded]);

  useEffect(() => {
    if (randomSize) {
      shader.defines.RANDOM_SIZE = 1;
    } else {
      delete shader.defines.RANDOM_SIZE;
    }
  }, [randomSize]);

  useEffect(() => {
    if (map) {
      shader.defines.HAS_MAP = 1;
    } else {
      delete shader.defines.HAS_MAP;
    }
  }, [map]);

  return (
    <shaderMaterial
      ref={refMaterial}
      args={[shader]}
      attach="material"
      // blending={AdditiveBlending}
      // transparent={true}
      // depthWrite={false}
      {...props}
    />
  );
};
