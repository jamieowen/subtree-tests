// ***************************************************************************
//
// Position Attractor
// ADDS to the position of a particle towards the surface of an attractor mesh
//
// ***************************************************************************

import { useContext } from 'react';
// import setup from '@/webgl/glsl/particles/position-attractor/setup.glsl';
// import execute from '@/webgl/glsl/particles/position-attractor/execute.glsl';
import { DataTexture, RGBAFormat, FloatType } from 'three';
import { MeshSurfaceSampler } from '@/webgl/utils/MeshSurfaceSampler';

export const PositionAddAttractor = forwardRef(
  ({ debug = false, strength = 1, children, ...props }, ref) => {
    const { _key, simulator, dataSize } = useContext(ParticleSystemContext);

    const refMesh = useRef(null);
    const stub = useRef(new Vector3());

    const dataTexture = suspend(async () => {
      const data = new Float32Array(dataSize * dataSize * 4);
      const dt = new DataTexture(
        data,
        dataSize,
        dataSize,
        RGBAFormat,
        FloatType
      );
      dt.needsUpdate = true;
      return dt;
    }, [`${_key}-PositionAddAttractor-dt`]);

    const { variable } = useSimulatorModule({
      name: 'PositionAddAttractor',
      simulator,
      variableName: 'Position',
      shaderChunks: {
        setup: /*glsl*/ `
        uniform sampler2D uPositionAttractor_SurfacePositions;
        uniform vec3 uPositionAttractor_WorldPosition;
        uniform float uPositionAttractor_Strength;
      `,
        execute: /*glsl*/ `
        vec4 surfacePosition = texture2D(uPositionAttractor_SurfacePositions, uv);
        vec3 toPosition = surfacePosition.xyz + uPositionAttractor_WorldPosition.xyz;

        vec3 attractorDir = normalize(toPosition - (currPosition.xyz + uWorldPos));
        float attractorLen = length(toPosition - (currPosition.xyz + uWorldPos));

        nextPosition.xyz += attractorDir * uPositionAttractor_Strength * uDelta;
        // if (len < 1.0) {
        // }
      `,
      },
      uniforms: {
        uPositionAttractor_SurfacePositions: {
          value: dataTexture,
        },
        uPositionAttractor_WorldPosition: {
          value: new Vector3(),
        },
        uPositionAttractor_Strength: {
          value: strength,
        },
      },
    });

    useEffect(() => {
      if (!refMesh.current) return;

      const dt = dataTexture;

      const geometry = refMesh.current.geometry.toNonIndexed();
      const surfaceMesh = new Mesh(geometry);
      const sampler = new MeshSurfaceSampler(surfaceMesh).build();
      const stub = new Vector3();

      const data = dt.image.data;
      for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
        sampler.sample(stub);
        data[i + 0] = stub.x;
        data[i + 1] = stub.y;
        data[i + 2] = stub.z;
      }

      dt.needsUpdate = true;
    }, [refMesh, dataSize]);

    useFrame((state, delta) => {
      refMesh.current.getWorldPosition(
        variable.instance.material.uniforms.uPositionAttractor_WorldPosition
          .value
      );
    });

    useEffect(() => {
      variable.instance.material.uniforms.uPositionAttractor_Strength.value =
        strength;
    }, [strength]);

    useImperativeHandle(
      ref,
      () => ({
        get strength() {
          return variable.instance.material.uniforms.uPositionAttractor_Strength
            .value;
        },
        set strength(val) {
          variable.instance.material.uniforms.uPositionAttractor_Strength.value =
            val;
        },
      }),
      [variable]
    );

    return (
      <mesh
        ref={refMesh}
        {...props}
      >
        {children}
        {debug && (
          <GBufferMaterial wireframe>
            <MaterialModuleNormal />
            <MaterialModuleColor color="black" />
          </GBufferMaterial>
        )}
      </mesh>
    );
  }
);
