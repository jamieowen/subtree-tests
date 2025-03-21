import { MeshBasicMaterial } from 'three';

export const MeshMaterialWithNormal = forwardRef(
  ({ baseMaterial = MeshBasicMaterial, children, ...props }, ref) => {
    return (
      <GBufferMaterial
        ref={ref}
        baseMaterial={baseMaterial}
        {...props}
      >
        <MaterialModuleNormal />
        {children}
      </GBufferMaterial>
    );
  }
);
