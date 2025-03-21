import { createPortal } from '@react-three/fiber';
import { useFBO } from '@react-three/drei';
import baseVert from '@/webgl/glsl/utils/base.vert';
import { Scene } from 'three';
import circleSDF from '@/webgl/glsl/lygia/sdf/circleSDF.glsl';
import fill from '@/webgl/glsl/lygia/draw/fill.glsl';
import { map } from '@/helpers/MathUtils';

export const siteFlowMapUniform = {
  value: null,
};

export const FlowMap = ({
  size = 256,
  falloff = 0.12,
  alpha = 1.0,
  dissipation = 0.99,
  debug = false,
}) => {
  const _size = useThree((s) => s.size);

  const fbo1 = useFBO(size, size);
  const fbo2 = useFBO(size, size);
  fbo1.name = 'fbo1';
  fbo2.name = 'fbo2';

  const fbos = useMemo(() => {
    return {
      read: fbo1,
      write: fbo2,
    };
  });

  const [vScene] = useState(() => new Scene());

  const shader = useMemo(() => {
    return {
      uniforms: {
        tMap: { value: fbos.read.textures[0] },
        uFalloff: { value: falloff * 0.5 },
        uAlpha: { value: alpha },
        uDissipation: { value: dissipation },
        uAspect: { value: _size.width / _size.height },
        uMouse: { value: new Vector2() },
        uVelocity: { value: new Vector2() },
        uPulse: { value: 0 },
      },
      vertexShader: baseVert,
      fragmentShader: /*glsl*/ `

        uniform sampler2D tMap;

        uniform float uFalloff;
        uniform float uAlpha;
        uniform float uDissipation;

        uniform float uAspect;
        uniform vec2 uMouse;
        uniform vec2 uVelocity;
        uniform float uPulse;

        varying vec2 vUv;

        ${fill}
        ${circleSDF}

        void main() {

          vec4 color = texture2D(tMap, vUv) * uDissipation;

          vec2 cursor = vUv - uMouse;
          cursor.x *= uAspect;

          // Stamp
          vec3 stamp = vec3(uVelocity * vec2(1, -1), 1.0 - pow(1.0 - min(1.0, length(uVelocity)), 3.0));
          float falloff = smoothstep(uFalloff, 0.0, length(cursor)) * uAlpha;
          color.rgb = mix(color.rgb, stamp, vec3(falloff));

          // Pulse
          float pulse = fill(circleSDF(cursor + 0.5), uFalloff, uFalloff) * uPulse;
          color.rgb = mix(color.rgb, vec3(1.), pulse);
          // color.rgb += vec3(pulse);

          gl_FragColor.rgb = color.rgb;
          // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
      `,

      depthTest: false,
    };
  }, []);

  const refDebug = useRef(null);
  const getMouse = useMouse2();
  let lastTime;

  let lastMouse = useMemo(() => new Vector2(), []);
  const velocity = useMemo(() => new Vector2(), []);

  useFrame(({ clock }, delta) => {
    let time = clock.getElapsedTime();

    // UPDATE MOUSE
    const { x, y } = getMouse(0.2, delta);
    shader.uniforms.uMouse.value.x = x;
    shader.uniforms.uMouse.value.y = 1 - y;

    let sx = x * _size.width;
    let sy = y * _size.height;

    if (!lastTime) {
      lastTime = time;
      lastMouse.set(sx, sy);
    }

    const deltaX = sx - lastMouse.x;
    const deltaY = sy - lastMouse.y;

    lastMouse.set(sx, sy);

    if (deltaX == 0 && deltaY == 0) {
      // shader.uniforms.uMouse.value.x = -1.0;
      // shader.uniforms.uMouse.value.y = -1.0;
      velocity.x = 0;
      velocity.y = 0;
    } else {
      let delta = Math.max(14, time - lastTime);
      lastTime = time;

      velocity.x = deltaX / delta;
      velocity.y = deltaY / delta;
    }

    shader.uniforms.uVelocity.value.lerp(
      velocity,
      velocity.length() ? 0.5 : 0.1
    );

    // SWAP FBOS
    let lastRead = fbos.read;
    fbos.read = fbos.write;
    fbos.write = lastRead;
    shader.uniforms.tMap.value = fbos.read.textures[0];

    // OUT
    siteFlowMapUniform.value = fbos.read.textures[0];

    // DEBUG
    if (debug && refDebug.current) refDebug.current.map = fbos.read.textures[0];
  }, -2);

  // PULSE
  // const onPulseUpdate = (v) => {
  //   shader.uniforms.uPulse.value = map(v, 0, 1, 0, 1);
  // };

  // useToggleEventAnimation({
  //   inParams: {
  //     event: POINTER_DOWN,
  //     ease: 'expo.out',
  //     duration: 0.3,
  //     // onUpdate: onPulseUpdate,
  //     onStart: () => {
  //       let tl = new gsap.timeline({ options: { overwrite: true } });
  //       tl.to(shader.uniforms.uPulse, {
  //         value: 1,
  //         duration: 0.1,
  //         ease: 'expo.out',
  //       });
  //       tl.to(shader.uniforms.uPulse, {
  //         value: 0,
  //         duration: 1,
  //         ease: 'power1.out',
  //       });
  //     },
  //   },
  // });

  useEffect(() => {
    shader.uniforms.uAspect.value = _size.width / _size.height;
  }, [shader, _size]);
  useEffect(() => {
    shader.uniforms.uFalloff.value = falloff;
  }, [shader, falloff]);
  useEffect(() => {
    shader.uniforms.uAlpha.value = alpha;
  }, [shader, alpha]);
  useEffect(() => {
    shader.uniforms.uDissipation.value = dissipation;
  }, [shader, dissipation]);

  return (
    <>
      {createPortal(
        <Container fbos={fbos}>
          <FsTriangleCamera />
          <mesh geometry={fsTriangle}>
            <shaderMaterial {...shader} />
          </mesh>
        </Container>,
        vScene
      )}

      {debug && (
        <DebugTexture
          size={size / 2}
          ref={refDebug}
        />
      )}
    </>
  );
};

const Container = ({ children, fbos }) => {
  let oldAutoClear;

  useFrame((state) => {
    oldAutoClear = state.gl.autoClear;
    state.gl.autoClear = false;
    state.gl.setRenderTarget(fbos.write);
    state.gl.render(state.scene, state.camera);
    state.gl.setRenderTarget(null);
    state.gl.autoClear = oldAutoClear;
  }, -1);

  return <>{children}</>;
};
