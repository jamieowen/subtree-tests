import EventEmitter from '@/helpers/EventEmitter';
// require('@/libs/compass')
// let Compass = window.Compass

const Events = {
  UPDATE: 'update',
  DEVICE_ORIENTATION: 'device-orientation',
  SCREEN_ORIENTATION: 'screen-orientation',
};

class Gyro {
  constructor(el) {
    Object.assign(this, EventEmitter, {
      device: {
        alpha: 0,
        beta: 0,
        gamma: 0,
      },
      screen: {
        orient: 0,
      },
      heading: null,
      gravity: true,
      landscape: false,
    });
  }

  init() {
    return this.getPermission().then((response) => {
      if (response === 'granted') {
        this.listen();
      }
    });
  }

  getPermission() {
    return new Promise(async (resolve) => {
      if (!window.DeviceMotionEvent) {
        return resolve('denied');
      }
      if (typeof window.DeviceMotionEvent.requestPermission === 'function') {
        const response = await window.DeviceMotionEvent.requestPermission();
        resolve(response);
      } else {
        resolve('granted');
      }
    });
  }

  _motion = (evt) => {
    const { x, y, z } = this.gravity
      ? evt.accelerationIncludingGravity
      : evt.acceleration;
    const { alpha, beta, gamma } = evt.rotationRate || null;

    const result = {
      x: this.landscape ? y : x || -1,
      y: this.landscape ? x : y || -1,
      z: z || -1,
      rotation: {
        alpha: alpha || -1,
        beta: beta || -1,
        gamma: gamma || -1,
      },
      alpha,
      beta,
      gamma,
    };

    this.emit(Events.UPDATE, result);
  };

  _deviceOrientation = (evt) => {
    this.device.alpha = evt.alpha;
    this.device.beta = evt.beta;
    this.device.gamma = evt.gamma;
    this.emit(Events.DEVICE_ORIENTATION, this.devivce);
  };

  _screenOrientation = () => {
    this.screen.orient = window.orientation || 0;
    this.emit(Events.SCREEN_ORIENTATION, {
      orient: this.screen.orient,
    });
  };

  _onCompass = (heading) => {
    this.heading = heading || 0;
  };

  _resize = (evt) => {
    this.landscape = window.innerWidth > window.innerHeight;
    this._screenOrientation();
  };

  listen = () => {
    if (this.listening) {
      return;
    }
    this.listening = true;
    window.addEventListener('devicemotion', this._motion);
    window.addEventListener('deviceorientation', this._deviceOrientation);
    window.addEventListener('orientationchange', this._screenOrientation);
    window.addEventListener('resize', this._resize);
    // this.watchId = Compass.watch(this._onCompass)
  };

  unlisten = () => {
    if (!this.listening) {
      return;
    }
    this.listening = false;
    window.removeEventListener('devicemotion', this._motion);
    window.removeEventListener('deviceorientation', this._deviceOrientation);
    window.removeEventListener('orientationchange', this._screenOrientation);
    window.removeEventListener('resize', this._resize);
    // Compass.unwatch(this.watchId)
  };
}

const gyro = new Gyro();
gyro.Events = Events;
export default gyro;
window.Gyro = gyro;
