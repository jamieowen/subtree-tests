import { useContext, useMemo } from 'react';
import {
  BoxGeometry,
  BufferGeometry,
  BufferAttribute,
  DataTexture,
  FloatType,
  InstancedBufferAttribute,
  RGBAFormat,
  DoubleSide,
} from 'three';
import { ParticleSystemContext } from '../../context';
import range from '@/webgl/glsl/utils/range.glsl';
import curl from '@/webgl/glsl/utils/curl.glsl';

import conditionals from '@/webgl/glsl/utils/conditionals.glsl';

const vertexShader = /*glsl*/ `
    precision mediump float;

    attribute vec2 reference;
    attribute float angle;
    attribute vec2 tuv;
    attribute float cIndex;
    attribute float cNumber;
    // attribute float cNumber;

    varying vec2 vUv;
    flat varying vec2 vReference;
    varying float vLife;
    varying float vLength;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vPos;
    varying vec3 vWorldPos;
    varying float vIndex;

    uniform float uThickness;
    uniform float uTaper;
    uniform float uTime;
    uniform sampler2D uLifeTexture;
    uniform sampler2D uPositionTexture;
    uniform sampler2D tIndices;
    uniform float textureSize;
    uniform float lineSegments;

    ${range}
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

    void main() {
        float headIndex = getIndex(cNumber, 0.0, lineSegments);
        vec2 iuv = getUVFromIndex(headIndex, textureSize);

        float life = texture2D(uLifeTexture, iuv).x;
        float scale = .5;

        vec2 volume = vec2(uThickness, 0.065 * scale);

        float posIndex = getIndex(cNumber, cIndex, lineSegments);
        float nextIndex = getIndex(cNumber, cIndex + 1.0, lineSegments);

        vec3 current = texture2D(uPositionTexture, getUVFromIndex(posIndex, textureSize)).xyz;
        vec3 next = texture2D(uPositionTexture, getUVFromIndex(nextIndex, textureSize)).xyz;    

        vec3 T = normalize(next - current);
        vec3 B = normalize(cross(T, next + current));
        vec3 N = -normalize(cross(B, T));

        float tubeAngle = angle;
        float circX = cos(tubeAngle);
        float circY = sin(tubeAngle);

        vLength = cIndex / (lineSegments / 2.0);
        vIndex = cIndex;

        volume *= mix(
          crange(vLength, 1.0 - uTaper, 1.0, 1.0, 0.0) * crange(vLength, 0.0, uTaper, 0.0, 1.0), 
          1.0, 
          when_eq(uTaper, 0.0)
        );
        
        vec3 objectNormal = normalize(B * circX + N * circY);
        vec3 transformed = current + B * volume.x * circX + N * volume.y * circY;

        vec3 transformedNormal = normalMatrix * objectNormal;
        vec3 pos = transformed;
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vec4 mvPosition = viewMatrix * worldPos;
        gl_Position = projectionMatrix * mvPosition;

        vNormal = normalize(transformedNormal);
        vUv = tuv.yx;
        vViewPosition = -mvPosition.xyz;
        vPos = pos;
        vWorldPos = worldPos.xyz;
        vLife = life;
    }
`;

export default function ParticleTubes({
  shader: _shader,

  tubeSegments = 6,

  // FIXME: Produces artefacts resetting to 9999 when higher than 2?
  tubeSides = 2,

  // Influences 'smoothness' and length
  tubeLerp = 0.1,

  // Influences width, higher value is thinner
  tubeTaper = 0.2,

  // Influences length, smaller means shorted
  tubeResetDelta = 0.1,

  tubeThickness = 0.8,

  curlNoiseFrequency = 0.5,
  curlNoiseAmplitude = 3.01,
  curlNoiseTimeScale = 0.01,
  curlNoiseSpeed = 1,
}) {
  const { _key, simulator, dataSize, refMesh, maxParticles } = useContext(
    ParticleSystemContext
  );

  const tIndices = suspend(async () => {
    const data = new Float32Array(dataSize * dataSize * 4);

    let count = data.length / 4;

    for (let i = 0; i < count; i++) {
      data[i * 4 + 0] = i % tubeSegments;
      data[i * 4 + 1] = Math.floor(i / tubeSegments);
      data[i * 4 + 2] = i % tubeSegments == 0 ? 1 : 0;
      data[i * 4 + 3] = 1;
    }

    let dt = new DataTexture(data, dataSize, dataSize, RGBAFormat, FloatType);
    dt.needsUpdate = true;
    return dt;
  }, [`${_key}-ParticleTubes-${dataSize}`]);

  useEffect(() => {
    return () => {
      tIndices.dispose();
      clear([`${_key}-ParticleTubes-${dataSize}`]);
    };
  }, [tIndices]);

  const { variable } = useSimulatorModule({
    name: 'TubeIndices',
    simulator,
    variableName: 'Position',
    shaderChunks: {
      setup: /*glsl*/ `        
        uniform sampler2D tIndices;
        uniform float textureSize;
        uniform float lineSegments;
        uniform float uLerp;
        uniform float uResetDelta;

        uniform float uCurlNoiseFrequency;
        uniform float uCurlTimeScale;
        uniform float uCurlNoiseSpeed;
        uniform float uCurlNoiseAmplitude;

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

        float getIndex(float line, float chain, float lineSegments) {
            return (line * lineSegments) + chain;
        }

        ${curl}
      `,
      execute: /*glsl*/ `
        // This UV is still for the 1024 index
        vec3 index = texture2D(tIndices, uv).xyz;

        float CHAIN = index.x;
        float LINE = index.y;
        float HEAD = index.z;

        vec3 pos = nextPosition.xyz;

        vec4 life = texture2D(textureLife, uv);

        if (HEAD > 0.9) { // isHead
            // vec3 velocity = vec3(-0.02, 0., 0.);
            // pos += velocity;    
            vec3 curl = fastCurl(
              pos * uCurlNoiseFrequency + 
              (uTime * uCurlTimeScale * 0.1)) * uCurlNoiseAmplitude;
            
            
            vec3 transformCurl = curl * uCurlNoiseSpeed * 0.01;
            //transformCurl.yz *= 0.7;

            pos += transformCurl;            
        } else {
            float followIndex = getIndex(LINE, CHAIN - 1.0, lineSegments);
            float headIndex = getIndex(LINE, 0.0, lineSegments);
            vec3 followPos = texture2D(texturePosition, getUVFromIndex(followIndex, textureSize)).xyz;

            
            vec4 followSpawn = texture2D(tShapeFrom, getUVFromIndex(headIndex, textureSize));
            
        //     if(life.x < 0.01) {
        //   gl_FragColor = vec4(vec3(0.), 1.0);
        //   return;
        // }

            // if (followSpawn.x <= 0.0) {
            //     pos.x = 9999.0;
            //     gl_FragColor = vec4(pos, nextPosition.w);
            //     return;
            // }

            if (length(followPos - pos) > uResetDelta) {
                followPos = texture2D(texturePosition, getUVFromIndex(headIndex, textureSize)).xyz;
                pos = followPos;
            }

            pos += (followPos - pos) * uLerp;

            
        }

        
        
        nextPosition = vec4(pos, nextPosition.w);
      `,
    },
    uniforms: {
      tIndices: { value: tIndices },
      uLerp: { value: tubeLerp },
      uResetDelta: { value: tubeResetDelta },
      textureSize: { value: dataSize },
      lineSegments: { value: tubeSegments },
      uCurlNoiseFrequency: { value: curlNoiseFrequency },
      uCurlNoiseAmplitude: { value: curlNoiseAmplitude },

      uCurlTimeScale: { value: curlNoiseTimeScale },
      uCurlNoiseSpeed: { value: curlNoiseSpeed },
    },
  });

  const shader = useMemo(
    () => ({
      vertexShader,
      ..._shader,
      uniforms: {
        uThickness: { value: tubeThickness },
        // Could also be single datasize?
        textureSize: { value: dataSize },
        lineSegments: { value: tubeSegments },
        uTaper: { value: tubeTaper },
        ..._shader.uniforms,
      },
      transparent: true,
    }),
    []
  );

  const shape = suspend(async () => {
    return generateTube(tubeSides, tubeSegments - 1, false);
  }, [`ParticleTubes-${tubeSides}-${tubeSegments}`]);
  // const geometry = useMemo(() => new BoxGeometry(0.1, 0.1, 0.1), []);

  useEffect(() => {
    const geometry = new BufferGeometry();

    for (let key in shape.attributes) {
      geometry.setAttribute(key, shape.attributes[key]);
    }

    const tubeCount = Math.floor((dataSize * dataSize) / tubeSegments);
    const cNumber = new Float32Array(tubeCount);

    for (let i = 0; i < tubeCount; i++) {
      cNumber[i] = i;
    }

    geometry.setAttribute('cNumber', new InstancedBufferAttribute(cNumber, 1));

    // Overwrite reference attribute and mesh
    // geometry.setAttribute(
    //   'reference',
    //   new InstancedBufferAttribute(simulator.getReferenceFloat32Array(), 2)
    // );
    // refMesh.current.renderOrder = 99;
    refMesh.current.count = tubeCount;
    refMesh.current.geometry = geometry;

    return () => {
      geometry.dispose();
    };
  }, [refMesh]);

  return (
    <shaderMaterial
      {...shader}
      transparent={true}
    />
  );
}
