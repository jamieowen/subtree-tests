import * as THREE from 'three';
import * as React from 'react';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';

export const RenderTexturePingpong = /* @__PURE__ */ React.forwardRef(
  (
    {
      children,
      compute,
      width,
      height,
      samples = 8,
      renderPriority = 0,
      eventPriority = 0,
      frames = Infinity,
      stencilBuffer = false,
      depthBuffer = true,
      generateMipmaps = false,
      ...props
    },
    forwardRef
  ) => {
    const { size, viewport } = useThree();

    const fbo = useFBO(
      (width || size.width) * viewport.dpr,
      (height || size.height) * viewport.dpr,
      {
        samples,
        stencilBuffer,
        depthBuffer,
        generateMipmaps,
      }
    );

    const fbo2 = useFBO(
      (width || size.width) * viewport.dpr,
      (height || size.height) * viewport.dpr,
      {
        samples,
        stencilBuffer,
        depthBuffer,
        generateMipmaps,
      }
    );

    const [vScene] = React.useState(() => new THREE.Scene());

    const uvCompute = React.useCallback((event, state, previous) => {
      // Since this is only a texture it does not have an easy way to obtain the parent, which we
      // need to transform event coordinates to local coordinates. We use r3f internals to find the
      // next Object3D.
      let parent = fbo.texture?.__r3f.parent;
      while (parent && !(parent instanceof THREE.Object3D)) {
        parent = parent.__r3f.parent;
      }
      if (!parent) return false;
      // First we call the previous state-onion-layers compute, this is what makes it possible to nest portals
      if (!previous.raycaster.camera)
        previous.events.compute(
          event,
          previous,
          previous.previousRoot?.getState()
        );
      // We run a quick check against the parent, if it isn't hit there's no need to raycast at all
      const [intersection] = previous.raycaster.intersectObject(parent);
      if (!intersection) return false;
      // We take that hits uv coords, set up this layers raycaster, et voilà, we have raycasting on arbitrary surfaces
      const uv = intersection.uv;
      if (!uv) return false;
      state.raycaster.setFromCamera(
        state.pointer.set(uv.x * 2 - 1, uv.y * 2 - 1),
        state.camera
      );
    }, []);

    React.useImperativeHandle(
      forwardRef,
      () => ({
        texture: fbo.texture,
        fbo,
        fbo2,
      }),
      [fbo, fbo2]
    );

    return (
      <>
        {createPortal(
          <Container
            renderPriority={renderPriority}
            frames={frames}
            fbo={fbo}
            fbo2={fbo2}
          >
            {children}
            {/* Without an element that receives pointer events state.pointer will always be 0/0 */}
            <group onPointerOver={() => null} />
          </Container>,
          vScene,
          { events: { compute: compute || uvCompute, priority: eventPriority } }
        )}
        <primitive
          object={fbo.texture}
          {...props}
        />
      </>
    );
  }
);

// The container component has to be separate, it can not be inlined because "useFrame(state" when run inside createPortal will return
// the portals own state which includes user-land overrides (custom cameras etc), but if it is executed in <RenderTexture>'s render function
// it would return the default state.
function Container({ frames, renderPriority, children, fbo, fbo2 }) {
  let count = 0;
  let oldAutoClear;
  let oldXrEnabled;
  let pingpong = false;

  let fboA = fbo;
  let fboB = fbo2;
  useFrame((state) => {
    if (frames === Infinity || count < frames) {
      const curr = pingpong ? fbo : fbo2;
      const prev = pingpong ? fbo2 : fbo;

      oldAutoClear = state.gl.autoClear;
      //   oldXrEnabled = state.gl.xr.enabled;
      state.gl.autoClearColor = true;
      state.gl.autoClear = true;
      //state.gl.autoClearColor = false;

      state.gl.xr.enabled = false;
      state.gl.setRenderTarget(curr);

      state.gl.render(state.scene, state.camera);

      state.gl.setRenderTarget(null);
      state.gl.autoClear = oldAutoClear;
      state.gl.autoClearColor = true;
      state.gl.xr.enabled = oldXrEnabled;

      //   state.gl.setRenderTarget(prev);

      count++;

      pingpong = !pingpong;
    }
  }, renderPriority - 1);
  return <>{children}</>;
}
