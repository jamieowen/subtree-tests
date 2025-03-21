import EventEmitter from './EventEmitter';

const EVENTS = {
  LOADED: 'loaded',
};

export default class ImageLoad {
  constructor(src) {
    Object.assign(this, EventEmitter);

    this.image = new Image();
    this.src = src;
    this.Events = EVENTS;
  }

  load = () => {
    return new Promise((resolve) => {
      this.image.onload = () => {
        setTimeout(() => {
          this.emit(EVENTS.LOADED);
          resolve();
        }, 10);
      };
      this.image.src = this.src;
    });
  };
}
