import { getUrlBoolean } from '@/helpers/UrlParam';
import Env from '@/helpers/Env';
import { targetHeight } from '@/config';
import blendDarken from '@/webgl/glsl/lygia/color/blend/darken.glsl';

export const DeferredDebug = forwardRef(
  (
    {
      debug = null, // null | 'depth' | 'normal'
    },
    ref
  ) => {
    const { refDeferred, refGbuffer } = useDeferredModule({
      name: 'DeferredDebug',
      uniforms: {},
      shaderChunks: {
        pass: /*glsl*/ `

          // DEBUG NORMAL
          #ifdef DEFERRED_OUTLINE_DEBUG_NORMAL
            pc_fragColor = vec4(normalDecode(texture(tNormal, vUv).rg), 1.);
          #endif

          // DEBUG DEPTH
          #ifdef DEFERRED_OUTLINE_DEBUG_DEPTH
            float d = readDepth(tDepth, vUv);
            pc_fragColor = vec4(vec3(d), 1.0);
          #endif
          
        `,
      },
    });

    const defines = useMemo(() => {
      const defines = {};

      if (debug == 'depth' || getUrlBoolean('depth')) {
        defines['DEFERRED_OUTLINE_DEBUG_DEPTH'] = true;
      }
      if (debug == 'normal' || getUrlBoolean('normal')) {
        defines['DEFERRED_OUTLINE_DEBUG_NORMAL'] = true;
      }

      return defines;
    });

    useEffect(() => {
      Object.assign(refDeferred.current.defines, defines);
    }, [defines]);

    return <></>;
  }
);
