// ***************************************************************************
//
// Emission Shape
// Sets the shape of the emission source
//
// ***************************************************************************

import { useContext } from 'react';
import { FloatType, RGBAFormat, DataTexture } from 'three';
import { Sphere } from '@react-three/drei';
import { MeshSurfaceSampler } from '@/webgl/utils/MeshSurfaceSampler';

// import setup from '@/webgl/glsl/particles/shape-sphere/setup.glsl';
// import reset from '@/webgl/glsl/particles/shape-sphere/reset.glsl';

export const EmissionShape = forwardRef(
  (
    {
      scale = [1, 1, 1],
      children,
      ordered = false,
      visible = false,
      maxSamples,
      ...props
    },
    ref
  ) => {
    const { _key, simulator, uniforms, dataSize } = useContext(
      ParticleSystemContext
    );

    // ***************************************************************************
    //
    // SHAPE
    //
    // ***************************************************************************
    const refMesh = useRef(null);

    useEffect(() => {
      if (!refMesh.current) return;

      const dtPos = Object.values(simulator.variableData)[0].uniforms.tShapeFrom
        .value;
      // const dtPos = uniforms.tShapeFrom.value;
      const dataPos = dtPos.image.data;

      const dtNormal = Object.values(simulator.variableData)[0].uniforms
        .tShapeNormal.value;
      const dataNormal = dtNormal.image.data;

      const geometry = refMesh.current.geometry.toNonIndexed();
      if (Array.isArray(scale)) {
        geometry.scale(scale[0], scale[1], scale[2]);
      } else {
        geometry.scale(scale, scale, scale);
      }

      const material = refMesh.current.material;

      const mesh = new Mesh(geometry, material);

      const sampler = new MeshSurfaceSampler(mesh)
        .setWeightAttribute('color')
        .build();
      const stubPos = new Vector3();
      const stubNormal = new Vector3();

      const _maxSamples = maxSamples || dataSize * dataSize * 1;
      // console.log(dataSize, maxSamples, _maxSamples);
      for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
        const shouldSample = _maxSamples == undefined || i < _maxSamples * 4;
        if (ordered) {
          sampler.sampleOrdered(stubPos, stubNormal);
        } else {
          sampler.sample(stubPos, stubNormal);
        }

        dataPos[i + 0] = stubPos.x;
        dataPos[i + 1] = stubPos.y;
        dataPos[i + 2] = stubPos.z;

        dataNormal[i + 0] = stubNormal.x;
        dataNormal[i + 1] = stubNormal.y;
        dataNormal[i + 2] = stubNormal.z;
        // if (shouldSample) {
        // } else {
        //   const j = Math.floor(i % (Math.floor(_maxSamples) * 4));

        //   dataPos[i + 0] = dataPos[j + 0];
        //   dataPos[i + 1] = dataPos[j + 1];
        //   dataPos[i + 2] = dataPos[j + 2];

        //   dataNormal[i + 0] = dataNormal[j + 0];
        //   dataNormal[i + 1] = dataNormal[j + 1];
        //   dataNormal[i + 2] = dataNormal[j + 2];
        // }

        // console.log(stubNormal.x, stubNormal.y, stubNormal.z);
      }

      dtPos.needsUpdate = true;
      dtNormal.needsUpdate = true;
    }, [refMesh, dataSize, scale]);

    // ***************************************************************************
    //
    // VELOCITY
    //
    // ***************************************************************************
    // const { variable: velocityVariable } = useSimulatorModule({
    //   name: 'Shape-Velocity',
    //   simulator,
    //   variableName: 'Velocity',
    //   shaderChunks: {
    //     // setup: setup,
    //     reset,
    //   },
    //   uniforms: {
    //     uShape_Mode: mode,
    //   },
    // });

    // useEffect(() => {
    //   velocityVariable.instance.material.uniforms.uShape_Mode = mode;
    // }, [mode]);

    return (
      <mesh
        ref={mergeRefs([refMesh, ref])}
        scale={scale}
        visible={visible}
        {...props}
      >
        {children}
      </mesh>
    );
  }
);
