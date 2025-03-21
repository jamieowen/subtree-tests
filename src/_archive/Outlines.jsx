import * as THREE from 'three';
import * as React from 'react';

import { extend, applyProps, useThree, useFrame } from '@react-three/fiber';
import { toCreasedNormals } from 'three-stdlib';

import { shaderMaterial } from '@react-three/drei';

import { REVISION } from 'three';
import { urls } from '@/config/assets';

const version = parseInt(REVISION.replace(/\D+/g, ''));

const OutlinesMaterial = /* @__PURE__ */ shaderMaterial(
  {
    screenspace: true,
    color: /* @__PURE__ */ new THREE.Color('black'),
    opacity: 1,
    thickness: 0.05,
    size: /* @__PURE__ */ new THREE.Vector2(),
  },
  /*glsl*/ `
  #include <common>
  #include <morphtarget_pars_vertex>
  #include <skinning_pars_vertex>

  uniform float thickness;
  uniform float screenspace;
  uniform vec2 size;

  varying vec2 vUv;

  void main() {
    #if defined (USE_SKINNING)
        #include <beginnormal_vertex>
      #include <morphnormal_vertex>
      #include <skinbase_vertex>
      #include <skinnormal_vertex>
      #include <defaultnormal_vertex>
    #endif

    #include <begin_vertex>
      #include <morphtarget_vertex>
      #include <skinning_vertex>
    #include <project_vertex>

    vec4 tNormal = vec4(normal, 0.0);
    vec4 tPosition = vec4(transformed, 1.0);

    #ifdef USE_INSTANCING
      tNormal = instanceMatrix * tNormal;
      tPosition = instanceMatrix * tPosition;
    #endif

    if (screenspace == 0.0) {
      vec3 newPosition = tPosition.xyz + tNormal.xyz * thickness;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0); 
    } else {
      vec4 clipPosition = projectionMatrix * modelViewMatrix * tPosition;
      vec4 clipNormal = projectionMatrix * modelViewMatrix * tNormal;
      vec2 offset = normalize(clipNormal.xy) * thickness / size * clipPosition.w * 2.0;
      clipPosition.xy += offset;
      gl_Position = clipPosition;
    }
    vUv = uv;
 }`,

  /*glsl*/ `
  uniform vec3 color;
  uniform float opacity;
  uniform float uTime;
  uniform sampler2D tNoise;
  uniform vec2 size;

  varying vec2 vUv;
  
  void main(){
    
    vec2 st = gl_FragCoord.xy / size;

    float speed = 2.;
    // float sw = step(0.5, fract(uTime * speed));

    // vec2 uv = mix(st, vUv + uTime, sw);

    // vec4 noise = texture2D(tNoise, uv);
    // vec4 noiseS = texture2D(tNoise, uv + noise.g);

    // float a = 1.;
    // a = mix(a, a * step(0.5, noiseS.g), noiseS.r);

    // if(a < 0.5) {
    //   discard;
    // }

    gl_FragColor = vec4(color, 1.);
    //gl_FragColor = vec4(vUv, 1., 1.);
    #include <tonemapping_fragment>
    #include <${version >= 154 ? 'colorspace_fragment' : 'encodings_fragment'}>
  }
 `
);

export function Outlines({
  color = 'black',
  opacity = 1,
  transparent = false,
  screenspace = false,
  toneMapped = true,
  polygonOffset = false,
  polygonOffsetFactor = 0,
  renderOrder = 0,
  thickness = 0.05,
  angle = Math.PI,
  materialProps = {},
  ...props
}) {
  const ref = React.useRef();
  const [material] = React.useState(
    () => new OutlinesMaterial({ side: THREE.BackSide, transparent: true })
  );
  const { gl } = useThree();
  const contextSize = gl.getDrawingBufferSize(new THREE.Vector2());
  React.useMemo(() => extend({ OutlinesMaterial }), []);

  const tNoise = useTexture(urls.t_noise_rough);
  tNoise.wrapS = tNoise.wrapT = THREE.RepeatWrapping;

  const oldAngle = React.useRef(0);
  const oldGeometry = React.useRef();
  React.useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;

    const parent = group.parent;
    if (parent && parent.geometry) {
      if (
        oldAngle.current !== angle ||
        oldGeometry.current !== parent.geometry
      ) {
        oldAngle.current = angle;
        oldGeometry.current = parent.geometry;

        // Remove old mesh
        let mesh = group.children?.[0];
        if (mesh) {
          if (angle) mesh.geometry.dispose();
          group.remove(mesh);
        }

        if (parent.skeleton) {
          mesh = new THREE.SkinnedMesh();
          mesh.material = material;
          mesh.bind(parent.skeleton, parent.bindMatrix);
          group.add(mesh);
        } else if (parent.isInstancedMesh) {
          mesh = new THREE.InstancedMesh(
            parent.geometry,
            material,
            parent.count
          );
          mesh.instanceMatrix = parent.instanceMatrix;
          group.add(mesh);
        } else {
          mesh = new THREE.Mesh();
          mesh.material = material;
          group.add(mesh);
        }
        mesh.geometry = angle
          ? toCreasedNormals(parent.geometry, angle)
          : parent.geometry;
      }
    }
  });

  React.useLayoutEffect(() => {
    const group = ref.current;
    if (!group) return;

    const mesh = group.children[0];
    if (mesh) {
      mesh.renderOrder = renderOrder;

      mesh.material.uniforms = {
        ...mesh.material.uniforms,
        tNoise: {
          value: tNoise,
        },
        uTime: {
          value: 0,
        },
      };

      applyProps(mesh.material, {
        transparent,
        thickness,
        color,
        // tNoise,
        opacity,
        size: contextSize,
        screenspace,
        toneMapped,
        polygonOffset,
        polygonOffsetFactor,
        ...materialProps,
      });
    }
  });

  React.useEffect(() => {
    return () => {
      // Dispose everything on unmount
      const group = ref.current;
      if (!group) return;

      const mesh = group.children[0];
      if (mesh) {
        if (angle) mesh.geometry.dispose();
        group.remove(mesh);
      }
    };
  }, []);

  useFrame(({}, delta) => {
    if (ref.current)
      ref.current.children[0].material.uniforms.uTime.value += delta;
  });

  return (
    <group
      ref={ref}
      {...props}
    />
  );
}
