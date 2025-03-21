import quaternionToMatrix4 from '@/webgl/glsl/utils/quaternionToMatrix4.glsl';
import { DataTexture, FloatType, RGBAFormat } from 'three';

import range from '@/webgl/glsl/utils/range.glsl';
import conditionals from '@/webgl/glsl/utils/conditionals.glsl';

export const MaterialModuleParticleRibbon = ({ count = 1 }) => {
  const { _key, simulator, dataSize, refMesh, maxParticles } = useContext(
    ParticleSystemContext
  );

  const segments = useMemo(() => maxParticles / count, [maxParticles, count]);

  const tIndices = suspend(async () => {
    const data = new Float32Array(dataSize * dataSize * 4);

    for (let i = 0; i < data.length / 4; i++) {
      data[i * 4 + 0] = i % segments; // CHAIN: particle index within a line (e.g. 0 to segments - 1)
      data[i * 4 + 1] = Math.floor(i / segments); // LINE: particle line number (0 to count)
      data[i * 4 + 2] = i % segments == 0 ? 1 : 0; // HEAD: is head of line
      data[i * 4 + 3] = 1; // nothing
    }

    let dt = new DataTexture(data, dataSize, dataSize, RGBAFormat, FloatType);
    dt.needsUpdate = true;
    return dt;
  }, [`${_key}-MaterialModuleParticleRibbon-${dataSize}`]);

  useEffect(() => {
    return () => {
      tIndices.dispose();
      clear([`${_key}-MaterialModuleParticleRibbon-${dataSize}`]);
    };
  }, [tIndices]);

  useMaterialModule({
    name: 'MaterialModuleParticleRibbon',
    uniforms: {
      uThickness: { value: 1 },
      tIndices: { value: tIndices },
      textureSize: { value: dataSize },
      lineSegments: { value: segments },
      uTaper: { value: 0 },
    },
    vertexShader: {
      setup: /*glsl*/ `
        attribute float angle;
        attribute vec2 tuv;
        attribute float cIndex;
        attribute float cNumber;

        uniform float uThickness;
        uniform float uTaper;
        uniform sampler2D tIndices;
        uniform float textureSize;
        uniform float lineSegments;

        varying float vLength;

        ${conditionals}

        vec2 getUVFromIndex(float index, float textureSize) {
            float size = textureSize;
            vec2 ruv = vec2(0.0);
            float p0 = index / size;
            float y = floor(p0);
            float x = p0 - y;
            ruv.x = x;
            ruv.y = y / size;
            return ruv;
        }

        float getIndex(float line, float chain, float _lineSegments) {
            return (line * _lineSegments) + chain;
        }
      `,
      main: /*glsl*/ `

      // if (vProgress <= 0. || vProgress >= 1.0) {
      //   gl_Position = vec4(0.0);
      //   return;
      // }

        float headIndex = getIndex(cNumber, 0.0, lineSegments);
        vec2 iuv = getUVFromIndex(headIndex, textureSize);

        float scale = .5;

        vec2 volume = vec2(uThickness, 0.065 * scale);

        float posIndex = getIndex(cNumber, cIndex, lineSegments);
        float nextIndex = getIndex(cNumber, cIndex + 1., lineSegments);

        vec3 current = texture2D(uPositionTexture, getUVFromIndex(posIndex, textureSize)).xyz;
        vec3 next = texture2D(uPositionTexture, getUVFromIndex(nextIndex, textureSize)).xyz;

        vec3 nextLife = texture2D(uLifeTexture, getUVFromIndex(nextIndex, textureSize)).xyz;

        vec3 T = normalize(next - current);
        vec3 B = normalize(cross(T, next + current));
        vec3 N = -normalize(cross(B, T));

        float tubeAngle = angle;
        float circX = cos(tubeAngle);
        float circY = sin(tubeAngle);

        vLength = cIndex / (lineSegments / 1.0);

        volume *= mix(
          crange(vLength, 1.0 - uTaper, 1.0, 1.0, 0.0) * crange(vLength, 0.0, uTaper, 0.0, 1.0), 
          1.0, 
          when_eq(uTaper, 0.0)
        );
        
        vec3 objectNormal = normalize(B * circX + N * circY);
        transformed = current + B * volume.x * circX + N * volume.y * circY;

        vec3 transformedNormal = normalMatrix * objectNormal;
        vec4 worldPos = modelMatrix * vec4(transformed, 1.0);
        mvPosition = viewMatrix * worldPos;
        gl_Position = projectionMatrix * mvPosition;

        vNormal = normalize(transformedNormal);
        vUv = tuv.yx;
        // vViewPosition = -mvPosition.xyz;
        vPosition = transformed;
        vWorldPos = worldPos.xyz;

      `,
    },
  });

  return <></>;
};
