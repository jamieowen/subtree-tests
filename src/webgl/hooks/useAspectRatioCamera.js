export const useAspectRatioCameraFov = (vFov, aspectRatio, update = true) => {
  const viewport = useThree((s) => s.viewport);
  const camera = useThree((s) => s.camera);

  const [fov, setFov] = useState(vFov);

  useEffect(() => {
    let f = vFov;
    if (camera.aspect > aspectRatio) {
      let hFov = vFov * aspectRatio;
      f =
        (Math.atan(Math.tan(((hFov / 2) * Math.PI) / 180) / camera.aspect) *
          2 *
          180) /
        Math.PI;
    }

    setFov(f);
    if (!update) return;
    camera.fov = f;
    camera.updateProjectionMatrix();
  }, [camera, viewport.width, viewport.height]);

  return fov;
};
