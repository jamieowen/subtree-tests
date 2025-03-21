import { urls } from '@/config/assets';
import { useLayoutEffect, useMemo, useRef } from 'react';
import {
  BufferGeometry,
  Color,
  InstancedBufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Vector2,
  Vector3,
} from 'three';
import { MeshSurfaceSampler } from '@/webgl/utils/MeshSurfaceSampler';
// import { fragmentShader, vertexShader } from './shaders';

export function sampleRandomGeometryPositions(geometry, total) {
  const dummyMesh = new Mesh(geometry.toNonIndexed(), new MeshBasicMaterial());
  const sampler = new MeshSurfaceSampler(dummyMesh).build();

  const sampledGeometry = new BufferGeometry().setFromPoints(
    new Array(total).fill(0).map(() => {
      let p = new Vector3();
      sampler.sample(p);

      return p;
    })
  );

  const sampledGeometryPositions = new Float32Array(total * 3);

  for (let i = 0; i < total * 3; i += 3) {
    const x = sampledGeometry.attributes.position.array[i];
    const y = sampledGeometry.attributes.position.array[i + 1];
    const z = sampledGeometry.attributes.position.array[i + 2];

    sampledGeometryPositions[i] = x;
    sampledGeometryPositions[i + 1] = y;
    sampledGeometryPositions[i + 2] = z;
    //sampledGeometryPositions[i + 3] = 0;
  }

  return sampledGeometryPositions;
}

export function useSampleRandomGeometryPositions(geometry, total) {
  const sampledGeometryPositions = useMemo(() => {
    return sampleRandomGeometryPositions(geometry, total);
  }, [geometry, total]);

  return sampledGeometryPositions;
}

const vertexShader = /*glsl*/ `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vColor;
    varying float vCoverage;

    attribute vec4 random;
    attribute vec3 windOffset;
    attribute vec3 offsets;


    uniform vec4 uWind;
    uniform vec3 uFogColor;
    uniform vec2 uFogRange;
    uniform float uCutoff;
    uniform float uCoverage;
    uniform float uTime;
    uniform vec3 uColor;

    void main() {
        float t = uTime * uWind.x;
        vec3 transformed = position;
        // transformed += offsets;
        
        // reduce grass coverage for performance
        //float coverage = step(1.0 - clamp(uCoverage, 0.0, 1.0), random.w);
        //transformed *= coverage;

        float offsetFactor = windOffset.x + windOffset.y + windOffset.z + t;
        float heightFactor = uv.y * uWind.y;

        // large scale motion
        float largeScaleMotion = sin(offsetFactor) * heightFactor;
        transformed.x += largeScaleMotion;

        // small scale motion
        float smallScaleMotion = sin(2.65 * (offsetFactor * 1.4)) * heightFactor * 0.5;
        transformed.x += smallScaleMotion;
        
        // pos = transformPosition(pos, offset, scale, orientation);
        //pos *= scale;
        // pos += offset
        

        // random scale
        float scale = 1. + (random.w * 0.01);
        transformed *= scale;
        // transformed.y -= scale * 0.5;
        transformed.xz += offsets.xz;
        // transformed += offsets;
        

        vec4 modelViewPos = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);

        //gl_Position = projectionMatrix * (modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0) + vec4(transformed.x, transformed.y, 0.0, 0.0));
        gl_Position = projectionMatrix * modelViewPos;
        
        
        float fog = smoothstep(uFogRange.x, uFogRange.y, -modelViewPos.z);
        vColor = vec3(uColor - (random.x * 0.05));
        // vColor = mix(vColor, uFogColor, fog) + (largeScaleMotion * smallScaleMotion * uWind.w * uv.y);
        vColor += (largeScaleMotion * smallScaleMotion * uWind.w * uv.y);
        

        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
    }
`;

const fragmentShader = /*glsl*/ `
    layout(location = 1) out vec4 gNormal;
    layout(location = 2) out vec4 gWorldPos;

    uniform sampler2D tMap;
    uniform vec4 uWind;
    uniform vec3 uFogColor;
    uniform vec2 uFogRange;
    uniform float uCutoff;
    uniform float uCoverage;
    uniform float uTime;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    varying vec3 vColor;
    varying float vCoverage;

    void main() {
        vec4 color = texture(tMap, vUv);
        //if (vCoverage == 0.0) discard;
        float alpha = texture2D(tMap, vUv).r;
        if (alpha < uCutoff) discard;
        gl_FragColor = vec4(vColor, 1.0);

        gNormal = vec4(0., 0., 0., 0.);
        gWorldPos = vec4(0.);
    }
`;

export default function Grass({ size = 1, total = 10000, geometry, ...props }) {
  const mesh = useRef();

  const tNoise = useTexture(urls.t_noise);
  const tMap = useTexture(urls.t_grass_alpha);
  tNoise.wrapS = tNoise.wrapT = RepeatWrapping;

  //   const lightPos = new Vector3(1, 3, 3);

  const sampledGeometryPositions = useSampleRandomGeometryPositions(
    geometry,
    total
  );

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
      tNoise: {
        value: tNoise,
      },
      tMap: {
        value: tMap,
      },
      uWind: {
        // x = speed
        // y = small movement
        // z = large movement
        // w = color
        // value: [4.347, 0.01, 5, 400.01],
        value: [2.347, 0.01, 0.01, 400.01],
      },
      uColor: { value: new Color('#3f8054') },
      uFogColor: { value: new Color('#00ff00') },
      uFogRange: { value: [0, 15] },
      uCutoff: { value: 0.5 },
    }),
    []
  );

  useLayoutEffect(() => {
    const dummy = new Object3D();
    const _pos = new Vector3();
    const id = new Float32Array(total);
    const rand = new Float32Array(total * 4);
    const windOffset = new Float32Array(total * 3);

    const offsets = new Float32Array(total * 3);

    for (let i = 0; i < total * 3; i += 3) {
      offsets[i + 0] = sampledGeometryPositions[i + 0];
      offsets[i + 1] = sampledGeometryPositions[i + 1];
      offsets[i + 2] = sampledGeometryPositions[i + 2];
    }

    // console.log(offsets);

    for (let i = 0; i < total; i++) {
      _pos.set(Math.random() * 40 - 20, 0, Math.random() * 40 - 20);
      dummy.position.copy(_pos);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      id[i] = i;
    }

    for (let i = 0; i < total * 4; i++) {
      rand[i] = Math.random();
      rand[i + 1] = Math.random();
      rand[i + 2] = Math.random();
      rand[i + 3] = Math.random();
    }

    for (let i = 0; i < total * 3; i++) {
      windOffset[i] = Math.random() * 10;
      windOffset[i + 1] = Math.random() * 10;
      windOffset[i + 2] = Math.random() * 10;
    }

    mesh.current.geometry.setAttribute(
      'random',
      new InstancedBufferAttribute(rand, 4)
    );
    mesh.current.geometry.setAttribute(
      'windOffset',
      new InstancedBufferAttribute(windOffset, 3)
    );
    mesh.current.geometry.setAttribute(
      'offsets',
      new InstancedBufferAttribute(offsets, 3)
    );

    mesh.current.instanceMatrix.needsUpdate = true;
  }, [mesh.current]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    uniforms['uTime'].value = t;
  });

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, total]}
      {...props}
    >
      <planeGeometry args={[size, size]} />
      <shaderMaterial
        transparent
        side={FrontSide}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </instancedMesh>
  );
}
