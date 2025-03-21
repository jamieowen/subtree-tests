import Raf from '@/helpers/Raf';

export default class Typed {
  constructor(
    el,
    { line = '', typeSpeed = 100, startDelay = 0, onComplete = () => {} } = {}
  ) {
    Object.assign(this, {
      el,
      line,
      chars: line.split(''),
      typeSpeed,
      startDelay,
      onComplete,
      current: 0,
      last: Date.now(),
    });

    this.start();
  }

  _update = () => {
    const now = Date.now();
    if (now - this.last > this.typeSpeed) {
      this.el.innerHTML += this.chars[this.current++];
      this.last = now;
      if (this.current === this.chars.length) {
        this._ended();
      }
    }
  };

  _ended = () => {
    Raf.remove(this._update);
    this.onComplete();
  };

  start = () => {
    setTimeout(() => {
      Raf.add(this._update);
    }, this.startDelay);
  };

  stop = () => {
    this._ended();
    this.current = 0;
    this.el.innerHTML = '';
  };
}
