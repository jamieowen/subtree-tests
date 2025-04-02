import { randomIntRange } from '@/helpers/MathUtils';
import blend from './blend.glsl';
import { urls } from '@/config/assets';

export const MaterialModuleFillingBottle = forwardRef(
  ({ rows = 4, cols = 16, frames = 12, fps = 24, progress = 0 }, ref) => {
    const [
      t_filling_bottle_body,
      t_filling_bottle_liquid,
      t_filling_bottle_foam,
      t_filling_bottle_logo,
      t_filling_bottle_mask,
      t_filling_bottle_shadow,
      t_filling_bottle_cap,
    ] = useAsset([
      urls.t_filling_bottle_body,
      urls.t_filling_bottle_liquid,
      urls.t_filling_bottle_foam,
      urls.t_filling_bottle_logo,
      urls.t_filling_bottle_mask,
      urls.t_filling_bottle_shadow,
      urls.t_filling_bottle_cap,
    ]);

    const { material } = useMaterialModule({
      name: 'MaterialModuleFillingBottle',
      uniforms: {
        tBottle_Body: { type: 't', value: t_filling_bottle_body },
        tBottle_Liquid: { type: 't', value: t_filling_bottle_liquid },
        tBottle_Foam: { type: 't', value: t_filling_bottle_foam },
        tBottle_Logo: { type: 't', value: t_filling_bottle_logo },
        tBottle_Mask: { type: 't', value: t_filling_bottle_mask },
        tBottle_Shadow: { type: 't', value: t_filling_bottle_shadow },
        tBottle_Cap: { type: 't', value: t_filling_bottle_cap },

        uBottle_Rows: { value: rows },
        uBottle_Cols: { value: cols },
        uBottle_Frames: { value: frames },
        uBottle_Fps: { value: fps },
        uBottle_Progress: { value: progress },
        uBottle_Filling: { value: 0.0 },
        uBottle_Filled: { value: 0.0 },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform sampler2D tBottle_Body;
          uniform sampler2D tBottle_Liquid;
          uniform sampler2D tBottle_Foam;
          uniform sampler2D tBottle_Logo;
          uniform sampler2D tBottle_Mask;
          uniform sampler2D tBottle_Shadow;
          uniform sampler2D tBottle_Cap;

          uniform float uBottle_Rows;
          uniform float uBottle_Cols;
          uniform float uBottle_Frames;
          uniform float uBottle_Fps;
          uniform float uBottle_Progress;
          uniform float uBottle_Filling;
          uniform float uBottle_Filled;

          ${blend}

          vec4 getSpriteAt(sampler2D diffuse, vec2 uv, float rows, float cols, float idx) {
            vec2 uvSprite = uv;
            uvSprite.x /= cols;
            uvSprite.y /= rows;

            float row = mod(floor(idx / cols), rows) / rows;
            float col = mod(idx, cols) / cols;
            uvSprite.x += col;
            uvSprite.y += row;
            return texture(diffuse, uvSprite);
          }

        `,
        main: /*glsl*/ `

          // MASK
          float mask = step(0.5, texture2D(tBottle_Mask, st).r);

          // BASE
          // vec4 color = vec4(1.0, 0.0, 0.0, 0.0);
          vec4 color = vec4(132. / 255., 183. / 255., 146. / 255., 0.0);

          // SHADOW
          vec4 shadow = texture2D(tBottle_Shadow, st);
          color.rgb = mix(color.rgb, shadow.rgb, shadow.a);
          color.a = mix(color.a, shadow.a, shadow.a);

          // PROGRESS
          // float progress = (sin(uTime) + 1.0) * 0.5;
          float progress = uBottle_Progress;
          vec2 uvl = st;
          uvl.y += -0.77 + 0.77 * progress;

          // FRAME
          float frameNum = mod(floor(uTime * uBottle_Fps), uBottle_Frames);

          // WAVE
          uvl.y += sin((uvl.x + uTime * 1.0) * 9.0) * 0.0005;
          uvl.y += sin((uvl.x + uTime * 1.0) * 6.0) * 0.002;

          // LIQUID
          vec4 liquid = getSpriteAt(
            tBottle_Liquid, 
            uvl, 
            uBottle_Rows, 
            uBottle_Cols, 
            frameNum
          );
          color.rgb = mix(color.rgb, liquid.rgb, liquid.a * mask);
          color.a = mix(color.a, liquid.a, liquid.a * mask);

          // FOAM
          vec4 foam = getSpriteAt(
            tBottle_Foam, 
            uvl, 
            uBottle_Rows, 
            uBottle_Cols, 
            frameNum
          );
          color.rgb = mix(color.rgb, foam.rgb, foam.a * mask);

          // GLASS
          vec4 glass = texture2D(tBottle_Body, st);
          color.rgb = blendHardLight(color.rgb, glass.rgb, glass.a);
          color.a = blendAdd(color.a, glass.a);

          // LOGO
          vec4 logo = texture2D(tBottle_Logo, st);
          color.rgb = mix(color.rgb, logo.rgb, logo.a);
          color.a = mix(color.a, logo.a, logo.a);

          // CAP
          vec4 cap = texture2D(tBottle_Cap, st);
          color.rgb = mix(color.rgb, cap.rgb, cap.a * uBottle_Filled);
          color.a = mix(color.a, cap.a, cap.a * uBottle_Filled);

          pc_fragColor = color;


          // LINE
          float dpr = uDpr;
          float resY = uResolution.y * dpr;
          float pos = 0.25;
          pos = crange(pos, 0.0, 1.0, 0.15, 0.9);

          // float thickness = 0.1;
          // float posA = pos - thickness;
          // float posB = pos;

          float thickness = 5.0;
          float thick = thickness / resY;
          float posA = round((pos - thick) * resY) / resY;
          float posB = round((pos + thick) * resY) / resY;

          vec3 lineColor = vec3(1.0, 0.0, 0.0);
          if (uBottle_Progress >= 0.75 && uBottle_Progress <= 1.0) {
            lineColor = vec3(0.0, 1.0, 0.0);
          }

          if (st.y > posA && st.y < posB && uBottle_Filling == 1.0) {
            // pc_fragColor.rgb = blendMultiply(pc_fragColor.rgb, vec3(lineColor), 0.5);
            // pc_fragColor.a = 1.0;

            pc_fragColor.rgb = lineColor;
          }
          
        `,
      },
    });

    useImperativeHandle(
      ref,
      () => ({
        get progress() {
          return material.uniforms['uBottle_Progress'].value;
        },
        set progress(val) {
          material.uniforms['uBottle_Progress'].value = val;
        },
        get filling() {
          return material.uniforms['uBottle_Filling'].value;
        },
        set filling(val) {
          material.uniforms['uBottle_Filling'].value = val ? 1.0 : 0.0;
        },
        get filled() {
          return material.uniforms['uBottle_Filled'].value;
        },
        set filled(val) {
          material.uniforms['uBottle_Filled'].value = val ? 1.0 : 0.0;
        },
      }),
      [material]
    );

    return <></>;
  }
);
