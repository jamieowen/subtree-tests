export const useMaterialModule = function ({
  name,
  defines = {},
  uniforms = {},
  vertexShader = {},
  fragmentShader = {},
}) {
  const { material, isCSM } = useContext(GBufferMaterialContext);

  useEffect(() => {
    if (isCSM) {
      const unpatch = patchShader(material.__csm, {
        name,
        vertexShader,
        fragmentShader,
      });
      Object.assign(material.uniforms, uniforms);
      if (!material.defines) material.defines = {};
      Object.assign(material.defines, defines);
      material.update();
      return unpatch;
    } else {
      return patchShader(material, {
        name,
        defines,
        uniforms,
        vertexShader,
        fragmentShader,
      });
    }
  }, [material]);

  return {
    material,
  };
};
