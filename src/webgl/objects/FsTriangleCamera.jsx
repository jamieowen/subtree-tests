import { OrthographicCamera } from '@react-three/drei';

export const FsTriangleCamera = forwardRef(({ children, ...props }, ref) => {
  return (
    <OrthographicCamera
      ref={ref}
      makeDefault
      position-z={1000}
      left={-1}
      right={1}
      top={1}
      bottom={-1}
      near={0}
      far={1000}
      manual
      {...props}
    >
      {children}
    </OrthographicCamera>
  );
});
