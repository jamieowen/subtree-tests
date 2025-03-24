import Spritesheet from './helpers/Spritesheet';
import { Sphere } from '@react-three/drei';

const cache = [];

export const AnimatedSprite = forwardRef(
  (
    {
      _key,
      config,
      scaleBy = 'height',
      autoplay = false,
      materialProps = {},
      anchor = ['center', 'center'], // ['left' | 'right' | 'center', 'top' | 'bottom' | 'center]
      offset = [0, 0, 0], // offset from anchor
      debug = false,
      ...props
    },
    ref
  ) => {
    if (!_key) console.warn('AnimatedSprite should have unique _key');

    const refRoot = useRef(null);
    const refMesh = useRef(null);

    // ANISOTROPY
    // const gl = useThree((state) => state.gl);
    // const anisotropy = useMemo(() => {
    //   gl.capabilities.getMaxAnisotropy();
    // }, [gl]);

    // useEffect(() => {
    //   for (let data of config.data) {
    //     data.texture.anisotropy = anisotropy;
    //   }
    // }, [config, anisotropy]);

    // SPRITESHEET
    const spritesheet = suspend(async () => {
      if (cache[config.id]) {
        console.log('config.id', config.id, 'clone');
        return cache[config.id].clone(config);
      }
      console.log('AnimatedSprite creating new', config.id);
      let out = new Spritesheet(config);
      cache[config.id] = out;
      return out;
    }, [config.id, _key]);

    // ASPECT RATIO
    const scale = useMemo(() => {
      let size = spritesheet.currentFrame.sourceSize;

      if (scaleBy == 'width') {
        return size.w > size.h
          ? [1, 1 * (size.h / size.w), 1]
          : [1 * (size.w / size.h), 1, 1];
      } else {
        return size.w > size.h
          ? [1 * (size.w / size.h), 1, 1]
          : [1, 1 * (size.h / size.w), 1];
      }
    }, [spritesheet]);

    // AUTOPLAY
    useEffect(() => {
      if (autoplay) {
        spritesheet.playSequence(config.sequences[0].id);
      }
    }, [autoplay]);

    // ANCHOR
    const _anchor = useMemo(() => {
      let x = 0;
      let y = 0;

      if (anchor[0] == 'left') x = scale[0] * 0.5;
      if (anchor[0] == 'right') x = scale[0] * -0.5;

      if (anchor[1] == 'top') y = scale[1] * -0.5;
      if (anchor[1] == 'bottom') y = scale[1] * 0.5;

      return [x + offset[0], y + offset[1], offset[2]];
    }, [anchor, scale]);

    // REFS
    useImperativeHandle(ref, () => {
      return {
        refRoot,
        refMesh,
        spritesheet,
        get frame() {
          return spritesheet.sequence.currentFrame;
        },
        set frame(val) {
          let f = Math.floor(val);
          spritesheet.goToFrame(f);
        },
      };
    }, [refRoot, refMesh, spritesheet]);

    return (
      <group
        ref={refRoot}
        {...props}
      >
        {debug && (
          <Sphere args={[0.05, 32, 32]}>
            <meshBasicMaterial color="green" />
          </Sphere>
        )}
        <mesh
          ref={refMesh}
          scale={scale}
          position={_anchor}
        >
          <planeGeometry args={[1, 1]} />
          <SpritesheetMaterial
            config={config}
            spritesheet={spritesheet}
            {...materialProps}
          />
        </mesh>
      </group>
    );
  }
);
