import { useDrag } from '@use-gesture/react';
import { damp, dampE, exp } from 'maath/easing';
import { LogEase } from '@/helpers/LogEase';
import { useAppStore } from '@/stores/app';
import { FillingECS } from '../state';
import { urls } from '@/config/assets';

const beltEntities = FillingECS.world.with('belt');
const bottleEntities = FillingECS.world.with('isBottle');
const fillingEntities = FillingECS.world.with('filling');
const filledEntities = FillingECS.world.with('filled');

export const FillingSystemControls = ({
  within = 0.25,
  multiplier = 0.01,
  oneDirection = false,
  textureConfigs,
}) => {
  const current = useRef(0);
  const speed = useRef(1.5);
  const fillTime = useRef(1);

  const textures = useAsset([
    urls.t_filling_bottle25,
    urls.t_filling_bottle50,
    urls.t_filling_bottle75,
    urls.t_filling_bottle100,
  ]);

  const setBeltLocked = (locked) => {
    for (let entity of beltEntities) {
      entity.locked = locked;
    }
  };

  const onFill = async (pos) => {
    setBeltLocked(true);

    const distance = Math.abs(current.current - pos);
    if (distance > 0) {
      await gsap
        .to(current, {
          current: pos,
          duration: distance,
        })
        .then();
    }

    let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
    FillingECS.world.addComponent(bottleToFill, 'filling', true);
  };

  const gl = useThree((state) => state.gl);

  const onPointerDown = () => {
    const isLocked = beltEntities.entities[0].locked;
    if (isLocked) return;

    let pos = current.current;
    let remainder = Math.abs(pos) % 1;
    // onFill(0); // TODO
    if (remainder >= 1 - within) {
      onFill(Math.ceil(pos));
    }
  };

  const onPointerUp = async () => {
    let pos = current.current;
    let bottleToFill = bottleEntities.entities.find((e) => e.idx == pos);
    if (bottleToFill) {
      FillingECS.world.removeComponent(bottleToFill, 'filling', true);
      FillingECS.world.addComponent(bottleToFill, 'ended', true);

      let frame = bottleToFill.frame;
      let progress = frame / 47;
      if (progress >= 1) {
        FillingECS.world.addComponent(bottleToFill, 'filled', true);
      }

      let config = textureConfigs.find((c) => frame <= c.end - 1);

      bottleToFill.sprite.current.map = textures[config.idx];
      bottleToFill.sprite.current.material.needsUpdate = true;
      // bottleToFill.sprite.current.rows = config.rows;
      // bottleToFill.sprite.current.cols = config.cols;
      // bottleToFill.sprite.current.frames = config.frames;
      let toFrame = config.frames - 1;
      let duration = (toFrame - frame) / 24;
      console.log('onPointerUp', frame, toFrame);

      if (frame < toFrame) {
        await gsap
          .to(bottleToFill, {
            frame: toFrame,
            duration,
            ease: 'none',
          })
          .then();
      }
    }

    setBeltLocked(false);
  };

  useEffect(() => {
    gl.domElement.addEventListener('pointerdown', onPointerDown);
    gl.domElement.addEventListener('pointerup', onPointerUp);
    return () => {
      gl.domElement.removeEventListener('pointerdown', onPointerDown);
      gl.domElement.removeEventListener('pointerup', onPointerUp);
    };
  }, []);

  useFrame((state, delta) => {
    const isLocked = beltEntities.entities[0].locked;
    if (!isLocked) {
      const count = filledEntities.entities.length;
      speed.current = 1.5 + count * 0.5;
      current.current += delta * speed.current;
    }

    for (const entity of beltEntities) {
      entity.belt = current.current;
    }

    let fps = 24;
    for (const entity of fillingEntities) {
      if (entity.filling) {
        entity.frame += delta * fps;
      }

      if (entity.frame >= 47) {
        entity.frame = 47;
        FillingECS.world.removeComponent(entity, 'filling', true);
        FillingECS.world.addComponent(entity, 'filled', true);
      }
    }

    // for (const entity of bottleEntities) {
    //   console.log(entity.frame);
    // }
  });

  return null;
};
