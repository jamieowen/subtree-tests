import { urls } from '@/config/assets';

export const Sprite = forwardRef(
  (
    {
      _key,
      id,
      numSheets = 1,
      fps = 8,
      sequences,
      materialProps = {},
      ...props
    },
    ref
  ) => {
    const refAnimatedSprite = useRef(null);

    const jsonUrls = useMemo(() => {
      return Array.from({ length: numSheets }, (_, i) => urls[`j_${id}_${i}`]);
    }, [id, numSheets]);

    const textureUrls = useMemo(() => {
      return Array.from({ length: numSheets }, (_, i) => urls[`t_${id}_${i}`]);
    }, [id, numSheets]);

    // const jsons = useJson(jsonUrls);
    const jsons = useAsset(jsonUrls);
    const textures = useAsset(textureUrls);

    const data = useMemo(() => {
      let out = [];
      for (let i = 0; i < jsons.length; i++) {
        out.push({
          json: jsons[i],
          texture: textures[i],
        });
      }
      return out;
    }, [jsons, textures]);

    const config = useMemo(() => {
      return {
        id,
        fps,
        data,
        sequences: sequences || [
          //
          {
            id: 'loop',
            from: 0,
            to: Object.keys(data[0].json.frames).length - 1,
            loop: 0,
          },
        ],
      };
    }, [id, fps, sequences, data]);

    const numFrames = useMemo(() => {
      return Object.keys(data[0].json.frames).length - 1;
    }, [data]);

    useImperativeHandle(ref, () => {
      return {
        refAnimatedSprite,
        get frame() {
          return refAnimatedSprite.current.frame;
        },
        set frame(val) {
          refAnimatedSprite.current.frame = val;
        },
        get progress() {
          return Math.floor(refAnimatedSprite.current.frame / numFrames);
        },
        set progress(val) {
          refAnimatedSprite.current.frame = Math.floor(val * numFrames);
        },
      };
    }, [numFrames]);

    return (
      <>
        <AnimatedSprite
          ref={refAnimatedSprite}
          config={config}
          materialProps={materialProps}
          _key={_key}
          {...props}
        />
      </>
    );
  }
);
