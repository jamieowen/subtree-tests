// ******************************************************************************************
//
// ParticleSystemCSM
// - an ParticleSystem instanced mesh material for geometry (uses CSM)
//
// ******************************************************************************************
import CustomShaderMaterial from 'three-custom-shader-material';
import { FrontSide, MeshBasicMaterial } from 'three';
import particlesVert from '@/webgl/glsl/particles/base-material/particle.vert';
import particlesFrag from '@/webgl/glsl/particles/base-material/particle.frag';

export const ParticleSystemCSM = forwardRef(
  (
    {
      baseMaterial = MeshBasicMaterial,
      outline = false,
      transparent = false,
      fallOff,
      side = DoubleSide,
      uniforms,
      ...props
    },
    ref
  ) => {
    const { simulator, dataSize, refMesh } = useContext(ParticleSystemContext);

    const refMaterial = useRef(null);

    const shader = useMemo(() => {
      return {
        baseMaterial,
        vertexShader: particlesVert,
        fragmentShader: particlesFrag,
        uniforms: {
          uOutline: { value: outline ? 1 : 0 },
          ...uniforms,
          // uFallOff: { value: fallOff ?? [0, 0, 0] },
        },
        // defines: {
        //   HAS_FALLOFF: !!fallOff,
        // },
        // side,
        // transparent,
      };
    }, []);

    useEffect(() => {
      shader.uniforms.uOutline.value = outline ? 1 : 0;
    }, [outline]);

    return (
      <CustomShaderMaterial
        ref={mergeRefs([refMaterial, ref])}
        {...shader}
        {...props}
        silent
      />
    );
  }
);
