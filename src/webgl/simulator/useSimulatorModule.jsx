import { Uniform } from 'three';
window.Uniform = Uniform;

export const useSimulatorModule = function ({
  name,
  simulator,
  variableName,
  defines = {},
  uniforms = {},
  shaderChunks,
}) {
  const variable = useMemo(() => {
    // console.log('useSimulatorModule', 'variable');
    return Object.values(simulator.variableData).find(
      (v) => v.name === variableName
    );
  }, [simulator, variableName]);

  useEffect(() => {
    return patchShader(variable.instance.material, {
      name,
      defines,
      uniforms,
      fragmentShader: shaderChunks,
    });
  }, [variable]);
  // }, [variable, defines, uniforms, shaderChunks]);

  return { variable };
};

export default useSimulatorModule;
