import _ from 'lodash';

export const NoseRenderTexture = memo(
  forwardRef(({ idx, children, fboProps = {}, ...props }, ref) => {
    // console.log('RenderTexture', idx);

    const state = useContext(SceneProgressContext);

    const [render, setRender] = useState(false);
    const renderOn = useRef(null);

    useFrame(() => {
      const s = state.getState();

      const isActive = s.isActive;
      const isNext = s.isNext;
      const isPrev = s.isPrev;
      const isTransitioning = s.isTransitioning;

      // if (idx == 0) console.log(isActive, isNext, isPrev, isTransitioning);

      let _render = 0;
      if (isActive) {
        _render = Infinity;
      }
      if (isNext) {
        // _render = Infinity;
        _render = isTransitioning ? Infinity : 1;
      }

      // if (isPrev) {
      //   _render = Infinity;
      // }

      setRender(_render);
      renderOn.current = s.renderOn;
    });

    if (render == 0) return;

    const { type, ...rest } = fboProps;

    switch (fboProps.type) {
      case 'deferred':
        return (
          <RenderTextureDeferred
            idx={idx}
            ref={(r) => {
              ref?.({
                ...r?.refMaterial?.current,
                tDepth: r?.tDepth,
              });
            }}
            frames={render}
            // renderOn={renderOn}
            {...props}
            fboProps={rest}
            // maxDpr={render == Infinity ? null : 0.1}
          >
            {children}
          </RenderTextureDeferred>
        );

      default:
        return (
          <RenderTextureMulti
            idx={idx}
            // ref={ref}
            ref={(r) => {
              ref?.(r);
            }}
            frames={Infinity}
            renderOn={renderOn}
            {...rest}
            {...props}
            // maxDpr={render == Infinity ? null : 0.1}
          >
            {children}
          </RenderTextureMulti>
        );
    }
  })
);
