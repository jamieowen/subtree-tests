import EventEmitter from '@/helpers/EventEmitter';
import { clamp } from '@/helpers/MathUtils';
import Raf from '@/helpers/Raf';

const EVENTS = {
  UPDATE: 'EVENTS:UPDATE',
};

class Scroll {
  constructor(el) {
    Object.assign(this, EventEmitter, {
      enabled: false,
      reverse: false, // for forceLandscape
      min: 0,
      max: Infinity,
      x: {
        start: 0,
        delta: 0,
        current: 0,
      },
      y: {
        start: 0,
        delta: 0,
        current: 0,
      },
      final: {
        x: 0,
        y: 0,
      },
      // momentum
      velocity: 0,
      frame: 0,
      timestamp: 0,
      amplitude: 0,
      target: 0,
      polling: null,
      // smooth wheel
      wheelTarget: {
        x: 0,
        y: 0,
      },
    });

    this.start();
  }

  _scrollStart = (event) => {
    const ev =
      typeof window.event !== 'undefined' && window.event.touches
        ? window.event.touches[0]
        : event;

    // internal
    this.enabled = true;
    this.x.current = this.x.start = ev.pageX;
    this.y.current = this.y.start = ev.pageY;

    // momentum
    this.halt();
    this.timestamp = Date.now();
    clearInterval(this.polling);
    this.polling = setInterval(this._track, 50);
  };

  _scrollMove = (event) => {
    if (!this.enabled) {
      return false;
    }

    const ev =
      typeof window.event !== 'undefined' && window.event.touches
        ? window.event.touches[0]
        : event;

    // internal
    this.x.delta = this.x.current - ev.pageX;
    this.y.delta = this.y.current - ev.pageY;
    this.x.current = ev.pageX;
    this.y.current = ev.pageY;

    // external
    const x =
      this.final[!this.reverse ? 'x' : 'y'] +
      (!this.reverse ? this.x.delta : this.x.delta * -1);
    const y =
      this.final[!this.reverse ? 'y' : 'x'] +
      (!this.reverse ? this.y.delta : this.y.delta * -1);
    this.final[!this.reverse ? 'x' : 'y'] = clamp(x, this.min, this.max);
    this.final[!this.reverse ? 'y' : 'x'] = clamp(y, this.min, this.max);

    // sync wheelTarget
    this.wheelTarget[!this.reverse ? 'x' : 'y'] = x;
    this.wheelTarget[!this.reverse ? 'y' : 'x'] = y;

    this.emit(EVENTS.UPDATE);
  };

  _scrollEnd = (event) => {
    if (!this.enabled) {
      return false;
    }

    // internal
    this.enabled = false;
    // reset momentum variable?

    // momentum
    clearInterval(this.polling);
    if (this.velocity > 10 || this.velocity < -10) {
      this.amplitude = 0.8 * this.velocity;
      this.timestamp = Date.now();
      this.target = Math.round(this.final.y + this.amplitude);
    }
  };

  _wheel = (event) => {
    // stop momentum scrolling
    this.halt();

    // get event
    const ev = window.event || event.originalEvent || event;
    // normalize wheel values
    const normalized = this._normalizeWheel(ev);

    // internal
    this.x.delta = normalized.pixelX;
    this.y.delta = normalized.pixelY;

    // external
    this.wheelTarget.x = clamp(
      this.wheelTarget.x + this.x.delta,
      this.min,
      this.max
    );
    this.wheelTarget.y = clamp(
      this.wheelTarget.y + this.y.delta,
      this.min,
      this.max
    );

    this.emit(EVENTS.UPDATE);
  };

  _smoothWheel = () => {
    // tween scroll to soften pc wheel jolt
    this.final.x += (this.wheelTarget.x - this.final.x) * 0.6;
    this.final.y += (this.wheelTarget.y - this.final.y) * 0.6;
  };

  _track = () => {
    const now = Date.now();
    const elapsed = now - this.timestamp;
    const delta = this.final.y - this.frame;
    const v = (1000 * delta) / (1 + elapsed);

    this.timestamp = now;
    this.frame = this.final.y;
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  };

  _momentum = () => {
    if (this.amplitude) {
      const elapsed = Date.now() - this.timestamp;
      const delta = -this.amplitude * Math.exp(-elapsed / 325);
      if (delta > 0.5 || delta < -0.5) {
        this.final.y = clamp(this.target + delta, this.min, this.max);
      } else {
        this.final.y = clamp(this.target, this.min, this.max);
      }
    }
  };

  _update = () => {
    this._smoothWheel();
    this._momentum();
  };

  _preventDefault = (e) => {
    e.preventDefault();
  };

  /* http://stackoverflow.com/a/30134826 */
  _normalizeWheel = (event) => {
    // Reasonable defaults
    const PIXEL_STEP = 10;
    const LINE_HEIGHT = 40;
    const PAGE_HEIGHT = 800;
    let sX = 0;
    let sY = 0;
    let pX = 0;
    let pY = 0;

    // Legacy
    if ('detail' in event) {
      sY = event.detail;
    }
    if ('wheelDelta' in event) {
      sY = -event.wheelDelta / 120;
    }
    if ('wheelDeltaY' in event) {
      sY = -event.wheelDeltaY / 120;
    }
    if ('wheelDeltaX' in event) {
      sX = -event.wheelDeltaX / 120;
    }

    // side scrolling on FF with DOMMouseScroll
    if ('axis' in event && event.axis === event.HORIZONTAL_AXIS) {
      sX = sY;
      sY = 0;
    }

    pX = sX * PIXEL_STEP;
    pY = sY * PIXEL_STEP;

    if ('deltaY' in event) {
      pY = event.deltaY;
    }
    if ('deltaX' in event) {
      pX = event.deltaX;
    }

    if ((pX || pY) && event.deltaMode) {
      if (event.deltaMode === 1) {
        // delta in LINE units
        pX *= LINE_HEIGHT;
        pY *= LINE_HEIGHT;
      } else {
        // delta in PAGE units
        pX *= PAGE_HEIGHT;
        pY *= PAGE_HEIGHT;
      }
    }

    // Fall-back if spin cannot be determined
    if (pX && !sX) {
      sX = pX < 1 ? -1 : 1;
    }
    if (pY && !sY) {
      sY = pY < 1 ? -1 : 1;
    }

    return {
      spinX: sX,
      spinY: sY,
      pixelX: pX,
      pixelY: pY,
    };
  };

  start = () => {
    this.reset();
    this.listen();
  };

  reset = () => {
    this.final.x = 0;
    this.final.y = 0;
    this.halt();
  };

  halt = () => {
    // stop momentum
    this.velocity = this.amplitude = 0;
    this.frame = this.target = this.final.y;

    // stop smooth scroll
    this.wheelTarget.x = this.final.x;
    this.wheelTarget.y = this.final.y;
  };

  listen = () => {
    window.addEventListener('touchstart', this._scrollStart, { passive: true });
    window.addEventListener('touchmove', this._scrollMove, { passive: true });
    window.addEventListener('touchend', this._scrollEnd);

    // window.addEventListener('mousemove', this._scrollMove)
    // window.addEventListener('mousedown', this._scrollStart)
    // window.addEventListener('mouseup', this._scrollEnd)

    window.addEventListener('wheel', this._wheel);
    // window.addEventListener('mousewheel', this._wheel)

    document.body.addEventListener('touchmove', this._preventDefault);

    Raf.add(this._update);
  };

  unlisten = () => {
    window.removeEventListener('touchstart', this._scrollStart, {
      passive: true,
    });
    window.removeEventListener('touchmove', this._scrollMove, {
      passive: true,
    });
    window.removeEventListener('touchend', this._scrollEnd);

    // window.removeEventListener('mousemove', this._scrollMove)
    // window.removeEventListener('mousedown', this._scrollStart)
    // window.removeEventListener('mouseup', this._scrollEnd)

    window.removeEventListener('wheel', this._wheel);
    // window.removeEventListener('mousewheel', this._wheel)

    document.body.removeEventListener('touchmove', this._preventDefault);

    Raf.remove(this._update);
  };
}

Scroll.EVENTS = EVENTS;

export default Scroll;
