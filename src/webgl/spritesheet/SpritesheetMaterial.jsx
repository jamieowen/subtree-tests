import CustomShaderMaterial from 'three-custom-shader-material';
import { MeshBasicMaterial } from 'three';

import baseVert from '@/webgl/glsl/utils/baseProjection.vert';
import crop from '@/webgl/glsl/utils/crop.glsl';
import sprite from '@/webgl/glsl/utils/sprite.glsl';
import normalEncoding from '@/webgl/glsl/utils/normalEncoding.glsl';

export const SpritesheetMaterial = forwardRef(
  (
    {
      //
      baseMaterial = MeshBasicMaterial,
      config,
      spritesheet,
      frame,
      opacity = 1,
      outlineColor = 0x000000,
      ...props
    },
    ref
  ) => {
    const refMaterial = useRef(null);

    const _outlineColor = useColor(outlineColor);

    const uniforms = useMemo(() => {
      return {
        uTexture: { type: 't', value: null },
        uFrame: { value: new Vector4() },
        uResTex: { value: new Vector2() },
        uSourceSize: { value: new Vector2() },
        uSpriteSourceSize: { value: new Vector4() },
        uAlpha: { value: opacity },
        uOutlineColor: { value: _outlineColor },
      };
    }, []);

    const shader = useMemo(() => {
      return {
        baseMaterial,
        uniforms,
        vertexShader: baseVert,
        fragmentShader: /*glsl*/ `
          varying vec2 vUv;

          uniform sampler2D uTexture;
          uniform vec4 uFrame;
          uniform vec2 uResTex;
          uniform vec2 uSourceSize;
          uniform vec4 uSpriteSourceSize;
          uniform float uAlpha;
          uniform vec3 uOutlineColor;

          layout(location = 1) out vec4 gNormal;
          layout(location = 2) out vec4 gOutline;

          ${sprite}
          ${normalEncoding}

          void main() {
              vec4 tDiffuse = getSpriteAtFrame(uTexture, vUv, uFrame, uResTex, uSpriteSourceSize, uSourceSize);
              tDiffuse.a *= uAlpha;

              if (tDiffuse.a < 0.5) discard;

              gl_FragColor = tDiffuse;

              // csm_DiffuseColor = tDiffuse;
              // gNormal.xy = normalEncode(vec3(0.,0.,1.));
              // gNormal.w = 1.0;
              // gOutline = vec4(uOutlineColor, 1.0);
          }
        
        `,
      };
    }, [uniforms]);

    useFrame(() => {
      const frame = spritesheet.currentFrame;

      uniforms.uTexture.value = frame.atlas;
      uniforms.uFrame.value = Object.values(frame.frame);
      uniforms.uResTex.value.set(frame.size.w, frame.size.h);
      uniforms.uSourceSize.value.set(frame.sourceSize.w, frame.sourceSize.h);
      uniforms.uSpriteSourceSize.value.set(
        frame.spriteSourceSize.x,
        frame.spriteSourceSize.y,
        frame.spriteSourceSize.w,
        frame.spriteSourceSize.h
      );
    });

    useEffect(() => {
      uniforms.uAlpha.value = opacity;
    }, [opacity]);

    return (
      // <CustomShaderMaterial
      //   ref={mergeRefs([refMaterial, ref])}
      //   {...shader}
      //   side={DoubleSide}
      //   alphaTest={0.5}
      //   {...props}
      //   // silent
      // />

      <shaderMaterial
        ref={mergeRefs([refMaterial, ref])}
        {...shader}
        side={DoubleSide}
        alphaTest={0.5}
        {...props}
      />
    );
  }
);
