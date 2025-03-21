import EventEmitter from '@/helpers/EventEmitter';

const Events = {
  MOVE: 'move',
  DOWN: 'down',
  UP: 'up',
};

class Mouse {
  constructor(el) {
    Object.assign(this, EventEmitter, {
      x: 0,
      y: 0,
      down: false,
    });

    this.listen();
  }

  _move = (event) => {
    this.x = event.pageX;
    this.y = event.pageY;

    this.emit(Events.MOVE, {
      x: this.x,
      y: this.y,
    });
  };

  _down = (event) => {
    this.down = true;

    this.emit(Events.DOWN);
  };

  _up = (event) => {
    this.down = false;

    this.emit(Events.UP);
  };

  listen = () => {
    window.addEventListener('mousemove', this._move);
    window.addEventListener('mousedown', this._down);
    window.addEventListener('mouseup', this._up);
    window.addEventListener('mouseleave', this._up);
  };

  unlisten = () => {
    window.removeEventListener('mousemove', this._move);
    window.removeEventListener('mousedown', this._down);
    window.removeEventListener('mouseup', this._up);
    window.removeEventListener('mouseleave', this._up);
  };
}

const mouse = new Mouse();
mouse.Events = Events;
export default mouse;
