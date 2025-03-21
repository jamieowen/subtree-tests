import { Uniform } from 'three';
import { DeferredContext } from './DeferredContext';
window.Uniform = Uniform;

export const useDeferredModule = function ({
  name,
  shaderChunks,
  uniforms,
  defines,
}) {
  const {
    refDeferred,
    refMaterial,
    refGbuffer,
    renderPriority,
    //
  } = useContext(DeferredContext);

  useEffect(() => {
    if (!refDeferred.current) return;
    return patchShader(refDeferred.current, {
      name,
      defines,
      uniforms,
      fragmentShader: shaderChunks,
    });
  }, [refDeferred]);

  return {
    refDeferred,
    refMaterial,
    refGbuffer,
    renderPriority,
  };
};
