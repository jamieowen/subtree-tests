import EventEmitter from '@/helpers/EventEmitter';

import Env from '@/helpers/Env';

const Events = {
  START: 'touchstart',
  MOVE: 'touchmove',
  END: 'touchend',
};

class Touch {
  constructor(el) {
    Object.assign(this, EventEmitter);
    this.el = el;
    this.x = null;
    this.y = null;
    this.touching = false;
    this.listening = false;
    this.dragging = false;
    this.listen();
  }

  _onTouchStart = (evt) => {
    if (Env.mobile) {
      window.addEventListener('touchmove', this._onTouchMove);
      window.addEventListener('touchend', this._onTouchEnd);
    } else {
      window.addEventListener('mousemove', this._onTouchMove);
      window.addEventListener('mouseup', this._onTouchEnd);
    }
    const ev = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    this.x = ev.pageX / window.innerWidth - 0.5;
    this.y = ev.pageY / window.innerHeight - 0.5;
    this.start = {
      x: this.x,
      y: this.y,
    };
    this.touching = true;
    this.dragging = false;
    this.touchStartTime = window.performance.now();
    this.emit(Events.START, { x: this.x, y: this.y, originalEvent: evt });
  };

  _onTouchMove = (evt) => {
    const ev = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    const x = ev.pageX / window.innerWidth - 0.5;
    const y = ev.pageY / window.innerHeight - 0.5;
    const diffFromStart = {
      x: x - this.start.x,
      y: y - this.start.y,
    };
    const diff = {
      x: (x - this.x) * window.innerWidth,
      y: (y - this.y) * window.innerHeight,
    };
    this.x = x;
    this.y = y;
    if (Math.abs(diff.x) > 2 || Math.abs(diff.y) > 2) {
      this.dragging = true;
    }
    this.emit(Events.MOVE, {
      x: this.x,
      y: this.y,
      diff,
      start: this.start,
      diffFromStart,
      originalEvent: evt,
    });
  };

  _onTouchEnd = (evt) => {
    if (Env.mobile) {
      window.removeEventListener('touchmove', this._onTouchMove);
      window.removeEventListener('touchend', this._onTouchEnd);
    } else {
      window.removeEventListener('mousemove', this._onTouchMove);
      window.removeEventListener('mouseup', this._onTouchEnd);
    }

    // Check is click
    const duration = window.performance.now() - this.touchStartTime;
    const isClick = duration < 1000 && !this.dragging;

    // Emit
    this.dragging = false;
    this.touching = false;
    this.emit(Events.END, {
      x: this.x,
      y: this.y,
      isClick,
      originalEvent: evt,
    });
  };

  listen() {
    if (this.listening) {
      return;
    }
    this.listening = true;
    if (Env.mobile) {
      this.el.addEventListener('touchstart', this._onTouchStart);
    } else {
      this.el.addEventListener('mousedown', this._onTouchStart);
    }
  }

  unlisten() {
    if (!this.listening) {
      return;
    }
    this.listening = false;
    this.touching = false;
    if (Env.mobile) {
      this.el.removeEventListener('touchstart', this._onTouchStart);
      window.removeEventListener('touchmove', this._onTouchMove);
      window.removeEventListener('touchend', this._onTouchEnd);
    } else {
      this.el.removeEventListener('mousedown', this._onTouchStart);
      window.removeEventListener('mousemove', this._onTouchMove);
      window.removeEventListener('mouseup', this._onTouchEnd);
    }
  }

  destroy() {
    this.unlisten();
    this.el = null;
    this.x = null;
    this.y = null;
    this.touching = null;
    this.listening = null;
  }
}

Touch.Events = Events;

export default Touch;
