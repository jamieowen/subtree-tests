import { randomIntRange } from '@/helpers/MathUtils';

export const MaterialModuleSpriteAnimated = forwardRef(
  (
    {
      map,
      rows = 1,
      cols = 1,
      frames = 1,
      fps = 12,
      frame = 0,
      auto = false,
      hardLight = false,
      blend = `pc_fragColor.rgb = frameColor.rgb;`,
    },
    ref
  ) => {
    const { material } = useMaterialModule({
      name: 'MaterialModuleSpriteAnimated',
      uniforms: {
        tSprite: { type: 't', value: map },
        uSprite_Rows: { value: rows },
        uSprite_Cols: { value: cols },
        uSprite_Frames: { value: frames },
        uSprite_Fps: { value: fps },
        uSprite_Frame: { value: frame },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform sampler2D tSprite;
          uniform float uSprite_Rows;
          uniform float uSprite_Cols;
          uniform float uSprite_Frames;
          uniform float uSprite_Fps;
          uniform float uSprite_Frame;


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


          float blendOverlay(float base, float blend) {
            return base<0.5?(2.0*base*blend):(1.0-2.0*(1.0-base)*(1.0-blend));
          }
          
          vec3 blendOverlay(vec3 base, vec3 blend) {
            return vec3(blendOverlay(base.r,blend.r),blendOverlay(base.g,blend.g),blendOverlay(base.b,blend.b));
          }
          
          vec3 blendOverlay(vec3 base, vec3 blend, float opacity) {
            return (blendOverlay(base, blend) * opacity + base * (1.0 - opacity));
          }

          vec3 blendHardLight(vec3 base, vec3 blend) {
            return blendOverlay(blend,base);
          }
          
          vec3 blendHardLight(vec3 base, vec3 blend, float opacity) {
            return (blendHardLight(base, blend) * opacity + base * (1.0 - opacity));
          }

          float blendLinearBurn(float base, float blend) {
            // Note : Same implementation as BlendSubtractf
            return max(base+blend-1.0,0.0);
          }
          
          vec3 blendLinearBurn(vec3 base, vec3 blend) {
            // Note : Same implementation as BlendSubtract
            return max(base+blend-vec3(1.0),vec3(0.0));
          }
          
          vec3 blendLinearBurn(vec3 base, vec3 blend, float opacity) {
            return (blendLinearBurn(base, blend) * opacity + base * (1.0 - opacity));
          }

          float blendLinearDodge(float base, float blend) {
            // Note : Same implementation as BlendAddf
            return min(base+blend,1.0);
          }
          
          vec3 blendLinearDodge(vec3 base, vec3 blend) {
            // Note : Same implementation as BlendAdd
            return min(base+blend,vec3(1.0));
          }
          
          vec3 blendLinearDodge(vec3 base, vec3 blend, float opacity) {
            return (blendLinearDodge(base, blend) * opacity + base * (1.0 - opacity));
          }

          float blendLinearLight(float base, float blend) {
            return blend<0.5?blendLinearBurn(base,(2.0*blend)):blendLinearDodge(base,(2.0*(blend-0.5)));
          }
          
          vec3 blendLinearLight(vec3 base, vec3 blend) {
            return vec3(blendLinearLight(base.r,blend.r),blendLinearLight(base.g,blend.g),blendLinearLight(base.b,blend.b));
          }
          
          vec3 blendLinearLight(vec3 base, vec3 blend, float opacity) {
            return (blendLinearLight(base, blend) * opacity + base * (1.0 - opacity));
          }

        `,
        main: /*glsl*/ `
          float frameNum = uSprite_Frame;
          // float frameNum = 15.0;
          vec4 frameColor = getSpriteAt(
            tSprite, 
            st, 
            uSprite_Rows, 
            uSprite_Cols, 
            frameNum
          );

          pc_fragColor.a = frameColor.a;

          // pc_fragColor.rgb = blendHardLight(vec3(132. / 255., 183. / 255., 146. / 255.), frameColor.rgb, frameColor.a);
          // pc_fragColor.rgb = blendHardLight(vec3(1.0,1.0,1.0), frameColor.rgb, frameColor.a);
          // pc_fragColor.rgb = blendLinearLight(vec3(1.0, 0.0, 0.0), frameColor.rgb);
          // pc_fragColor.rgb = frameColor.rgb;
          ${blend}
        `,
      },
    });

    useEffect(() => {
      material.uniforms.tSprite.value = map;
    }, [map]);
    useEffect(() => {
      material.uniforms.uSprite_Rows.value = rows;
    }, [rows]);
    useEffect(() => {
      material.uniforms.uSprite_Cols.value = cols;
    }, [cols]);
    useEffect(() => {
      material.uniforms.uSprite_Frames.value = frames;
    }, [frames]);
    useEffect(() => {
      material.uniforms.uSprite_Fps.value = fps;
    }, [fps]);
    useEffect(() => {
      material.uniforms.uSprite_Frame.value = frame;
    }, [frame]);

    useImperativeHandle(
      ref,
      () => ({
        get material() {
          return material;
        },
        get map() {
          return material.uniforms['tSprite'].value;
        },
        set map(val) {
          material.uniforms['tSprite'].value = val;
        },
        get row() {
          return material.uniforms['uSprite_Rows'].value;
        },
        set row(val) {
          material.uniforms['uSprite_Rows'].value = val;
        },
        get col() {
          return material.uniforms['uSprite_Cols'].value;
        },
        set col(val) {
          material.uniforms['uSprite_Cols'].value = val;
        },
        get frames() {
          return material.uniforms['uSprite_Frames'].value;
        },
        set frames(val) {
          material.uniforms['uSprite_Frames'].value = val;
        },
        get fps() {
          return material.uniforms['uSprite_Fps'].value;
        },
        set fps(val) {
          material.uniforms['uSprite_Fps'].value = val;
        },
        get frame() {
          return material.uniforms['uSprite_Frame'].value;
        },
        set frame(val) {
          material.uniforms['uSprite_Frame'].value = Math.floor(val);
        },
        get progress() {
          return material.uniforms['uSprite_Frame'].value / frames;
        },
        set progress(val) {
          let f = Math.floor(val * (frames - 1));

          // console.log('MaterialModuleSpriteAnimated.set progress', val, f);
          material.uniforms['uSprite_Frame'].value = f;
        },
      }),
      [material]
    );

    return <></>;
  }
);
