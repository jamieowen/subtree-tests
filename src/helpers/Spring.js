const PRECISION = 0.0001;

export class Spring {
  constructor({ to = 0, current = 0, damping = 0.3, tension = 0.1 } = {}) {
    this.current = current;
    this.to = to;
    this.velocity = 0;
    this.damping = damping;
    this.tension = tension;
  }

  process = () => {
    this.velocity =
      (this.velocity + (this.to - this.current) * this.tension) *
      (1 - this.damping);
    this.current =
      Math.round((this.current + this.velocity) * (1 / PRECISION)) /
      (1 / PRECISION);
    return this.current;
  };

  update = (to) => {
    this.to = to;
    this.process();
    return this.current;
  };

  set = (to) => {
    if (to !== undefined) {
      this.to = to;
    }
    this.current = this.to;
  };
}

export class Lazy {
  constructor({ to = 0, current = 0, damping = 0.3, minDist = 0.0001 } = {}) {
    this.current = current;
    this.to = to;
    this.damping = damping;
    this.minDist = minDist;
  }

  process = () => {
    this.current += (this.to - this.current) * this.damping;
    if (Math.abs(this.to - this.current) < this.minDist) {
      this.current = this.to;
    }
    return this.current;
  };

  update = (to) => {
    this.to = to;
    this.process();
    return this.current;
  };

  set = (to) => {
    if (to !== undefined) {
      this.to = to;
    }
    this.current = this.to;
  };
}

export default Spring;
