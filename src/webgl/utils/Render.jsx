export const Render = ({ renderPriority = 10000, ...props }) => {
  useFrame(({ gl, scene, camera }) => {
    gl.setRenderTarget(null);
    gl.render(scene, camera);
  }, renderPriority);

  return <></>;
};

export default Render;
