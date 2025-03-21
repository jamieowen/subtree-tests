import { MeshBasicMaterial } from 'three';

export const NoseMaterial = forwardRef(
  ({ baseMaterial, children, ...props }, ref) => {
    const _props = useMemo(() => props || {}, [props]);

    return (
      <GBufferMaterial
        ref={ref}
        baseMaterial={baseMaterial}
        {...props}
      >
        <MaterialModuleWorldPos />
        <MaterialModuleOutline {..._props.outline} />
        {/* <MaterialModuleColor color={_props.color} /> */}
        {children}
      </GBufferMaterial>
    );
  }
);
