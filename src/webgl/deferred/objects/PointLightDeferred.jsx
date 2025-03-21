import { Sphere } from '@react-three/drei';

// ****************************************************************************
// PointLightDeferred object
// REQUIRES DeferredLighting module to be added!
// ****************************************************************************

export const PointLightDeferred = forwardRef(
  (
    {
      debug = 0,
      color = 0xffffff,
      distance = 0.1,
      decay = 0.1,
      intensity = 1,
      alpha = 1,
      children,
      ...props
    },
    ref
  ) => {
    const refRoot = useRef(null);
    const refDebugMaterial = useRef(null);

    const { refDeferred } = useContext(DeferredContext);

    // WORLD POSITION
    const worldPos = useMemo(() => new Vector3(), []);

    useFrame(() => {
      refRoot.current.getWorldPosition(worldPos);
    });

    // COLOR
    const _color = useColor(color);

    // ADD LIGHT TO DEFERRED LIGHTING MODULE
    const light = useMemo(() => {
      return {
        position: worldPos,
        color: _color,
        distance,
        decay,
        intensity,
        alpha,
      };
    }, [worldPos, _color, distance, decay, intensity, alpha]);

    useEffect(() => {
      if (!refDeferred.current?.uniforms?.pointLights?.value) return;

      // add light

      refDeferred.current.uniforms.pointLights.value.push(light);

      // update length
      refDeferred.current.defines.DEFERRED_PL_AMOUNT = Math.max(
        1,
        refDeferred.current.uniforms.pointLights.value.length
      );

      return () => {
        if (!refDeferred?.current?.uniforms?.pointLights) return;
        // remove light
        refDeferred.current.uniforms.pointLights.value =
          refDeferred.current.uniforms.pointLights.value.filter(
            (l) => l !== light
          );

        // update length
        refDeferred.current.defines.DEFERRED_PL_AMOUNT = Math.max(
          1,
          refDeferred.current.uniforms.pointLights.value.length
        );
      };
    }, [refDeferred, light]);

    useImperativeHandle(
      ref,
      () => ({
        refRoot,
        get intensity() {
          return light.intensity;
        },
        set intensity(val) {
          light.intensity = val;
        },
        get alpha() {
          return light.alpha;
        },
        set alpha(val) {
          light.alpha = val;
        },
        get color() {
          return light.color;
        },
        set color(val) {
          light.color = val;
          refDebugMaterial.color = val;
        },
      }),
      [ref, refRoot, light]
    );

    return (
      <group
        ref={mergeRefs([refRoot])}
        {...props}
      >
        {/* <pointLight
          color={color}
          intensity={intensity}
          distance={distance}
          decay={decay}
          alpha={alpha}
        /> */}

        {children}

        {debug > 0 && (
          <>
            <Sphere args={[debug, 32, 32]}>
              <GBufferMaterial
                side={DoubleSide}
                transparent={true}
              >
                <MaterialModuleNormal />
                <MaterialModuleColor color={color} />
              </GBufferMaterial>
            </Sphere>

            <Sphere args={[distance, 32, 32]}>
              <GBufferMaterial
                side={DoubleSide}
                transparent={true}
                wireframe
              >
                <MaterialModuleWorldPos />
                <MaterialModuleNormal />
                <MaterialModuleColor color={color} />
              </GBufferMaterial>
            </Sphere>
          </>
        )}
      </group>
    );
  }
);
