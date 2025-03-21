import { createPortal } from '@react-three/fiber';
import { useFBO, Preload } from '@react-three/drei';
import tunnel from 'tunnel-rat';

import {
  Scene,
  Object3D,
  NoColorSpace,
  SRGBColorSpace,
  LinearSRGBColorSpace,
  LinearFilter,
  DepthTexture,
  FloatType,
  DepthStencilFormat,
  UnsignedInt248Type,
  UnsignedIntType,
} from 'three';

export const RenderTextureMulti = forwardRef(
  (
    {
      children,
      compute,
      width,
      height,
      maxDpr,
      samples = 0,
      renderPriority = 0,
      eventPriority = 0,
      frames = Infinity,
      stencilBuffer = false,
      depthBuffer = false,
      generateMipmaps = false,
      depth = false, // create depth texture

      // Support multi render targets
      count = 1,
      textureConfig,

      // Support alternate frame rendering
      renderOn, // undefined means render every frame, 0 or 1 means render every other frame, render if frameCount % 2 == renderOn
      frameNum = { current: 0 },

      // Support filter types
      minFilter = LinearFilter,
      magFilter = LinearFilter,

      idx,

      ...props
    },
    forwardRef
  ) => {
    const size = useThree((state) => state.size);
    const viewport = useThree((state) => state.viewport);
    const _dpr = maxDpr ? Math.min(viewport.dpr, maxDpr) : viewport.dpr;

    const _width = typeof width === 'number' ? width : size.width * _dpr;
    const _height = typeof height === 'number' ? height : size.height * _dpr;

    const fbo = useFBO(_width, _height, {
      samples,
      // depth,
      stencilBuffer,
      depthBuffer,
      generateMipmaps,
      count,
      minFilter,
      magFilter,
      // colorSpace: NoColorSpace,
      // colorSpace: SRGBColorSpace,
      // colorSpace: LinearSRGBColorSpace,
    });

    // DEPTH TEXTURE
    const tDepth = useMemo(() => {
      return new DepthTexture(_width, _height, UnsignedIntType);
    }, []);
    useEffect(() => {
      fbo.depthTexture = tDepth;
    }, [fbo, tDepth]);
    useEffect(() => {
      return () => {
        tDepth.dispose();
      };
    }, [tDepth]);
    useEffect(() => {
      if (stencilBuffer) {
        tDepth.format = DepthStencilFormat;
        tDepth.type = UnsignedInt248Type;
      } else {
        tDepth.type = UnsignedIntType;
        // tDepth.type = UnsignedIntType;
      }
    }, [stencilBuffer]);

    // TEXTURE FORMAT
    useEffect(() => {
      if (textureConfig) {
        // console.log('textureConfig', textureConfig);
        for (let idx = 0; idx < textureConfig.length; idx++) {
          Object.assign(fbo.textures[idx], textureConfig[idx]);
          fbo.textures[idx].needsUpdate = true;
        }
      }
    }, [fbo, textureConfig]);

    const [vScene] = useState(() => new Scene());

    const uvCompute = useCallback((event, state, previous) => {
      // Since this is only a texture it does not have an easy way to obtain the parent, which we
      // need to transform event coordinates to local coordinates. We use r3f internals to find the
      // next Object3D.
      let parent = fbo.texture?.__r3f.parent?.object;

      while (parent && !(parent instanceof Object3D)) {
        parent = parent.__r3f.parent?.object;
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

      // console.log('uv', uv);
      if (!uv) return false;

      state.raycaster.setFromCamera(
        state.pointer.set(uv.x * 2 - 1, uv.y * 2 - 1),
        // state.pointer.set(
        //   (event.clientX / _width) * 2 - 1,
        //   -(event.clientY / _height) * 2 + 1
        // ),
        state.camera
      );
    }, []);

    useImperativeHandle(
      forwardRef,
      () => ({
        texture: fbo.texture,
        fbo,
        idx,
        vScene: vScene,
        tDepth,
      }),
      [fbo]
    );

    return (
      <>
        {createPortal(
          <Container
            idx={idx}
            renderPriority={renderPriority}
            renderOn={renderOn}
            frameNum={frameNum}
            frames={frames}
            fbo={fbo}
          >
            {children}

            <group onPointerOver={() => null} />
          </Container>,
          vScene,
          { events: { compute: compute || uvCompute, priority: eventPriority } }
        )}
        <primitive
          object={fbo.texture}
          attach="map"
          {...props}
        />
      </>
    );
  }
);

// The container component has to be separate, it can not be inlined because "useFrame(state" when run inside createPortal will return
// the portals own state which includes user-land overrides (custom cameras etc), but if it is executed in <RenderTexture>'s render function
// it would return the default state.
function Container({
  idx,
  frames,
  renderPriority,
  renderOn,
  frameNum,
  children,
  fbo,
}) {
  let count = useMemo(() => 0, []);
  let oldAutoClear;
  let oldXrEnabled;

  useFrame((state) => {
    if (
      renderOn?.current != undefined &&
      frameNum.current % 2 != renderOn.current
    ) {
      return;
    }
    if (frames === Infinity || count < frames) {
      oldAutoClear = state.gl.autoClear;
      state.gl.autoClear = true;
      state.gl.setRenderTarget(fbo);
      state.gl.render(state.scene, state.camera);
      state.gl.setRenderTarget(null);
      state.gl.autoClear = oldAutoClear;
    }

    count++;
  }, renderPriority);
  return <>{children}</>;
}
