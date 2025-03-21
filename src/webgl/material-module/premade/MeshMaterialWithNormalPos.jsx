import { MeshBasicMaterial } from 'three';

export const MeshMaterialWithNormalPos = forwardRef(
  ({ baseMaterial = MeshBasicMaterial, children, ...props }, ref) => {
    return (
      <GBufferMaterial
        ref={ref}
        baseMaterial={baseMaterial}
        {...props}
      >
        <MaterialModuleNormal />
        <MaterialModuleWorldPos />
        {/* <MaterialModuleOutline {...(props || {}).outline} /> */}
        {children}
      </GBufferMaterial>
    );
  }
);
