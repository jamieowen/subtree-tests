import { WiggleRig } from '@/libs/wiggle.0.0.3/WiggleRig';
import { WiggleRigHelper } from '@/libs/wiggle.0.0.3/WiggleRigHelper';

export const useWiggleBone = ({ _key, skeleton, wiggleVelocity = 0.01 }) => {
  if (!_key) {
    console.warn('useWiggleBone requires _key', _key, skeleton);
  }

  const [rootBone, setRootBone] = useState(null);
  const [helper, setHelper] = useState(null);

  const _skeleton = useMemo(() => {
    // const skele = skeleton.clone();
    const skele = skeleton;
    skele.bones.forEach((bone) => {
      if (!bone?.parent?.isBone) {
        setRootBone(bone);
      } else {
        bone.userData.wiggleVelocity = wiggleVelocity;
      }
    });

    return skele;
  }, [skeleton]);

  // SETUP

  const rig = suspend(async () => {
    return new WiggleRig(_skeleton);
  }, [_key]);

  // useEffect(() => {
  //   if (!rig) rig = new WiggleRig(_skeleton);
  // }, [_skeleton]);

  // UPDATE
  useFrame(({ clock }, delta) => {
    rig.update();
  });

  return { skeleton: _skeleton, rootBone, helper, rig };
};
