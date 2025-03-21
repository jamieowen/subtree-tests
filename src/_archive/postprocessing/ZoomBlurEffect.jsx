import { Uniform } from 'three';
import { BlendFunction, Effect } from 'postprocessing';

import zoomBlurFrag from '@/webgl/glsl/postprocessing/zoom-blur.frag';

export class ZoomBlurEffectImpl extends Effect {
  constructor({ strength = 1, center = [0.5, 0.5] } = {}) {
    super('ZoomBlurEffect', zoomBlurFrag, {
      blendFunction: BlendFunction.Normal,
      uniforms: new Map([
        ['strength', new Uniform(strength)],
        ['center', new Uniform(new Vector2(center[0], center[1]))],
      ]),
    });
  }
}

export const ZoomBlurEffect = forwardRef(
  ({ strength = 1, center = [0.5, 0.5] }, ref) => {
    const effect = useMemo(() => {
      return new ZoomBlurEffectImpl({ strength, center });
    }, []);

    useEffect(() => {
      if (!effect?.uniforms) return;
      effect.uniforms.get('strength').value = strength;
      effect.uniforms.get('center').value.x = center[0];
      effect.uniforms.get('center').value.y = center[1];
    }, [effect, strength, center]);

    return (
      <primitive
        ref={ref}
        object={effect}
        attachArray="passes"
      />
    );
  }
);
