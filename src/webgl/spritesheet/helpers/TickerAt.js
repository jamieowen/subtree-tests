class Ticker {
  all = [];

  constructor() {
    this.raf = null;

    this.addListeners();
  }

  addListeners = () => {
    this.raf = requestAnimationFrame(this.onTick);
  };

  removeListeners = () => {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  };

  add = (handler) => {
    this.all.push(handler);
  };

  remove = (handler) => {
    this.all.splice(this.all.indexOf(handler) >>> 0, 1); // eslint-disable-line no-bitwise
  };

  onTick = (delta) => {
    this.all.map((handler) => handler(delta / 1000));
    this.raf = requestAnimationFrame(this.onTick);
  };
}

class TickerAt {
  constructor(fps, handler) {
    this.handler = handler;

    this.fps = fps;
    this.interval = 1000 / this.fps;
    this.then = Date.now();
    this.now = 0;
    this.elapsed = 0;
    this.delta = 0;
    this.startTime = this.then;

    this.ticker = new Ticker();
    this.ticker.add(this.onFrame);
  }

  onFrame = () => {
    this.now = Date.now();

    this.delta = this.now - this.then;
    this.step = Math.round(this.delta / (1000 / this.fps));

    if (this.delta > this.interval) {
      this.then = this.now - (this.delta % this.interval);
      this.elapsed += this.delta / 1000;

      if (this.handler) this.handler(this.delta, this.elapsed, this.step);
    }
  };

  destroy = () => {
    this.ticker.remove(this.onFrame);
  };
}

export default TickerAt;
