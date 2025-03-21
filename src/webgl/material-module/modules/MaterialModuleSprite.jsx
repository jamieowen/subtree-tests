import { randomIntRange } from '@/helpers/MathUtils';

export const MaterialModuleSprite = memo(
  ({
    map,
    rows = 1,
    cols = 1,
    index, // undefined = random
  }) => {
    const _index = useMemo(() => {
      if (index == undefined) {
        return randomIntRange(0, rows * cols - 1);
      } else {
        return index;
      }
    }, [index]);

    const { material } = useMaterialModule({
      name: 'MaterialModuleSprite',
      uniforms: {
        tSprite: { type: 't', value: map },
        uSprite_Rows: { value: rows },
        uSprite_Cols: { value: cols },
        uSprite_Index: { value: _index },
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform sampler2D tSprite;
          uniform float uSprite_Rows;
          uniform float uSprite_Cols;
          uniform float uSprite_Index;

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
          pc_fragColor = getSpriteAt(tSprite, st, uSprite_Rows, uSprite_Cols, uSprite_Index);
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
      material.uniforms.uSprite_Index.value = _index;
    }, [_index]);

    return <></>;
  }
);
