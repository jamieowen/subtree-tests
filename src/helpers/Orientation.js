import EventEmitter from '@/helpers/EventEmitter';

const Events = {
  DEVICE_ORIENTATION: 'deviceorientation',
};

class Orientation {
  constructor() {
    Object.assign(this, EventEmitter);
    this.supported = false;
    this.absolute = null;
    this.alpha = null;
    this.beta = null;
    this.gamma = null;
    this.listen();
  }

  _onDeviceOrientation = (evt) => {
    this.supported = true;
    this.absolute = evt.absolute;
    this.alpha = evt.alpha;
    this.beta = evt.beta;
    this.gamma = evt.gamma;
    this.emit(Events.DEVICE_ORIENTATION, { x: this.x, y: this.y });
  };

  listen() {
    window.addEventListener('deviceorientation', this._onDeviceOrientation);
  }

  unlisten() {
    window.removeEventListener('deviceorientation', this._onDeviceOrientation);
  }
}

Orientation.Events = Events;

export default Orientation;
