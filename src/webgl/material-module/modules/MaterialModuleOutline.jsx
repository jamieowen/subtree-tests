export const MaterialModuleOutline = ({ color }) => {
  const _color = useColor(color);

  const { material } = useMaterialModule({
    name: 'MaterialModuleOutline',
    uniforms: {
      uOutline_color: { value: _color },
    },

    fragmentShader: {
      setup: /*glsl*/ `
          uniform vec3 uOutline_color;
      `,
      main: /*glsl*/ `
          #ifdef HAS_OUTLINE_COLOR
            gOutline.rgb = uOutline_color;
            gOutline.a = 1.0;
          #endif
      `,
    },
  });

  useEffect(() => {
    material.uniforms.uOutline_color.value = _color;
    if (!!color) {
      material.defines.HAS_OUTLINE_COLOR = true;
    } else {
      delete material.defines.HAS_OUTLINE_COLOR;
    }
  }, [material, _color]);

  return <></>;
};
