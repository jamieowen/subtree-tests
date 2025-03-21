// ******************************************************************************************
//
// ParticleSystemSpriteMaterial
// - an ParticleSystem instanced mesh material for spritesheets (random sprite per instance)
//
// ******************************************************************************************

import particlesVert from '@/webgl/glsl/particles/material/particle.vert';
import particlesFrag from '@/webgl/glsl/particles/material/particle.frag';

export const ParticleSystemMaterial = memo(
  forwardRef(
    (
      {
        vertexShader,
        fragmentShader,
        outline = false,
        map = null,
        fallOff,
        ...props
      },
      ref
    ) => {
      // const { simulator, dataSize, refMesh } = useContext(ParticleSystemContext);

      const refMaterial = useRef(null);

      const shader = useMemo(() => {
        const defines = {};
        if (!!fallOff) {
          defines.HAS_FALLOFF = 1;
        }

        return {
          uniforms: {
            uOutline: { value: outline ? 1 : 0 },
            uTexture: { value: map },
            uFallOff: { value: fallOff ?? [0, 0, 0] },
          },
          defines,
          vertexShader: vertexShader || particlesVert,
          fragmentShader: fragmentShader || particlesFrag,
        };
      }, []);

      useEffect(() => {
        shader.uniforms.uOutline.value = outline ? 1 : 0;
      }, [outline]);

      return (
        <shaderMaterial
          ref={mergeRefs([refMaterial, ref])}
          side={DoubleSide}
          // transparent={true}
          {...shader}
          {...props}
          silent
        />
      );
    }
  )
);
