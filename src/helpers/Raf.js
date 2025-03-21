class Raf {
  constructor() {
    this.running = false;
    this.rafId = null;
    this._fns = [];

    this.fps = 60;
    this.fpsInterval = 1000 / this.fps;
  }

  _update = () => {
    const time = window.performance.now();
    const delta = time - this.lastTime;

    let i = this._fns.length;
    while (i--) {
      const fn = this._fns[i];
      if (fn) {
        this._fns[i](delta, time);
      }
    }

    this.lastTime = time;
    this.rafId = window.requestAnimationFrame(this._update);
  };

  _updateWithStats = () => {
    this.stats.begin();

    const now = window.performance.now();
    const delta = now - this.lastTime;

    // if (delta < this.fpsInterval) {
    //   this.rafId = window.requestAnimationFrame(this._updateWithStats)
    //   return
    // }

    let i = this._fns.length;
    while (i--) {
      const fn = this._fns[i];
      if (fn) {
        this._fns[i](delta);
      }
    }
    this.stats.end();

    this.lastTime = now;
    this.rafId = window.requestAnimationFrame(this._updateWithStats);
  };

  start = () => {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTime = window.performance.now();
    this.rafId = window.requestAnimationFrame(this._update);
  };

  async startWithStats() {
    const Stats = await import('stats.js');

    this.stats = new Stats.default();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    this.stats.dom.id = 'stats';
    this.stats.dom.style.cssText = 'position:fixed;top:0px;left:0px;';
    document.querySelector('html').appendChild(this.stats.dom);

    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTime = window.performance.now();
    this.rafId = window.requestAnimationFrame(this._updateWithStats);
  }

  stop = () => {
    window.cancelAnimationFrame(this.rafId);
    this.running = false;
  };

  add = (fn) => {
    if (typeof fn === 'function') {
      if (this._fns.includes(fn)) {
        return false;
      }
      this._fns.push(fn);
      return true;
    } else {
      return false;
    }
  };

  remove = (fn) => {
    const idx = this._fns.indexOf(fn);
    if (idx >= 0) {
      this._fns.splice(idx, 1);
    }
  };

  nextFrame = () => {
    return new Promise((resolve) => {
      window.requestAnimationFrame(resolve);
    });
  };

  nextFrames = async (num = 1) => {
    for (let i = 0; i < num; i++) {
      await this.nextFrame();
    }
  };
}

const raf = new Raf();
window.Raf = raf;
export default raf;
