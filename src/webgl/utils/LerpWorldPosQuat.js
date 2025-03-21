import { linear } from '@/helpers/Ease';

export class LerpWorldPosQuat {
  from = {
    position: new Vector3(),
    quaternion: new Quaternion(),
  };

  to = {
    position: new Vector3(),
    quaternion: new Quaternion(),
  };

  constructor(ref, refFrom, refTo, ease = linear) {
    this.ref = ref;
    this.refFrom = refFrom;
    this.refTo = refTo;
    this.ease = ease;
  }

  update(alpha) {
    this.refFrom.current.getWorldPosition(this.from.position);
    this.refFrom.current.getWorldQuaternion(this.from.quaternion);
    this.refTo.current.getWorldPosition(this.to.position);
    this.refTo.current.getWorldQuaternion(this.to.quaternion);

    let a = this.ease(alpha);

    this.ref.current.quaternion.slerpQuaternions(
      this.from.quaternion,
      this.to.quaternion,
      a
    );
    this.ref.current.position.lerpVectors(
      this.from.position,
      this.to.position,
      a
    );
  }
}

export default LerpWorldPosQuat;
