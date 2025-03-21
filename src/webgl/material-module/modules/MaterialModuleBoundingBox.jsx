export const MaterialModuleBoundingBox = forwardRef(
  ({ mesh, update = false }, ref) => {
    const refBox = useRef(new Box3());

    useEffect(() => {
      mesh.current.geometry.computeBoundingBox();
      refBox.current.copy(mesh.current.geometry.boundingBox);
    });

    useFrame(() => {
      if (!update) return;
      refBox.current.copy(mesh.current.geometry.boundingBox);
    }, -1);

    const { material } = useMaterialModule({
      name: 'MaterialModuleBoundingBox',
      uniforms: {
        uBoxMin: { value: refBox.current.min },
        uBoxMax: { value: refBox.current.max },
      },
      vertexShader: {
        setup: /*glsl*/ `
          uniform vec3 uBoxMin;
          uniform vec3 uBoxMax;

          varying float vBoxHeight;
          varying float vBoxWidth;
          varying float vBoxDepth;
        `,
        main: /*glsl*/ `
          vBoxHeight = uBoxMax.y - uBoxMin.y;
          vBoxWidth = uBoxMax.x - uBoxMin.x;
          vBoxDepth = uBoxMax.z - uBoxMin.z;
        `,
      },
      fragmentShader: {
        setup: /*glsl*/ `
          uniform vec3 uBoxMin;
          uniform vec3 uBoxMax;

          varying float vBoxHeight;
          varying float vBoxWidth;
          varying float vBoxDepth;
        `,
      },
    });

    return <></>;
  }
);
