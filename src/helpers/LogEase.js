export class LogEase {
  constructor({ to = 0, current = 0, ease = 0.1, minDist = 0.0001 } = {}) {
    this.current = current;
    this.to = to;
    this.ease = ease;
    this.minDist = minDist;
  }

  process = () => {
    this.current += (this.to - this.current) * this.ease;
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

export default LogEase;
