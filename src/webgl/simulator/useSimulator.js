import { useMemo, useRef } from 'react';
import SimulatorClass from './SimulatorClass';
import { InstancedBufferAttribute, BufferAttribute } from 'three';

import gsap from 'gsap';

export default function useSimulator({ _key, width, height, variables }) {
  if (!_key) console.error('useSimulator: _key is required');
  const gl = useThree((state) => state.gl);

  const total = useMemo(() => width * height, [width, height]);
  let shaderKey = useRef('uniforms');

  // const simulator = useMemo(() => {
  //   return new SimulatorClass(gl, width, height, variables);
  // }, [width, height, variables]);

  // const key = useMemo(() => {
  //   JSON.stringify(variables);
  // }, [variables]);

  const simulator = suspend(async () => {
    return new SimulatorClass(gl, width, height, variables);
  }, [`simulator-${width}-${height}`, _key]);

  // useEffect(() => {
  //   return () => {
  //     simulator.dispose();
  //     clear([`simulator-${width}-${height}`, _key]);
  //   };
  // }, [simulator]);

  const _reference = useMemo(() => {
    return simulator.getReferenceFloat32Array();
  }, [simulator]);

  const applyReferenceAttribute = useCallback(
    ({ mesh, isInstanced = false, reference = null }) => {
      const attributeType = isInstanced
        ? InstancedBufferAttribute
        : BufferAttribute;

      // Reference
      let ref = reference || _reference;

      mesh.geometry.setAttribute('reference', new attributeType(ref, 2));

      // Index
      const index = [];
      for (let i = 0; i < width * height; i++) {
        index[i] = i;
      }
      mesh.geometry.setAttribute(
        'index',
        new attributeType(Float32Array.from(index), 1)
      );
    },
    [simulator, _reference]
  );

  const applyMaterial = useCallback(
    ({ material, useUserData = false }) => {
      if (!material) return;

      if (useUserData) shaderKey.current = 'userData';

      if (!material.uniforms) material.uniforms = {};

      material[shaderKey.current]['uTime'] = { value: null };
      material[shaderKey.current]['uDelta'] = { value: null };

      Object.values(simulator.variableData).forEach((variable) => {
        const { current, prev } = simulator.getTexture(variable.name);

        material[shaderKey.current][`u${variable.name}Texture`] = {
          value: current,
        };

        if (variable.usePrev) {
          material[shaderKey.current][`uPrev${variable.name}Texture`] = {
            value: prev,
          };
        }
      });
    },
    [simulator, total]
  );

  const applyToMesh = useCallback(
    ({
      mesh,
      applyPosition = false,
      isInstanced = false,
      useUserData = false,
      reference = null,
    }) => {
      const attributeType = isInstanced
        ? InstancedBufferAttribute
        : BufferAttribute;
      if (useUserData) shaderKey.current = 'userData';

      // Reference
      applyReferenceAttribute({ mesh, isInstanced, reference });

      // Particles
      if (applyPosition) {
        const position = new Float32Array(total * 3);
        mesh.geometry.setAttribute('position', new attributeType(position, 3));
      }

      // Material
      applyMaterial({ material: mesh.material, useUserData });
    },
    [simulator, total]
  );

  function update(obj, time, delta) {
    if (!obj) return;
    let material = obj.material || obj;
    if (!material[shaderKey.current]) return;
    // if (!material[shaderKey.current]['uDelta']?.value) return;

    // TODO: Maybe to ref and then add delta time
    // const t = clock.getElapsedTime();
    delta = delta || gsap.ticker.deltaRatio(60) / 1000;

    material[shaderKey.current]['uTime'].value = time;
    material[shaderKey.current]['uDelta'].value = delta;

    Object.values(simulator.variableData).forEach((variable) => {
      if (variable.static) return;
      const { current, prev } = simulator.getTexture(variable.name);
      material[shaderKey.current][`u${variable.name}Texture`].value = current;

      if (variable.usePrev) {
        material[shaderKey.current][`uPrev${variable.name}Texture`].value =
          prev;
      }
    });

    simulator.compute(time, delta);
  }

  function updateDebugTexture(obj, variableName) {
    if (!obj) return;
    let material = obj.material || obj;

    const { current, prev } = simulator.getTexture(variableName);
    material.map = current;
    material.needsUpdate = true;
  }

  function dispose() {
    simulator?.dispose();

    // TODO: Perhaps keep track of all simulations?
    //simulations[id] = null;
  }

  return {
    simulator,
    _reference,

    applyReferenceAttribute,
    applyMaterial,
    applyToMesh,

    update,
    updateDebugTexture,

    dispose,
  };
}
