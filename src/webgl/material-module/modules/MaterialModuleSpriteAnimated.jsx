import { randomIntRange } from '@/helpers/MathUtils';

export const MaterialModuleSpriteAnimated = ({
  map,
  rows = 1,
  cols = 1,
  frames = 1,
  fps = 12,
}) => {
  const { material } = useMaterialModule({
    name: 'MaterialModuleSpriteAnimated',
    uniforms: {
      tSprite: { type: 't', value: map },
      uSprite_Rows: { value: rows },
      uSprite_Cols: { value: cols },
      uSprite_Frames: { value: frames },
      uSprite_Fps: { value: fps },
    },
    fragmentShader: {
      setup: /*glsl*/ `
          uniform sampler2D tSprite;
          uniform float uSprite_Rows;
          uniform float uSprite_Cols;
          uniform float uSprite_Frames;
          uniform float uSprite_Fps;

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

        `,
      main: /*glsl*/ `

          float frameNum = mod(floor(uTime * uSprite_Fps), uSprite_Frames);
          pc_fragColor = getSpriteAt(
            tSprite, 
            st, 
            uSprite_Rows, 
            uSprite_Cols, 
            frameNum
          );
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

  return <></>;
};
