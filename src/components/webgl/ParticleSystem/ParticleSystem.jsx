// *************************************************************************************
//
// NOTE:
// - unique _key string is required for each ParticleSystem
//
// TODO:
// - reactive rate
//
// *************************************************************************************

import { randomInRange } from '@/helpers/MathUtils';
import lifeFrag from '@/webgl/glsl/particles/core/life.frag';
import positionFrag from '@/webgl/glsl/particles/core/position.frag';
import rotationFrag from '@/webgl/glsl/particles/core/rotation.frag';
import velocityFrag from '@/webgl/glsl/particles/core/velocity.frag';
import { DataTexture, FloatType, RGBAFormat } from 'three';
import { ParticleSystemContext } from './context';

const defaultVariableConfig = {
  position: {
    enabled: true,
  },
  rotation: {
    enabled: true,
  },
  life: {
    enabled: true,
  },
  random: {
    enabled: true,
  },
};

export const ParticleSystem = memo(
  forwardRef(
    (
      {
        _key, // ***** UNIQUE KEY REQUIRED *****
        enabled = true,
        debug,

        maxParticles = 100,

        // Emission
        duration = 1,
        looping = true,
        delay = 0,
        lifeTime = 1, // life time in seconds. Use [0,1] for random min-max range
        rate = 1, // number to emit per second
        prewarm = false,

        // Starting Speed of ParticleSystem simulation (not individual particles, can be changed by imperative handler)
        speed = 1,

        // Render
        geometry = null, // Render geometry

        variableConfig: _variableConfig,

        // TODO: Allow variables to be disabled

        children,
        ...props
      },
      ref
    ) => {
      if (!_key) console.error('ParticleSystem: _key is required');

      const variableConfig = useMemo(
        () => Object.assign({}, defaultVariableConfig, _variableConfig),
        [_variableConfig]
      );

      // useEffect(() => {
      //   console.log('ParticleSystem: _key', _key);
      // }, []);

      const clock = useThree((state) => state.clock);
      const _speed = useRef(speed);
      const time = useRef(0);

      const refRoot = useRef(null);
      const refMesh = useRef(null);
      const refDebugTexture = useRef(null);

      const dataSize = useMemo(() => {
        let arr = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
        let idx = arr.findIndex((e) => Math.pow(e, 2) >= maxParticles);
        return arr[idx];
      }, []);

      const prewarmTime = useMemo(() => {
        if (!prewarm) return 0;
        let t = lifeTime;
        if (!t) return 0;
        return t;
      }, [prewarm, lifeTime]);

      const _rate = useMemo(() => {
        return Math.floor(rate);
      }, [rate]);

      // ***************************************************************************
      //
      // INIT DATA TEXTURES
      //
      // ***************************************************************************
      // console.log('re-render');
      // const tShapeFrom = useRef(null);

      // TODO
      // const key = useMemo(() => Math.random(), []);

      const tShapeFrom = suspend(async () => {
        // console.log('ParticleSystem', _key, 'tShapeFrom NEW');
        const data = new Float32Array(dataSize * dataSize * 4);
        let dt = new DataTexture(
          data,
          dataSize,
          dataSize,
          RGBAFormat,
          FloatType
        );
        dt.name = `${_key}-tShapeFrom`;
        dt.needsUpdate = true;
        return dt;
      }, [`${_key}-tShapeFrom-${dataSize}`]);

      // useEffect(() => {
      //   () => {
      //     tShapeFrom.dispose();
      //     clear([`${_key}-tShapeFrom-${dataSize}`]);
      //   };
      // }, [tShapeFrom]);

      const tShapeNormal = suspend(async () => {
        // console.log('ParticleSystem', _key, 'tShapeNormal NEW');
        const data = new Float32Array(dataSize * dataSize * 4);
        let dt = new DataTexture(
          data,
          dataSize,
          dataSize,
          RGBAFormat,
          FloatType
        );
        dt.name = `${_key}-tShapeNormal`;
        dt.needsUpdate = true;
        return dt;
      }, [`${_key}-tShapeNormal-${dataSize}`]);

      // useEffect(() => {
      //   () => {
      //     tShapeNormal.dispose();
      //     clear([`${_key}-tShapeFrom-${dataSize}`]);
      //   };
      // }, [tShapeNormal]);

      const tLifeConfig = suspend(async () => {
        // console.log('ParticleSystem', _key, 'tLifeConfig NEW');
        const data = new Float32Array(dataSize * dataSize * 4);

        let dt = new DataTexture(
          data,
          dataSize,
          dataSize,
          RGBAFormat,
          FloatType
        );
        dt.name = `${_key}-tLifeConfig-${dataSize}`;
        dt.needsUpdate = true;

        return dt;
      }, [`${_key}-tLifeConfig-${dataSize}`]);

      const resetLife = useCallback(() => {
        // console.log('reset life', lifeTime, prewarmTime);
        const data = tLifeConfig.image.data;

        let numToInit = duration * _rate;
        let ltMax = duration;
        if (looping) {
          ltMax = Array.isArray(lifeTime) ? lifeTime[1] : lifeTime;
          numToInit = ltMax * _rate;
        }
        // let now = clock.getElapsedTime();
        let now = time.current;

        // console.log(
        //   'resetLife',
        //   dataSize,
        //   maxParticles,
        //   lifeTime,
        //   _rate,
        //   numToInit
        // );

        for (let i = 0; i < numToInit * 4; i += 4) {
          let newStartTime = delay + (i / 4) * (1 / _rate);

          // console.log(newStartTime);

          data[i + 0] = now + newStartTime; // Start Time
          if (prewarm) data[i + 0] -= ltMax;

          // Life Time
          if (Array.isArray(lifeTime)) {
            data[i + 1] = randomInRange(lifeTime[0], lifeTime[1]);
          } else {
            data[i + 1] = lifeTime;
          }

          data[i + 2] = looping ? 1 : 0; // Loop
          data[i + 3] = Math.random(); // ID
        }

        // for (let i = numToInit * 4; i < dataSize * dataSize * 4; i += 4) {
        //   data[i + 0] = now - lifeTime; // Start Time
        //   data[i + 1] = 0; // Life Time
        //   data[i + 2] = 0; // Loop
        //   data[i + 3] = Math.random(); // ID
        // }

        // console.log('ParticleSystem.resetLife');
        tLifeConfig.needsUpdate = true;
      }, [tLifeConfig]);

      // useEffect(() => {
      //   return () => {
      //     tLifeConfig.dispose();
      //     clear([`${_key}-tLifeConfig-${dataSize}`]);
      //   };
      // }, [tLifeConfig]);

      // ***************************************************************************
      //
      // SIMULATOR
      //
      // ***************************************************************************

      const uniforms = useMemo(() => {
        return {
          tShapeFrom: { value: tShapeFrom },
          tShapeNormal: { value: tShapeNormal },
          tLifeConfig: { value: tLifeConfig },
          uWorldPos: { value: new Vector3() },
          uWorldQuat: { value: new Quaternion() },
        };
      }, [tShapeFrom, tShapeNormal, tLifeConfig, maxParticles]);

      // VARIABLES
      const variables = suspend(async () => {
        // console.log('variables');
        const variables = {
          life: {
            shader: lifeFrag,
            dependencies: [],
            data: (i) => {
              if (!prewarm) {
                return [
                  0, // Remaining Time
                  0, // Progress
                  1, // Needs Reset
                  0, // ID
                ];
              } else {
                let config = tLifeConfig.image.data;
                let startTime = config[i + 0];
                let lifeTime = config[i + 1];
                let loop = config[i + 2];
                let id = config[i + 3];

                let uTime = clock.getElapsedTime();
                let remainingTime = lifeTime - startTime;
                if (loop == 1) {
                  remainingTime = lifeTime - ((uTime - startTime) % lifeTime);
                }
                let progress = (lifeTime - remainingTime) / lifeTime;

                return [remainingTime, progress, 0, id];
              }
            },
            uniforms,
          },
          velocity: {
            shader: velocityFrag,
            dependencies: ['position', 'rotation', 'life', 'random'],
            uniforms,
          },
          position: {
            shader: positionFrag,
            dependencies: ['velocity', 'rotation', 'life', 'random'],
            uniforms,
          },
          rotation: {
            shader: rotationFrag,
            dependencies: ['position', 'velocity', 'life', 'random'],
            uniforms,
            data: (i) => {
              return [0, 0, 0, 1];
            },
          },
          random: {
            static: true,
            data: (i) => {
              return [
                Math.random(),
                Math.random(),
                Math.random(),
                Math.random(),
              ];
            },
          },
        };

        // TODO:
        // if (!variableConfig.position.enabled) delete variables.position;
        // if (!variableConfig.rotation.enabled) delete variables.rotation;
        // if (!variableConfig.life.enabled) delete variables.life;
        // if (!variableConfig.random.enabled) delete variables.random;

        return variables;
      }, [`ParticleSystem-${_key}-variables`]);

      const { simulator, applyToMesh, update, updateDebugTexture } =
        useSimulator({
          _key,
          width: dataSize,
          height: dataSize,
          variables,
        });

      useEffect(() => {
        applyToMesh({
          mesh: refMesh.current,
          isInstanced: geometry ? true : false,
        });
        refMesh.current.material.uniforms.tLifeConfig = {
          value: tLifeConfig,
        };
      }, [refMesh, tLifeConfig]);

      // ***************************************************************************
      //
      // UPDATE
      //
      // ***************************************************************************
      useFrame((state, delta) => {
        // if (!enabled) return;
        time.current += delta * _speed.current;

        update(refMesh.current, time.current, delta * _speed.current);

        // console.log(uniforms.uWorldPos.value);
        let u = Object.values(simulator.variableData)[0].uniforms;
        refRoot.current.getWorldPosition(u.uWorldPos.value);
        refRoot.current.getWorldQuaternion(u.uWorldQuat.value);

        if (!debug) return;
        if (debug == 'LifeConfig') {
          refDebugTexture.current.material = true;
          return;
        }
        updateDebugTexture(refDebugTexture.current, debug);
      });
      // console.log('simulator', simulator);

      // ***************************************************************************
      //
      // PREWARM
      //
      // ***************************************************************************

      const doPrewarm = useCallback(() => {
        if (!prewarm) return;

        let fps = 1;
        let frames = Math.floor((prewarmTime || 0) * fps);
        frames = Math.min(Math.max(frames, 1), 10);

        // console.log(_key, prewarm, prewarmTime, frames);

        while (frames--) {
          let d = 1 / fps;
          time.current += d;
          update(refMesh.current, time.current, d);
        }
      }, [prewarm, time, refMesh]);

      // ***************************************************************************
      //
      // ENABLE
      //
      // ***************************************************************************

      const init = () => {
        if (!enabled) return;
        // off();
        time.current = clock.getElapsedTime();
        resetLife();
        doPrewarm();
      };

      useEffect(init, [enabled]);

      // ***************************************************************************
      //
      // METHODS
      //
      // ***************************************************************************
      const burst = useCallback((config = {}) => {
        const _delay = config.delay || 0;
        const _lifeTime = config.lifeTime || lifeTime;
        const amount = config.amount || 100;
        const now = time.current;

        // Update Data
        let data = tLifeConfig.image.data;
        let count = 0;
        for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
          const startTime = data[i + 0];
          const lifeTime = data[i + 1];
          const looping = data[i + 2];

          const isFree = now - startTime > lifeTime;
          if (isFree) {
            data[i + 0] = now + _delay;

            if (Array.isArray(_lifeTime)) {
              data[i + 1] = randomInRange(_lifeTime[0], _lifeTime[1]);
            } else {
              data[i + 1] = _lifeTime;
            }

            data[i + 2] = 0;
            data[i + 3] = Math.random();
            count++;
          }

          if (count >= amount) break;
        }
        tLifeConfig.needsUpdate = true;
      }, []);

      const off = useCallback(() => {
        const data = tLifeConfig.image.data;
        const now = time.current;

        for (let i = 0; i < dataSize * dataSize * 4; i += 4) {
          const startTime = data[i + 0];
          const lt = data[i + 1];

          const started = now >= startTime;
          if (!started) {
            data[i + 0] = now - lt;
          }
          data[i + 2] = 0;
        }
        tLifeConfig.needsUpdate = true;
      }, [tLifeConfig, clock, dataSize]);

      const on = useCallback(() => {
        const data = tLifeConfig.image.data;

        let numToInit = duration * _rate;
        if (looping) {
          let ltMax = Array.isArray(lifeTime) ? lifeTime[1] : lifeTime;
          numToInit = ltMax * _rate;
        }
        let now = clock.getElapsedTime();

        let count = 0;

        for (let i = 0; i < numToInit * 4; i += 4) {
          const startTime = data[i + 0];
          const lt = data[i + 1];

          let isFree = now - startTime > lt;
          isFree = true;
          if (isFree) {
            let newStartTime = delay + (i / 4) * (1 / _rate);
            data[i + 0] = now + newStartTime; // Start Time
            // Life Time
            if (Array.isArray(lifeTime)) {
              data[i + 1] = randomInRange(lifeTime[0], lifeTime[1]);
            } else {
              data[i + 1] = lifeTime;
            }
            data[i + 2] = looping ? 1 : 0; // Loop
            data[i + 3] = Math.random();
          }
          count++;
          if (count >= numToInit) break;
        }

        // for (let i = numToInit * 4; i < dataSize * dataSize * 4; i += 4) {
        //   data[i + 0] = now - lifeTime; // Start Time
        //   data[i + 1] = 0; // Life Time
        //   data[i + 2] = 0; // Loop
        //   data[i + 3] = Math.random(); // ID
        // }

        tLifeConfig.needsUpdate = true;
      }, [tLifeConfig, clock, dataSize, lifeTime, _rate, duration, looping]);

      useImperativeHandle(
        ref,
        () => ({
          simulator,
          burst,
          off,
          on,

          init,
          resetLife,
          doPrewarm,

          mesh: refMesh.current,
          get speed() {
            return _speed.current;
          },
          set speed(val) {
            _speed.current = val;
          },

          // get rate() {},
          // set rate(val) {},
        }),
        [simulator, burst, off, on, uniforms, _speed]
      );

      const ctx = useMemo(() => {
        return {
          _key,
          simulator,
          uniforms,
          dataSize,
          tLifeConfig,
          refMesh,
          maxParticles,
        };
      }, [simulator, uniforms, dataSize, tLifeConfig, refMesh, maxParticles]);

      // ***************************************************************************
      //
      // RENDER
      //
      // ***************************************************************************

      return (
        <group
          {...props}
          ref={refRoot}
        >
          {geometry ? (
            <instancedMesh
              ref={refMesh}
              args={[null, null, maxParticles]}
              silent
              frustumCulled={false}
              geometry={geometry}
            >
              <ParticleSystemContext.Provider value={ctx}>
                {children}
              </ParticleSystemContext.Provider>
            </instancedMesh>
          ) : (
            <points
              ref={refMesh}
              frustumCulled={false}
            >
              <ParticleSystemPointsGeometry dataSize={dataSize} />
              <ParticleSystemContext.Provider value={ctx}>
                {children}
              </ParticleSystemContext.Provider>
            </points>
          )}

          {debug && (
            <DebugTexture
              size={Math.min(Math.max(dataSize, 256), 512)}
              ref={refDebugTexture}
              texture={tLifeConfig}
            />
          )}
        </group>
      );
    }
  )
);
