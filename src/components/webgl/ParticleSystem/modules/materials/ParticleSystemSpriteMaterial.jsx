// ******************************************************************************************
//
// ParticleSystemSpriteMaterial
// - an ParticleSystem instanced mesh material for spritesheets (random sprite per instance)
//
// ******************************************************************************************

import CustomShaderMaterial from 'three-custom-shader-material';
import { MeshBasicMaterial } from 'three';
import particlesVert from '@/webgl/glsl/particles/material/particle.vert';
import normalEncoding from '@/webgl/glsl/utils/normalEncoding.glsl';

import range from '@/webgl/glsl/utils/range.glsl';

export const ParticleSystemSpriteMaterial = memo(
  forwardRef(
    (
      {
        vertexShader,
        fragmentShader,
        outline = false,
        map = null,
        rows = 1,
        cols = 1,
        color = 0xffffff,
        fallOff,
        ...props
      },
      ref
    ) => {
      // const { simulator, dataSize, refMesh } = useContext(ParticleSystemContext);

      const refMaterial = useRef(null);

      const _color = useColor(color);

      const shader = useMemo(() => {
        const defines = {};
        if (!!fallOff) {
          defines.HAS_FALLOFF = 1;
        }

        return {
          uniforms: {
            uOutline: { value: outline ? 1 : 0 },
            uTexture: { value: map },
            uRows: { value: rows },
            uCols: { value: cols },
            uFallOff: { value: fallOff ?? [0, 0, 0] },
            uColor: { value: _color },
          },
          defines,
          vertexShader: vertexShader || particlesVert,
          fragmentShader:
            fragmentShader ||
            /*glsl*/ `
          varying vec2 vUv;
          varying vec3 vvNormal;
          varying vec3 vWorldPos;
          varying float vProgress;
          flat varying vec2 vReference;
          varying float vIndex;


          uniform float uOutline;
          uniform sampler2D uTexture;
          uniform float uRows;
          uniform float uCols;
          uniform vec3 uFallOff;
          uniform vec3 uColor;

          ${range}
          ${normalEncoding}

          layout(location = 1) out vec4 gNormal;
          layout(location = 2) out vec4 gOutline;

          vec4 getSpriteAt(sampler2D diffuse, vec2 uv, float rows, float cols, float idx) {
            vec2 uvSprite = uv;
            // uvSprite.x = mod(uvSprite.x, 1.0 / cols) + floor(idx) / cols;
            // uvSprite.y = mod(uvSprite.y, 1.0 / rows) + floor(idx) / rows;
            uvSprite.x /= cols;
            uvSprite.y /= rows;

            float row = mod(floor(idx / cols), rows) / rows;
            float col = mod(idx, cols) / cols;
            uvSprite.x += col;
            uvSprite.y += row;
            return texture(diffuse, uvSprite);
          }

          void main() {

            // Out
            pc_fragColor = getSpriteAt(uTexture, vUv, uRows, uCols, vIndex);
            pc_fragColor.a *= smoothstep(0.0, 0.1, vProgress);

            if (pc_fragColor.a < 0.01) discard;
            // if (pc_fragColor.r +pc_fragColor.g + pc_fragColor.b == 0.) discard;

            // gNormal = gNormal;
            // gNormal.xy = normalEncode(vvNormal);
            gNormal.xy = normalEncode(vec3(0., 1., 0.));
            gNormal.w = uOutline;




            #ifdef HAS_FALLOFF
              float padding = uFallOff.z;
              float start = uFallOff.x;
              float end = uFallOff.y;
              
              float st = crange(vWorldPos.y, start - padding, start, 1., 0.);
              float en = crange(vWorldPos.y, end, end + padding, 0., 1.);

              float fallOff = st * en;
              pc_fragColor.a *= fallOff;
              pc_fragColor.rgb *= uColor;
              gNormal.a *= fallOff;
              gOutline = gOutline;
            #endif

          }
        `,
        };
      }, []);

      useEffect(() => {
        shader.uniforms.uOutline.value = outline ? 1 : 0;
      }, [outline]);

      useEffect(() => {
        shader.uniforms.uColor.value = _color;
      }, [_color]);

      return (
        <shaderMaterial
          ref={mergeRefs([refMaterial, ref])}
          side={DoubleSide}
          // transparent={true}
          {...shader}
          {...props}
          silent
        />
      );
    }
  )
);
