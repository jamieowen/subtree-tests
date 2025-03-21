export const Ground = forwardRef(
  ({ size = 1, color = 'red', materialProps = {}, ...props }, ref) => {
    const refMesh = useRef();
    const refMaterial = useRef();
    useImperativeHandle(ref, () => ({
      refMesh,
      refMaterial,
    }));

    return (
      <mesh
        ref={refMesh}
        rotation={[degToRad(-90), 0, 0]}
        {...props}
      >
        <planeGeometry args={[size, size]} />
        <MeshMaterialWithNormal
          ref={refMaterial}
          color={color}
          {...materialProps}
          outline={false}
        />
      </mesh>
    );
  }
);
