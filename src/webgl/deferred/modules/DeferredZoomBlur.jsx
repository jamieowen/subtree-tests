import zoomblur from '@/webgl/glsl/utils/zoom-blur.glsl';

export const DeferredZoomBlur = forwardRef(
  ({ center = [0.5, 0.5], strength = 0.5 }, ref) => {
    const { refDeferred } = useDeferredModule({
      name: 'DeferredZoomBlur',
      uniforms: {
        uDeferredZoomBlur_center: { value: new Vector2(center[0], center[1]) },
        uDeferredZoomBlur_strength: { value: strength },
      },
      shaderChunks: {
        setup: /*glsl*/ `
        uniform vec2 uDeferredZoomBlur_center;
        uniform float uDeferredZoomBlur_strength;

        ${zoomblur}
      `,
        pass: /*glsl*/ `
         pc_fragColor = zoomBlur(tDiffuse, vUv, uDeferredZoomBlur_center, uDeferredZoomBlur_strength);
      `,
      },
    });

    useEffect(() => {
      refDeferred.current.uniforms.uDeferredZoomBlur_center.value.set(
        center[0],
        center[1]
      );
    }, [center]);

    useEffect(() => {
      refDeferred.current.uniforms.uDeferredZoomBlur_strength.value = strength;
    }, [strength]);

    useImperativeHandle(
      ref,
      () => {
        return {
          refDeferred,
          get strength() {
            return refDeferred.current.uniforms.uDeferredZoomBlur_strength
              .value;
          },
          set strength(val) {
            refDeferred.current.uniforms.uDeferredZoomBlur_strength.value = val;
          },
        };
      },
      [refDeferred]
    );

    return <></>;
  }
);
