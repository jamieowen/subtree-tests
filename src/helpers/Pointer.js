import EventEmitter from '@/helpers/EventEmitter';

const Events = {
  START: 'touchstart',
  MOVE: 'touchmove',
  END: 'touchend',
};

const Constants = {
  AXIS: {
    X: 'axis:x',
    Y: 'axis:y',
  },
  DIRECTION: {
    UP: 'direction:up',
    DOWN: 'direction:down',
    LEFT: 'direction:left',
    RIGHT: 'direction:right',
  },
};

class Pointer {
  constructor() {
    Object.assign(this, EventEmitter);
    this.el = window;
    this.x = null;
    this.y = null;
    this.touching = false;
    this.listening = false;
    this.axisThreshold = 7;
    this.axis = '';
    this.direction = '';
    this.delta = { x: 0, y: 0 };
    this.distance = { x: 0, y: 0 };
    this.start = { x: 0, y: 0 };
    this.cartesian = { x: 0, y: 0 };
    this.polar = { x: 0, y: 0 };
    this.listen();
  }

  _onTouchStart = (evt) => {
    // window.addEventListener('mousemove', this._onTouchMove)
    window.addEventListener('touchmove', this._onTouchMove);
    window.addEventListener('mouseup', this._onTouchEnd);
    window.addEventListener('touchend', this._onTouchEnd);
    const ev = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    this.x = parseInt(ev.clientX);
    this.y = parseInt(ev.clientY);
    this.touching = true;
    this.start = { x: this.x, y: this.y };
    this.emit(Events.START);
  };

  _onTouchMove = (evt) => {
    const ev = evt.touches && evt.touches[0] ? evt.touches[0] : evt;
    const x = ev.clientX;
    const y = ev.clientY;
    this.distance.x = parseInt(x) - this.start.x;
    this.distance.y = parseInt(y) - this.start.y;
    this.cartesian.x = x / window.innerWidth - 0.5;
    this.cartesian.y = y / window.innerHeight - 0.5;
    this.polar.x = (x - window.innerWidth * 0.5) / (window.innerWidth * 0.5);
    this.polar.y = (y - window.innerHeight * 0.5) / (window.innerHeight * 0.5);
    this.delta = {
      x: x - this.x,
      y: y - this.y,
    };
    this.x = x;
    this.y = y;
    this.emit(Events.MOVE);

    this.setAxis();
    this.setDirection();
  };

  setAxis() {
    if (this.axis === '') {
      if (Math.abs(this.distance.x) > Math.abs(this.distance.y)) {
        if (Math.abs(this.distance.x) > this.axisThreshold) {
          this.axis = Constants.AXIS.X;
        }
      } else {
        if (Math.abs(this.distance.y) > this.axisThreshold) {
          this.axis = Constants.AXIS.Y;
        }
      }
    }
  }

  setDirection() {
    if (this.axis === Constants.AXIS.X) {
      this.direction =
        this.distance.x > 0
          ? Constants.DIRECTION.RIGHT
          : Constants.DIRECTION.LEFT;
    } else if (this.axis === Constants.AXIS.Y) {
      this.direction =
        this.distance.y > 0 ? Constants.DIRECTION.DOWN : Constants.DIRECTION.UP;
    }
  }

  _onTouchEnd = () => {
    // window.removeEventListener('mousemove', this._onTouchMove)
    window.removeEventListener('touchmove', this._onTouchMove);
    window.removeEventListener('mouseup', this._onTouchEnd);
    window.removeEventListener('touchend', this._onTouchEnd);
    this.touching = false;
    this.emit(Events.END, { x: this.x, y: this.y });
    this.direction = this.axis = '';
  };

  listen() {
    if (this.listening) {
      return;
    }
    this.listening = true;
    this.el.addEventListener('mousedown', this._onTouchStart);
    this.el.addEventListener('touchstart', this._onTouchStart);
    window.addEventListener('mousemove', this._onTouchMove, { passive: false });
  }

  unlisten() {
    if (!this.listening) {
      return;
    }
    this.listening = false;
    this.touching = false;
    this.el.removeEventListener('mousedown', this._onTouchStart);
    this.el.removeEventListener('touchstart', this._onTouchStart);
    window.removeEventListener('mousemove', this._onTouchMove);
    window.removeEventListener('touchmove', this._onTouchMove);
    window.removeEventListener('mouseup', this._onTouchEnd);
    window.removeEventListener('touchend', this._onTouchEnd);
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

const pointer = new Pointer();
pointer.Events = Events;
pointer.Constants = Constants;
export default pointer;
